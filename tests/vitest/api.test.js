import { describe, test, expect, assert, beforeAll, it } from "vitest"
import { diary, likesToReviews, reviews } from "../../src/db/schema"
import { asc, count, desc, sql } from "drizzle-orm"
import { getSort } from "../../src/api/functions"

describe("The getSort function", () => {
  it.only("Returns the correct option with ascending order", () => {
    const testOptions = {
      date: reviews.createdAt,
      likes: count(likesToReviews),
      rating: reviews.rating,
    }
    const result = getSort({ sort_by: "likes", sort_order: 1 }, testOptions)
    expect(result).toStrictEqual(asc(testOptions.likes))
  })
  it.only("Returns the correct option with descending order", () => {
    const testOptions = {
      monthly: sql`strftime('%Y-%m', ${diary.date}, 'unixepoch')`,
      yearly: sql`strftime('%Y', ${diary.date}, 'unixepoch')`,
    }
    const result = getSort({ sort_by: "yearly", sort_order: -1 }, testOptions)
    expect(result).toStrictEqual(desc(testOptions.yearly))
  })
})
