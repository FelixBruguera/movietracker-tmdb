import { describe, test, expect, assert, beforeEach, it, vi } from "vitest"
import app from "./src/api/index"
import { drizzle } from "drizzle-orm/d1"
import { and, asc, count, desc, eq } from "drizzle-orm"
import { diary, genresToMedia, likesToReviews, media, people, peopleToMedia, reviews } from "../../src/db/schema"
import { getAuth } from "../../lib/auth.server"
import auth from "../../src/api/middleware/auth"
import { mockDb } from "../mocks/db"
import { authMock, invalidAuthMock } from "../mocks/auth"

vi.mock("drizzle-orm/d1")
vi.mock("../../lib/auth.server")
vi.mock("./middleware/auth", () => authMock)

describe("The GET /reviews/:mediaId endpoint", () => {
  const baseUrl = "http://localhost/api/reviews/3"
  const batchMockResponse = [
    [
        { id: 1, text: "Test review", rating: 5 },
        { id: 2, text: "Another test", rating: 2 },
      ],
      [{ totalReviews: 2, averageRating: 4 }],
    ]
  beforeEach(() => {
    vi.clearAllMocks()
    drizzle.mockReturnValue(mockDb)
  })
  it("falls back to the default values", async () => {
    mockDb.batch.mockReturnValueOnce(batchMockResponse)
    getAuth.mockReturnValue(authMock)
    const request = new Request(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    await app.fetch(request, { DB: {} })
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
  it("transforms the params correctly", async () => {
    mockDb.batch.mockReturnValueOnce(batchMockResponse)
    getAuth.mockReturnValue(authMock)
    const request = new Request(
      `${baseUrl}?sort_by=likes&sort_order=1&page=3`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    )
    await app.fetch(request, { DB: {} })
    expect(mockDb.select().orderBy).toHaveBeenCalledWith(
      asc(count(likesToReviews.reviewId)),
    )
    expect(mockDb.select().offset).toHaveBeenCalledWith(20)
    expect(mockDb.select().limit).toHaveBeenCalledWith(10)
  })
  it("falls back to the default values", async () => {
    mockDb.batch.mockReturnValueOnce(batchMockResponse)
    getAuth.mockReturnValue(invalidAuthMock)
    const request = new Request(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    await app.fetch(request, { DB: {} })
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
})

describe("The GET /reviews/user/:mediaId endpoint", () => {
  const baseUrl = "http://localhost/api/reviews/user/8"
  beforeEach(() => {
    vi.clearAllMocks()
    drizzle.mockReturnValue(mockDb)
  })
  describe("With the user logged in", () => {
    beforeEach(() => {
      getAuth.mockReturnValue(authMock)
    })
    it("uses the parameters correctly", async () => {
      const request = new Request(baseUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      await app.fetch(request, { DB: {} })
      expect(mockDb.select().where).toHaveBeenCalledWith(and(eq(reviews.mediaId, "8"), eq(reviews.userId, 5)))
    })
  })
  describe("Without session", () => {
    beforeEach(() => {
      getAuth.mockReturnValue(invalidAuthMock)
    })
    it("uses the parameters correctly", async () => {
      const request = new Request(baseUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      await app.fetch(request, { DB: {} })
      expect(mockDb.select().where).not.toHaveBeenCalled()
    })
  })
})

describe("The POST /reviews endpoint", () => {
  const baseUrl = "http://localhost/api/reviews"
  const mockMovie = { text: "", rating: 8, movie: { id: 1999, title: "test", releaseDate: "01-01-2005", poster: "path/to/poster", genres: [{id: 5}, {id: 6} ], cast: [{id: 1, name: "test", profile_path: "path/to/profile"}, { id:10, name: "person", profile_path: "path/to/profile"}], directors: [{id: 100, name: "director", job: "Director"} ] }}
  beforeEach(() => {
    vi.clearAllMocks()
    drizzle.mockReturnValue(mockDb)
  })
  describe("With the user logged in", () => {
    beforeEach(() => {
      getAuth.mockReturnValue(authMock)
    })
    it("uses the parameters correctly", async () => {
      const request = new Request(baseUrl, {
        method: "POST",
        body: JSON.stringify(mockMovie),
        headers: { "Content-Type": "application/json" },
      })
      await app.fetch(request, { DB: {} })
      // console.log("RESP", await resp.json())
      expect(mockDb.batch).toHaveBeenCalledTimes(1)
      expect(mockDb.insert).toHaveBeenCalledWith(media)
      expect(mockDb.insert().values).toHaveBeenCalledWith(expect.objectContaining({ id: mockMovie.movie.id, title: mockMovie.movie.title, releaseDate: new Date(mockMovie.movie.releaseDate), poster: mockMovie.movie.poster }))
      expect(mockDb.insert).toHaveBeenCalledWith(people)
      expect(mockDb.insert().values).toHaveBeenCalledWith(expect.objectContaining({ id: mockMovie.movie.cast[0].id, name: mockMovie.movie.cast[0].name, profile_path: mockMovie.movie.cast[0].profile_path }))
      expect(mockDb.insert).toHaveBeenCalledWith(peopleToMedia)
      expect(mockDb.insert().values).toHaveBeenCalledWith(expect.objectContaining({ personId: mockMovie.movie.directors[0].id, mediaId: mockMovie.movie.id, isDirector: true, isCreator: false }))
      expect(mockDb.insert).toHaveBeenCalledWith(genresToMedia)
      expect(mockDb.insert().values).toHaveBeenCalledWith(expect.objectContaining({ genreId: mockMovie.movie.genres[0].id, mediaId: mockMovie.movie.id }))
      expect(mockDb.insert).toHaveBeenCalledWith(reviews)
      expect(mockDb.insert().values).toHaveBeenCalledWith(expect.objectContaining({ text: mockMovie.text, rating: mockMovie.rating, userId: 5, mediaId: mockMovie.movie.id}))
      expect(mockDb.insert).not.toHaveBeenCalledWith(diary)
    })
    it("when add to diary is true, inserts into the diary", async () => {
      const request = new Request(baseUrl, {
        method: "POST",
        body: JSON.stringify({...mockMovie, addToDiary: true}),
        headers: { "Content-Type": "application/json" },
      })
      await app.fetch(request, { DB: {} })
      expect(mockDb.insert).toHaveBeenCalledWith(diary)
      expect(mockDb.insert().values).toHaveBeenCalledWith(expect.objectContaining({ userId: 5, mediaId: mockMovie.movie.id, date: expect.any(Date)}))
    })
  })
  // describe("Without session", () => {
  //   beforeEach(() => {
  //     getAuth.mockReturnValue(authFailureMock)
  //   })
  //   it("uses the parameters correctly", async () => {
  //     const request = new Request(baseUrl, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     })
  //     await app.fetch(request, { DB: {} })
  //     expect(mockDb.select().where).not.toHaveBeenCalled()
  //   })
  // })
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
