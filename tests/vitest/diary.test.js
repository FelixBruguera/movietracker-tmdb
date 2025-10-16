import { describe, test, expect, assert, beforeAll, it } from "vitest"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import * as schema from "../../src/db/schema"
import { newLogSchema } from "../../src/utils/diarySchema"
import { deleteLog, updateLog } from "../../src/api/diary/queries"

const sqlite = new Database(
  ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/1298067f57f93ced47ab7edeef6597f06c319d51a9c7266417d3fa0df0acf884.sqlite",
)
const db = drizzle(sqlite, { schema })

describe("the newReview validation", () => {
  const mockMovie = {
    id: 123,
    title: "mockMovie",
    releaseDate: 1965,
    poster: "path/to/poster",
    cast: [{ id: 1, name: "actor", profile_path: "path" }],
    directors: [{ id: 1, name: "Director", profile_path: "path" }],
    genres: [{ id: 1 }],
  }
  it("doesn't accept invalid dates", () => {
    const result = newLogSchema.safeParse({ date: "20155-10-15", movie: mockMovie})
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toEqual(["date"])
    expect(result.error.issues[0].code).toBe("invalid_format")
  })
})

describe("The updateLog query", () => {
  it("doesn't allow to update another user's log", async () => {
    const result = await updateLog(
        db,
        new Date(),
        3,
        "8o0E4dFL8bigp2A35UjKEjFVfr03KOuS",
      )
    expect(result).toEqual([])
  })
})

describe("The deleteLog query", () => {
  it("doesn't allow to delete another user's log", async () => {
    const result = await deleteLog(
        db,
        4,
        "8o0E4dFL8bigp2A35UjKEjFVfr03KOuS",
      )
    expect(result.changes).toBe(0)
  })
})
