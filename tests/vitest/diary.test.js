import { describe, test, expect, assert, beforeAll, it } from "vitest"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import * as schema from "../../src/db/schema"
import { newLogSchema } from "../../src/utils/diarySchema"
import { deleteLog, updateLog } from "../../src/api/diary/queries"

const sqlite = new Database(
  ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/eea796519a30eaaaf60d174741657467b3f25c541bde63023800a5f8bb62f591.sqlite",
)
const db = drizzle(sqlite, { schema })

describe("the newReview validation", () => {
  it("doesn't accept invalid dates", () => {
    const result = newLogSchema.safeParse({ date: "20155-10-15", mediaId: "movies_123"})
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
        40,
        "S8m2tU3iSm8IbVVKBeCUloWpcYzPvuBg",
      )
    expect(result).toEqual([])
  })
})

describe("The deleteLog query", () => {
  it("doesn't allow to delete another user's log", async () => {
    const result = await deleteLog(
        db,
        40,
        "S8m2tU3iSm8IbVVKBeCUloWpcYzPvuBg",
      )
    expect(result.changes).toBe(0)
  })
})
