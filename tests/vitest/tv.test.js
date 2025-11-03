import { describe, it, expect, vi, beforeEach } from "vitest"
import app from "./src/api/index"
import axios from "axios"
import tvSchema from "../../src/utils/tvSchema"

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
  with_watch_monetization_types: "flatrate|rent|buy|ads|free",
  with_keywords: "",
  "vote_average.gte": 1,
  "vote_average.lte": 10,
  include_adult: false,
  language: "en-US",
  without_keywords: "155477,1664,190370,267122,171341,229706,251175",
  sort_by: "popularity",
  sort_order: "-1",
  page: 1,
}

describe("The tv validation", () => {
  it("doesn't allow the maximum year to be before the minimum year", () => {
    const result = tvSchema.safeParse({
      ...defaultParams,
      "first_air_date.gte": 2015,
      "first_air_date.lte": 2011,
    })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe("Invalid release year range")
  })
})
describe("The GET /tv endpoint", () => {
  const baseUrl = "http://localhost/api/tv"
  const env = createTestEnv()
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({
      data: { results: ["mock tv show"] },
      request: {},
    })
  })
  it("writes to the cache after fetching the external api", async () => {
    const request = new Request(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(responseBody),
      expect.objectContaining({ expirationTtl: 43200 }),
    )
  })
  it("doesnt fetch the external api when there's a cache hit", async () => {
    env.KV.get = () => Promise.resolve(JSON.stringify({ data: "mocked data" }))
    const request = new Request(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody).toStrictEqual(JSON.stringify({ data: "mocked data" }))
    expect(axios.get).not.toHaveBeenCalled()
  })
})
describe("The GET /tv/:id endpoint", () => {
  const baseUrl = "http://localhost/api/tv/123"
  const env = createTestEnv()
  const mockResponse = {
    credits: {
      cast: Array(30)
        .fill(1)
        .map((e, i) => e + i * 1),
      crew: [
        { id: 1, job: "Camera" },
        { id: 2, job: "Producer" },
        { id: 3, job: "Director" },
        { id: 4, job: "Producer" },
        { id: 5, job: "Makeup" },
        { id: 6, job: "Photography" },
        { id: 7, job: "Photography" },
        { id: 8, job: "Photography" },
        { id: 9, job: "Screenplay" },
        { id: 10, job: "Screenplay" },
        { id: 11, job: "Novel" },
      ],
    },
    "watch/providers": {
      results: {
        UK: { flatrate: [{ id: 1, provider_name: "Apple" }] },
        US: { flatrate: [{ id: 5, provider_name: "HBO" }] },
        CA: { flatrate: [{ id: 7, provider_name: "Amazon" }] },
      },
    },
  }
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({
      data: structuredClone(mockResponse),
      request: {},
    })
  })
  it("filters the watch providers from a region", async () => {
    const request = new Request(`${baseUrl}?region=US`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody["watch/providers"].results).toStrictEqual({
      flatrate: [{ id: 5, provider_name: "HBO" }],
    })
  })
  it("filters the watch providers by region after a cache hit", async () => {
    const scopedEnv = createTestEnv()
    scopedEnv.KV.get = () => Promise.resolve(structuredClone(mockResponse))
    const request = new Request(`${baseUrl}?region=UK`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, scopedEnv)
    const responseBody = await response.json()
    expect(responseBody["watch/providers"].results).toStrictEqual({
      flatrate: [{ id: 1, provider_name: "Apple" }],
    })
  })
  it("writes to the cache after fetching the external api", async () => {
    const request = new Request(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining("credits"),
      expect.objectContaining({ expirationTtl: 86400 }),
    )
  })
  it("doesn't fetch the external api when there's a cache hit", async () => {
    env.KV.get = () => Promise.resolve(JSON.stringify({ data: "mocked data" }))
    const request = new Request(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody).toStrictEqual(JSON.stringify({ data: "mocked data" }))
    expect(axios.get).not.toHaveBeenCalled()
  })
})
describe("The GET /tv/:id/credits endpoint", () => {
  const baseUrl = "http://localhost/api/tv/123/credits"
  const env = createTestEnv()
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({
      data: { mock: "response" },
      request: {},
    })
  })
  it("writes to the cache after fetching the external api", async () => {
    const request = new Request(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    await app.fetch(request, env)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining("mock"),
      expect.objectContaining({ expirationTtl: 86400 }),
    )
  })
  it("doesn't fetch the external api when there's a cache hit", async () => {
    env.KV.get = () => Promise.resolve(JSON.stringify({ data: "mocked data" }))
    const request = new Request(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody).toStrictEqual(JSON.stringify({ data: "mocked data" }))
    expect(axios.get).not.toHaveBeenCalled()
  })
})
