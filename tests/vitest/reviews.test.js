import { describe, expect, it } from "vitest"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { newReviewSchema, reviewsSchema } from "../../src/utils/reviewsSchema"
import Database from "better-sqlite3"
import {
  deleteReview,
  getUserReview,
  insertReview,
  likeReview,
  updateReview,
} from "../../src/api/reviews/queries"
import * as schema from "../../src/db/schema"

const sqlite = new Database(
  ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/1298067f57f93ced47ab7edeef6597f06c319d51a9c7266417d3fa0df0acf884.sqlite",
)
const db = drizzle(sqlite, { schema })

describe("The media reviews validation", () => {
  it("fails with unallowed sort_by values", () => {
    expect(reviewsSchema.safeParse({ sort_by: "id", sort_order: "1" })).toEqual(
      expect.objectContaining({ success: false }),
    )
  })
  it("falls back to the default sort_by value", () => {
    const result = reviewsSchema.safeParse({ sort_order: "1" })
    expect(result).toEqual(expect.objectContaining({ success: true }))
    expect(result.data).toEqual(expect.objectContaining({ sort_by: "date" }))
  })
})

describe("The new review validation", () => {
  const mockMovie = {
    id: 123,
    title: "mockMovie",
    releaseDate: "1965-10-10",
    poster: "path/to/poster",
    cast: [{ id: 1, name: "actor", profile_path: "path" }],
    directors: [{ id: 1, name: "Director", profile_path: "path" }],
    genres: [{ id: 1 }],
  }
  it("doesnt allow negative ratings", () => {
    const result = newReviewSchema.safeParse({
      rating: -1,
      text: "new review",
      movie: mockMovie,
    })
    expect(result).toEqual(expect.objectContaining({ success: false }))
    expect(result.error.issues[0].path).toEqual(["rating"])
    expect(result.error.issues[0].code).toEqual("too_small")
  })
  it("doesnt allow ratings bigger than 10", () => {
    const result = newReviewSchema.safeParse({
      rating: 11,
      text: "new review",
      movie: mockMovie,
    })
    expect(result).toEqual(expect.objectContaining({ success: false }))
    expect(result.error.issues[0].path).toEqual(["rating"])
    expect(result.error.issues[0].code).toEqual("too_big")
  })
  it("allows empty text", () => {
    const result = newReviewSchema.safeParse({
      rating: 5,
      text: "new review",
      movie: mockMovie,
    })
    expect(result).toEqual(expect.objectContaining({ success: true }))
  })
  it("doesnt allow more than 400 characters of text", () => {
    const longText =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    const result = newReviewSchema.safeParse({
      rating: 6,
      text: longText,
      movie: mockMovie,
    })
    expect(result).toEqual(expect.objectContaining({ success: false }))
    expect(result.error.issues[0].path).toEqual(["text"])
    expect(result.error.issues[0].code).toEqual("too_big")
  })
  it("defaults addToDiary to false", () => {
    const result = newReviewSchema.safeParse({
      rating: 3,
      text: "test",
      movie: mockMovie,
    })
    expect(result.data.addToDiary).toBe(false)
  })
})

describe("The getUserReview query", () => {
  it("returns an empty array if the userId is invalid", async () => {
    const result = await getUserReview(db, 755898, null)
    expect(result).toEqual([])
  })
})

describe("The insertReview query", () => {
  it("doesn't allow duplicated reviews", async () => {
    let result
    try {
      result = await insertReview(
        db,
        "test",
        1,
        "8o0E4dFL8bigp2A35UjKEjFVfr03KOuS",
        755898,
      )
    } catch (e) {
      result = e
    }
    expect(result.code).toBe("SQLITE_CONSTRAINT_UNIQUE")
  })
})

describe("The updateReview query", () => {
  it("doesn't allow to update another user's review", async () => {
    const result = await updateReview(
      db,
      "test",
      1,
      21,
      "BlIFKjnfQ0HhK0HCJ2B7YXM9YapbEDpU",
    )
    expect(result).toEqual([])
  })
})

describe("The deleteReview query", () => {
  it("doesn't allow to delete another user's review", async () => {
    const result = await deleteReview(
      db,
      21,
      "BlIFKjnfQ0HhK0HCJ2B7YXM9YapbEDpU",
    )
    expect(result.changes).toBe(0)
  })
})

describe("The likeReview query", () => {
  it("doesn't allow to like a review twice", async () => {
    let result
    try {
      result = await likeReview(db, 21, "8o0E4dFL8bigp2A35UjKEjFVfr03KOuS")
    } catch (e) {
      result = e
    }
    expect(result.code).toBe("SQLITE_CONSTRAINT_UNIQUE")
  })
  it("doesn't allow to like unexistant reviews", async () => {
    let result
    try {
      result = await likeReview(db, "ABC", "8o0E4dFL8bigp2A35UjKEjFVfr03KOuS")
    } catch (e) {
      result = e
    }
    expect(result.code).toBe("SQLITE_CONSTRAINT_FOREIGNKEY")
  })
})
