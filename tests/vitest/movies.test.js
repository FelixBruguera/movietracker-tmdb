import { describe, it, expect, vi, beforeEach } from "vitest"
import app from "./src/api/index"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "./src/db/schema"
import axios from "axios"

vi.mock("axios")

describe("The GET /movies endpoint", () => {
    const baseUrl = "http://localhost/api/movies"
    const defaultParams = {
        "with_watch_monetization_types": "flatrate|rent|buy|ads|free",
        "with_keywords": "",
        "vote_average.gte": 1,
        "vote_average.lte": 10,
        include_adult: false,
        language: "en-US",
        without_keywords: "155477,1664,190370,267122,171341,229706,251175",
        sort_by: "popularity.desc",
        sort_order: -1,
        page: 1
    }
    const env = {
        DB: {},
        KV: {
            get: vi.fn(),
            put: vi.fn(),
        },
        TMDB_TOKEN: "test-token",
    }
    beforeEach(() => {
        vi.clearAllMocks()
        axios.get.mockResolvedValue({
            data: { results: ["mock movie"] },
            request: {},
        })
    })
    it("Sets the default values when the querystring is empty", async () => {
        const request = new Request(baseUrl,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        const response = await app.fetch(request, env)
        expect(env.KV.get).toHaveBeenCalledTimes(1)
        expect(axios.get).toHaveBeenCalledWith(
            "https://api.themoviedb.org/3/discover/movie",
            expect.objectContaining({
                headers: "Authorization: Bearer test-token",
                params: defaultParams
        }))
    })
    it("Transforms the querystring correctly", async () => {
        const queryString = new URLSearchParams({
            with_genres: "1,2,3",
            with_watch_providers: "4,5,6",
            with_keywords: encodeURIComponent(
                JSON.stringify([{ id: 8, name: "testing" }]),
            ),
            "primary_release_date.gte": "2019",
            "primary_release_date.lte": "2022",
        })
        const request = new Request(
            `${baseUrl}?${queryString}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        const response = await app.fetch(request, env)
        expect(env.KV.get).toHaveBeenCalledTimes(1)
        expect(axios.get).toHaveBeenCalledWith(
            "https://api.themoviedb.org/3/discover/movie",
            expect.objectContaining({
                headers: "Authorization: Bearer test-token",
                params: {
                    ...defaultParams,
                    "primary_release_date.gte": "2019-01-01", 
                    "primary_release_date.lte": "2022-12-31",
                    with_keywords: "8",
                    with_genres: "1|2|3",
                    with_watch_providers: "4|5|6"
            }}
        ))
    })
    it("writes to the cache after fetching the external api", async () => {
        const request = new Request(baseUrl,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        const response = await app.fetch(request, env)
        const responseBody = await response.json()
        expect(axios.get).toHaveBeenCalledTimes(1)
        expect(env.KV.put).toHaveBeenCalledTimes(1)
        expect(env.KV.put).toHaveBeenCalledWith(expect.any(String), JSON.stringify(responseBody), expect.objectContaining({ expirationTtl: 43200}))
    })
    it("doesnt fetch the external api when there's a cache hit", async () => {
        env.KV.get = () => Promise.resolve(JSON.stringify({ data: "mocked data"}))
        const request = new Request(baseUrl,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        const response = await app.fetch(request, env)
        const responseBody = await response.json()
        expect(responseBody).toStrictEqual(JSON.stringify({data: "mocked data"}))
        expect(axios.get).not.toHaveBeenCalled()
    })
})
describe("The GET /movies/:id endpoint", () => {
    const baseUrl = "http://localhost/api/movies/123"
    const env = {
        DB: {},
        KV: {
            get: vi.fn(),
            put: vi.fn(),
        },
        TMDB_TOKEN: "test-token",
    }
    beforeEach(() => {
        vi.clearAllMocks()
        axios.get.mockResolvedValue({
            data: { 
                credits: {
                    cast: Array(30).fill(1).map((e, i) => e+(i*1)),
                    crew: [{id: 1, job: "Camera"}, { id: 2, job: "Producer"}, { id: 3, job: "Director"}, { id: 4, job: "Producer"},
                        { id: 5, job: "Makeup"}, { id: 6, job: "Photography"}, { id: 7, job: "Photography"}, { id: 8, job: "Photography"},
                        { id: 9, job: "Screenplay"}, { id: 10, job: "Screenplay"}, {id: 11, job: "Novel"}
                    ]
                },
                "watch/providers": {
                    results: {
                        UK: {flatrate: [{id: 1, provider_name: "Apple"}]},
                        US: {flatrate: [{id: 5, provider_name: "HBO"}]},
                        CA: {flatrate: [{id: 7, provider_name: "Amazon"}]}
                    }
                }
            },
            request: {},
        })
    })
    it("transforms the cast, director and crew correctly", async () => {
        const request = new Request(baseUrl,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        const response = await app.fetch(request, env)
        const responseBody = await response.json()
        expect(responseBody.credits.cast).toStrictEqual(Array(20).fill(1).map((e, i) => e+(i*1)))
        expect(responseBody.credits.directors).toStrictEqual([{id: 3, job: "Director"}])
        expect(responseBody.credits.crew).toHaveLength(10)
        expect(responseBody.credits.crew).not.toContainEqual({id: 10, job: "Novel"})
    })
    it("correctly selects the watch providers from a region", async () => {
        const request = new Request(
            `${baseUrl}?region=US`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        const response = await app.fetch(request, env)
        const responseBody = await response.json()
        expect(responseBody["watch/providers"].results).toStrictEqual({flatrate: [{id: 5, provider_name: "HBO"}]})
    })
    it("writes to the cache after fetching the external api", async () => {
        const request = new Request(baseUrl,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        const response = await app.fetch(request, env)
        const responseBody = await response.json()
        expect(axios.get).toHaveBeenCalledTimes(1)
        expect(env.KV.put).toHaveBeenCalledTimes(1)
        expect(env.KV.put).toHaveBeenCalledWith(expect.any(String), expect.stringContaining("credits"), expect.objectContaining({ expirationTtl: 86400}))
    })
    it("doesn't fetch the external api when there's a cache hit", async () => {
        env.KV.get = () => Promise.resolve(JSON.stringify({ data: "mocked data"}))
        const request = new Request(baseUrl,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        const response = await app.fetch(request, env)
        const responseBody = await response.json()
        expect(responseBody).toStrictEqual(JSON.stringify({data: "mocked data"}))
        expect(axios.get).not.toHaveBeenCalled()
    })

})