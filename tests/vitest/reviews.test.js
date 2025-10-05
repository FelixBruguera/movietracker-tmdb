import { describe, test, expect, assert, beforeEach, it, vi } from "vitest"
import app from "./src/api/index"
import { drizzle } from "drizzle-orm/d1"
import { asc, count, desc, eq } from "drizzle-orm"
import { likesToReviews, reviews } from "../../src/db/schema"

vi.mock("drizzle-orm/d1")

const mockQueryBuilder = {
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  leftJoin: vi.fn().mockReturnThis(),
  fullJoin: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  groupBy: vi.fn().mockReturnThis(),
  offset: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
}

const mockDb = {
  select: vi.fn(() => mockQueryBuilder),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn(),
  batch: vi.fn(),
  update: vi.fn(() => mockUpdate),
}

describe("The GET /reviews/:mediaId endpoint", () => {
  const baseUrl = "http://localhost/api/reviews/3"
  beforeEach(() => {
    vi.clearAllMocks()
    drizzle.mockReturnValue(mockDb)
  })
  it.only("falls back to the default values", async () => {
    mockDb.batch.mockReturnValueOnce([
      [
        { id: 1, text: "Test review", rating: 5 },
        { id: 2, text: "Another test", rating: 2 },
      ],
      [{ totalReviews: 2, averageRating: 4 }],
    ])
    const request = new Request(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const response = await app.fetch(request, { DB: {} })
    const data = await response.json()
    console.log(data)
    expect(mockDb.batch).toHaveBeenCalledTimes(1)
    expect(mockDb.select).toHaveBeenCalledTimes(2)
    expect(mockDb.select().where).toHaveBeenCalledWith(eq(reviews.mediaId, "3"))
    expect(mockDb.select().groupBy).toHaveBeenCalledWith(reviews.id)
    expect(mockDb.select().orderBy).toHaveBeenCalledWith(
      desc(reviews.createdAt),
    )
    expect(mockDb.select().offset).toHaveBeenCalledWith(0)
    expect(mockDb.select().limit).toHaveBeenCalledWith(10)
  })
  it.only("transforms the params correctly", async () => {
    mockDb.batch.mockReturnValueOnce([
      [
        { id: 1, text: "Test review", rating: 5 },
        { id: 2, text: "Another test", rating: 2 },
      ],
      [{ totalReviews: 2, averageRating: 4 }],
    ])
    const request = new Request(
      `${baseUrl}?sort_by=likes&sort_order=1&page=3`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    )
    const response = await app.fetch(request, { DB: {} })
    const data = await response.json()
    expect(mockDb.select().orderBy).toHaveBeenCalledWith(
      asc(count(likesToReviews.reviewId)),
    )
    expect(mockDb.select().offset).toHaveBeenCalledWith(20)
    expect(mockDb.select().limit).toHaveBeenCalledWith(10)
  })
})

// describe("the reviews endpoint", async () => {
//   let cookie = null
//   beforeAll(async () => {
//     await fetch("http://localhost:3000/api/auth/sign-in/username", {
//       method: "POST",
//       body: JSON.stringify({ username: "test", password: "123456789" }),
//       headers: { "Content-Type": "application/json" },
//     }).then((response) => (cookie = response.headers.getSetCookie()))
//   })
//   describe("with invalid requests", () => {
//     test("it only allows valid ratings", async () => {
//       const response = await fetch("http://localhost:3000/api/reviews", {
//         method: "POST",
//         body: JSON.stringify({
//           text: "testing",
//           rating: "15",
//           movie_id: { title: "test", id: 5305 },
//         }),
//         headers: { Cookie: cookie, "Content-Type": "application/json" },
//       })
//       expect(response.status).toBe(500)
//     })
//     test("when a review is duplicated the transaction fails", async () => {
//       const response = await fetch("http://localhost:3000/api/reviews/", {
//         method: "POST",
//         body: JSON.stringify({
//           text: "Good movie",
//           rating: "8",
//           movie: { title: "test", id: 755898 },
//           create_log: true,
//         }),
//         headers: { Cookie: cookie, "Content-Type": "application/json" },
//       })
//       expect(response.status).toBe(404)
//       //   const reviewsAfter = await fetch(
//       //     "http://localhost:3000/api/users/6873aee958fc5297537ac5a6/reviews",
//       //   ).then((data) => data.json())
//       //   expect(reviewsAfter[0].info.totalReviews).toBe(1)
//       //   const logsAfter = await fetch(
//       //     "http://localhost:3000/api/users/6873aee958fc5297537ac5a6/diary",
//       //   ).then((data) => data.json())
//       //   expect(logsAfter[0].movies).toHaveLength(0)
//     })
//     test("it only allows the creator of a review to delete it", async () => {
//       const response = await fetch("http://localhost:3000/api/reviews/25", {
//         method: "DELETE",
//         headers: { Cookie: cookie, "Content-Type": "application/json" },
//       })
//       expect(response.status).toBe(404)
//       //   const userAfter = await fetch(
//       //     "http://localhost:3000/api/users/59b99dc7cfa9a34dcd7885dd/reviews",
//       //   ).then((data) => data.json())
//       //   expect(userAfter[0].info.totalReviews).toEqual(1)
//       //   expect(userAfter[0].reviews).toHaveLength(1)
//     })
//     test("it only allows the creator of a review to update it", async () => {
//       const response = await fetch("http://localhost:3000/api/reviews/25", {
//         method: "PATCH",
//         body: JSON.stringify({
//           text: "testing",
//           rating: "5",
//           movie: { id: 755898 },
//         }),
//         headers: { Cookie: cookie, "Content-Type": "application/json" },
//       })
//       expect(response.status).toBe(404)
//     })
//     test("it doesn't allow to like a review more than once", async () => {
//       const response = await fetch(
//         "http://localhost:3000/api/reviews/like/21",
//         {
//           method: "POST",
//           headers: { Cookie: cookie, "Content-Type": "application/json" },
//         },
//       )
//       expect(response.status).toBe(500)
//     })
//   })
// })
