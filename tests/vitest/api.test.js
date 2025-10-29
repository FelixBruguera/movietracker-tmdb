import { describe, test, expect, assert, beforeEach, it, vi } from "vitest"
import { diary, likesToReviews, reviews } from "../../src/db/schema"
import { asc, count, desc, sql } from "drizzle-orm"
import { formatValidationError, getSort } from "../../src/api/functions"
import { baseSchema } from "../../src/utils/baseSchema"
import axios from "axios"
import app from "./src/api/index"

vi.mock("axios")

describe("The getSort function", () => {
  it("Returns the correct option with ascending order", () => {
    const testOptions = {
      date: reviews.createdAt,
      likes: count(likesToReviews),
      rating: reviews.rating,
    }
    const result = getSort({ sort_by: "likes", sort_order: 1 }, testOptions)
    expect(result).toStrictEqual(asc(testOptions.likes))
  })
  it("Returns the correct option with descending order", () => {
    const testOptions = {
      monthly: sql`strftime('%Y-%m', ${diary.date}, 'unixepoch')`,
      yearly: sql`strftime('%Y', ${diary.date}, 'unixepoch')`,
    }
    const result = getSort({ sort_by: "yearly", sort_order: -1 }, testOptions)
    expect(result).toStrictEqual(desc(testOptions.yearly))
  })
})

describe("The formatValidation function", () => {
  it("formats zod errors correctly", () => {
    const result = formatValidationError(
      baseSchema.safeParse({ sort_order: 0 }),
    )
    expect(result).toEqual({
      error:
        'sort_order validation failed: Invalid option: expected one of "1"|"-1"',
    })
  })
})

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

describe("The GET /company/:company endpoint", () => {
  const baseUrl = "http://localhost/api/company/123"
  const env = createTestEnv()
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({
      data: { results: { mock: "response" } },
      request: {},
    })
  })
  it("writes to the cache after fetching the external api", async () => {
    const request = new Request(`${baseUrl}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledWith(
      "company_123",
      JSON.stringify(responseBody),
      expect.objectContaining({ expirationTtl: 604800 }),
    )
  })
  it("doesnt fetch the external api when there's a cache hit", async () => {
    env.KV.get = () =>
      Promise.resolve(JSON.stringify({ data: { mock: "response" } }))
    const request = new Request(`${baseUrl}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody).toStrictEqual(
      JSON.stringify({ data: { mock: "response" } }),
    )
    expect(axios.get).not.toHaveBeenCalled()
  })
})

describe("The GET /network/:company endpoint", () => {
  const baseUrl = "http://localhost/api/network/123"
  const env = createTestEnv()
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({
      data: { results: { mock: "response" } },
      request: {},
    })
  })
  it("writes to the cache after fetching the external api", async () => {
    const request = new Request(`${baseUrl}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledWith(
      "network_123",
      JSON.stringify(responseBody),
      expect.objectContaining({ expirationTtl: 604800 }),
    )
  })
  it("doesnt fetch the external api when there's a cache hit", async () => {
    env.KV.get = () =>
      Promise.resolve(JSON.stringify({ data: { mock: "response" } }))
    const request = new Request(`${baseUrl}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody).toStrictEqual(
      JSON.stringify({ data: { mock: "response" } }),
    )
    expect(axios.get).not.toHaveBeenCalled()
  })
})

describe("The GET /services/:region endpoint", () => {
  const baseUrl = "http://localhost/api/services/AU"
  const env = createTestEnv()
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({
      data: { results: [{ mock: "response" }] },
      request: {},
    })
  })
  it("writes to the cache after fetching the external api", async () => {
    const request = new Request(`${baseUrl}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledTimes(1)
    expect(env.KV.put).toHaveBeenCalledWith(
      "services_AU",
      JSON.stringify(responseBody),
      expect.objectContaining({ expirationTtl: 604800 }),
    )
  })
  it("doesnt fetch the external api when there's a cache hit", async () => {
    env.KV.get = () =>
      Promise.resolve(JSON.stringify({ data: { mock: "response" } }))
    const request = new Request(`${baseUrl}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, env)
    const responseBody = await response.json()
    expect(responseBody).toStrictEqual(
      JSON.stringify({ data: { mock: "response" } }),
    )
    expect(axios.get).not.toHaveBeenCalled()
  })
})
