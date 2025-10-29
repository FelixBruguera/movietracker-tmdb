import { describe, it, expect, vi, beforeEach } from "vitest"
import app from "./src/api/index"
import axios from "axios"
import {
  filterByDepartment,
  paginate,
  sortBy,
} from "../../src/api/people/functions"

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

describe("The filterByDepartment function", () => {
  it("concats cast and crew when department is 'All'", () => {
    const result = filterByDepartment("All", mockData)
    expect(result.length).toBe(5)
    expect(result).toEqual([...mockData.cast, ...mockData.crew])
  })
  it("returns cast when department is 'Acting'", () => {
    const result = filterByDepartment("Acting", mockData)
    expect(result.length).toBe(mockData.cast.length)
    expect(result).toEqual(mockData.cast)
  })
  it("filters the data by custom deparments", () => {
    const result = filterByDepartment("Production", mockData)
    expect(result.length).toBe(1)
    expect(result).toEqual([
      {
        id: 4,
        department: "Production",
        vote_average: 3,
        vote_count: 5,
        release_date: "2005-01-31",
      },
    ])
  })
  it("returns an empty array when the department doesn't match", () => {
    const result = filterByDepartment("Coding", mockData)
    expect(result).toEqual([])
  })
})

describe("The sortBy function", () => {
  it("sorts by best rated", () => {
    const result = sortBy("Best Rated", "movies", mockData.crew)
    expect(result[0].id).toBe(3)
    expect(result.at(-1).id).toBe(4)
  })
  it("sorts by most votes", () => {
    const result = sortBy("Most votes", "movies", mockData.crew)
    expect(result[0].id).toBe(5)
    expect(result.at(-1).id).toBe(4)
  })
  it("sorts by date when the scope is movies", () => {
    const result = sortBy("Most recent", "movies", mockData.crew)
    expect(result[0].id).toBe(3)
    expect(result.at(-1).id).toBe(4)
  })
  it("sorts by date when the scope is tv", () => {
    const data = [
      { id: 1, first_credit_air_date: "1999-12-25" },
      { id: 2, first_credit_air_date: "1999-12-12" },
      { id: 3, first_credit_air_date: "1999-12-15" },
    ]
    const result = sortBy("Most recent", "tv_credits", data)
    expect(result[0].id).toBe(1)
    expect(result.at(-1).id).toBe(2)
  })
})

describe("The paginate function", () => {
  const data = Array(50)
    .fill(1)
    .map((e, i) => e + i * 1)
  it("returns the first page", () => {
    const result = paginate(1, 20, data)
    expect(result).toHaveLength(20)
    expect(result[0]).toBe(1)
    expect(result.at(-1)).toBe(20)
  })
  it("returns the second page", () => {
    const result = paginate(2, 20, data)
    expect(result).toHaveLength(20)
    expect(result[0]).toBe(21)
    expect(result.at(-1)).toBe(40)
  })
  it("returns an empty array if the page is out of bounds", () => {
    const result = paginate(10, 20, data)
    expect(result).toEqual([])
  })
})

describe("The GET /people/:person/credits endpoint with the movies scope", () => {
  const baseUrl = "http://localhost/api/people/25/credits"
  const env = createTestEnv()
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({
      data: mockData,
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
