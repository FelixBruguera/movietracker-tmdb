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
  scope: "movie_credits",
  department: "All",
  sort_by: "Most recent",
}

describe("The GET /people/:person endpoint", () => {
  const baseUrl = "http://localhost/api/people/25"
  const env = createTestEnv()
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({
      data: { results: ["mock person"] },
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
      expect.objectContaining({ expirationTtl: 604800 }),
    )
  })
  it("doesnt fetch the external api when there's a cache hit", async () => {
    env.KV.get = () => Promise.resolve(JSON.stringify({ data: "mocked data" }))
    const request = new Request(`${baseUrl}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody).toStrictEqual(JSON.stringify({ data: "mocked data" }))
    expect(axios.get).not.toHaveBeenCalled()
  })
})

describe("The GET /people/:person/credits endpoint with the movies scope", () => {
  const baseUrl = "http://localhost/api/people/25/credits"
  const mockData = {
    cast: [
      {
        id: 1,
        character: "Lorem",
        vote_average: 5,
        vote_count: 50,
        release_date: "2025-03-03",
      },
      {
        id: 2,
        character: "Ipsum",
        vote_average: 8,
        vote_count: 10,
        release_date: "2025-01-03",
      },
    ],
    crew: [
      {
        id: 3,
        department: "Camera",
        vote_average: 9,
        vote_count: 9,
        release_date: "2022-03-03",
      },
      {
        id: 4,
        department: "Production",
        vote_average: 3,
        vote_count: 5,
        release_date: "2005-01-31",
      },
      {
        id: 5,
        department: "Directing",
        vote_average: 5,
        vote_count: 100,
        release_date: "2015-11-18",
      },
    ],
  }
  const env = createTestEnv()
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({
      data: mockData,
      request: {},
    })
  })
  it("returns a specific validation error", async () => {
    const queryString = new URLSearchParams({
      scope: "All",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(response.status).toBe(400)
    expect(responseBody.error).toContain("scope validation failed")
  })
  it("filters by an specific department", async () => {
    const queryString = new URLSearchParams({
      scope: "Movies",
      department: "Directing",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results).toStrictEqual([mockData.crew[2]])
  })
  it("filters by the acting department", async () => {
    const queryString = new URLSearchParams({
      scope: "Movies",
      department: "Acting",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results).toStrictEqual(mockData.cast)
  })
  it("filters by all departments", async () => {
    const queryString = new URLSearchParams({
      scope: "Movies",
      department: "All",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results).toStrictEqual(
      [...mockData.cast, ...mockData.crew].sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date),
      ),
    )
  })
  it("sorts by best rating", async () => {
    const queryString = new URLSearchParams({
      scope: "Movies",
      sort_by: "Best rated",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results[0]).toStrictEqual(mockData.crew[0])
    expect(responseBody.results.at(-1)).toStrictEqual(mockData.crew[1])
  })
  it("sorts by most votes", async () => {
    const queryString = new URLSearchParams({
      scope: "Movies",
      sort_by: "Most votes",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results[0]).toStrictEqual(mockData.crew[2])
    expect(responseBody.results.at(-1)).toStrictEqual(mockData.crew[1])
  })
  it("sorts by most recent", async () => {
    const queryString = new URLSearchParams({
      scope: "Movies",
      sort_by: "Most recent",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results[0]).toStrictEqual(mockData.cast[0])
    expect(responseBody.results.at(-1)).toStrictEqual(mockData.crew[1])
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
      expect.stringContaining("cast"),
      expect.objectContaining({ expirationTtl: 86400 }),
    )
  })
  it("doesnt fetch the external api when there's a cache hit", async () => {
    env.KV.get = () => Promise.resolve(mockData)
    const request = new Request(`${baseUrl}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results).toStrictEqual(
      [...mockData.cast, ...mockData.crew].sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date),
      ),
    )
    expect(axios.get).not.toHaveBeenCalled()
  })
})

describe("Pagination of the GET /people/:person/credits endpoint", () => {
  const baseUrl = "http://localhost/api/people/25/credits"
  const env = createTestEnv()
  const largeMockData = {
    cast: Array.from({ length: 15 }, (_, i) => ({
      id: `cast${i}`,
      release_date: "2023-01-01",
      vote_average: 5,
      vote_count: 5,
    })),
    crew: Array.from({ length: 15 }, (_, i) => ({
      id: `crew${i}`,
      release_date: "2023-01-01",
      vote_average: 5,
      vote_count: 5,
    })),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({
      data: largeMockData,
      request: {},
    })
  })

  it("returns the first page with the correct items and page count", async () => {
    const request = new Request(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()

    expect(responseBody.results.length).toBe(20)
    expect(responseBody.results).toContainEqual({id: "cast14", release_date: "2023-01-01", vote_average: 5, vote_count: 5})
    expect(responseBody.page).toBe(1)
    expect(responseBody.total_pages).toBe(2)
  })

  it("returns the second page with the remaining items", async () => {
    const request = new Request(`${baseUrl}?page=2`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()

    expect(responseBody.results.length).toBe(10)
    expect(responseBody.results).not.toContainEqual({id: "cast14", release_date: "2023-01-01", vote_average: 5, vote_count: 5})
    expect(responseBody.results).toContainEqual({id: "crew14", release_date: "2023-01-01", vote_average: 5, vote_count: 5})
    expect(responseBody.page).toBe(2)
    expect(responseBody.total_pages).toBe(2)
  })

  it("returns an empty array for a page that is out of bounds", async () => {
    const request = new Request(`${baseUrl}?page=3`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()

    expect(responseBody.results).toStrictEqual([])
    expect(responseBody.page).toBe(3)
    expect(responseBody.total_pages).toBe(2)
  })

  it("returns a validation error for an invalid page number", async () => {
    const request = new Request(`${baseUrl}?page=abc`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.error).toContain("validation failed")
  })
})

describe("The GET /people/:person/credits endpoint with the tv scope", () => {
  const baseUrl = "http://localhost/api/people/25/credits"
  const mockData = {
    cast: [
      {
        id: 1,
        character: "Lorem",
        vote_average: 5,
        vote_count: 50,
        first_credit_air_date: "2025-03-03",
      },
      {
        id: 2,
        character: "Ipsum",
        vote_average: 8,
        vote_count: 10,
        first_credit_air_date: "2025-01-03",
      },
    ],
    crew: [
      {
        id: 3,
        department: "Camera",
        vote_average: 9,
        vote_count: 9,
        first_credit_air_date: "2022-03-03",
      },
      {
        id: 4,
        department: "Production",
        vote_average: 3,
        vote_count: 5,
        first_credit_air_date: "2005-01-31",
      },
      {
        id: 5,
        department: "Directing",
        vote_average: 5,
        vote_count: 100,
        first_credit_air_date: "2015-11-18",
      },
    ],
  }
  const env = createTestEnv()
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({
      data: mockData,
      request: {},
    })
  })
  it("filters by an specific department", async () => {
    const queryString = new URLSearchParams({
      scope: "TV Shows",
      department: "Directing",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results).toStrictEqual([mockData.crew[2]])
  })
  it("filters by the acting department", async () => {
    const queryString = new URLSearchParams({
      scope: "TV Shows",
      department: "Acting",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results).toStrictEqual(mockData.cast)
  })
  it("filters by all departments", async () => {
    const queryString = new URLSearchParams({
      scope: "TV Shows",
      department: "All",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results).toStrictEqual(
      [...mockData.cast, ...mockData.crew].sort(
        (a, b) =>
          new Date(b.first_credit_air_date) - new Date(a.first_credit_air_date),
      ),
    )
  })
  it("sorts by best rating", async () => {
    const queryString = new URLSearchParams({
      scope: "TV Shows",
      sort_by: "Best rated",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results[0]).toStrictEqual(mockData.crew[0])
    expect(responseBody.results.at(-1)).toStrictEqual(mockData.crew[1])
  })
  it("sorts by most votes", async () => {
    const queryString = new URLSearchParams({
      scope: "TV Shows",
      sort_by: "Most votes",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results[0]).toStrictEqual(mockData.crew[2])
    expect(responseBody.results.at(-1)).toStrictEqual(mockData.crew[1])
  })
  it("sorts by most recent", async () => {
    const queryString = new URLSearchParams({
      scope: "TV Shows",
      sort_by: "Most recent",
    })
    const request = new Request(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody.results[0]).toStrictEqual(mockData.cast[0])
    expect(responseBody.results.at(-1)).toStrictEqual(mockData.crew[1])
  })
})
