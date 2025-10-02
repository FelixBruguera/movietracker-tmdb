import { describe, it, expect, vi, beforeEach } from "vitest"
import app from "./src/api/index"
import axios from "axios"

vi.mock("axios")
const createTestEnv = () => {
    return {
        DB: {},
        KV: {
            get: vi.fn(),
            put: vi.fn(),
        },
        TMDB_TOKEN: "test-token",
    }
}
const defaultParams = {
    include_adult: false,
    language: "en-US",
}

describe("The GET /search endpoint", () => {
 const baseUrl = "http://localhost/api/search"
    const env = createTestEnv()
    beforeEach(() => {
        vi.clearAllMocks()
        axios.get.mockResolvedValue({
            data: { results: ["mock search results"] },
            request: {},
        })
    })
    it("Sets the default values", async () => {
        const request = new Request(`${baseUrl}?query=Spongebob`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        const response = await app.fetch(request, env)
        expect(env.KV.get).toHaveBeenCalledTimes(1)
        expect(axios.get).toHaveBeenCalledWith(
            "https://api.themoviedb.org/3/search/multi",
            expect.objectContaining({
                headers: "Authorization: Bearer test-token",
                params: { ...defaultParams, query: "Spongebob" }
        }))
    })
    it("returns a specific error when the querystring is too long", async () => {
        const queryString = new URLSearchParams({
            query: Array(105).fill(1).map((e, i) => e+(i*1)).toString()
        })
        const request = new Request(
            `${baseUrl}?${queryString}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        const response = await app.fetch(request, env)
        const responseBody = await response.json()
        expect(response.status).toBe(400)
        expect(responseBody.error).toContain("query validation failed: Too big")
    })
    it("returns a specific error when the querystring is too small", async () => {
        const queryString = new URLSearchParams({
            query: "aa"
        })
        const request = new Request(
            `${baseUrl}?${queryString}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        const response = await app.fetch(request, env)
        const responseBody = await response.json()
        expect(response.status).toBe(400)
        expect(responseBody.error).toContain("query validation failed: Too small")
    })
    it("writes to the cache after fetching the external api", async () => {
        const request = new Request(`${baseUrl}?query=Spongebob`,
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
        const request = new Request(`${baseUrl}?query=Spongebob`,
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