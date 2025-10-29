import { describe, expect, it } from "vitest"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { newReviewSchema, reviewsSchema } from "../../src/utils/reviewsSchema"
import Database from "better-sqlite3"
import * as schema from "../../src/db/schema"
import { deleteList, followList, updateList } from "../../src/api/lists/queries"

const sqlite = new Database(
  ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/eea796519a30eaaaf60d174741657467b3f25c541bde63023800a5f8bb62f591.sqlite",
)
const db = drizzle(sqlite, { schema })

describe("The updateList query", () => {
  it("doesn't allow updating another users list", async () => {
    const result = await updateList(
      db,
      { name: "test" },
      "9qOhDu7YxkvvO7YZuI6KIPZVcnzBfExM",
      "c6037ab1-4c29-4cf2-939e-1a8151743f6b",
    )
    expect(result).toEqual([])
  })
})

describe("The deleteList query", () => {
  it("doesn't allow deleting another users list", async () => {
    const result = await deleteList(
      db,
      "c6037ab1-4c29-4cf2-939e-1a8151743f6b",
      "1RIhcRx425vtBSDJt1exA2tswZcFtsTM",
    )
    expect(result.changes).toBe(0)
  })
})

describe("the lists endpoint", async () => {
  let cookie = null
  await fetch("http://localhost:3000/api/auth/sign-in/username", {
    method: "POST",
    body: JSON.stringify({ username: "test", password: "123456789" }),
    headers: { "Content-Type": "application/json" },
  }).then((response) => (cookie = response.headers.getSetCookie()))

  it("doesn't allow to follow your own list", async () => {
    const response = await fetch(
      "http://localhost:3000/api/lists/c6037ab1-4c29-4cf2-939e-1a8151743f6b/follow",
      {
        method: "POST",
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      },
    )
    expect(response.status).toBe(400)
    expect(await response.text()).toEqual("You can't follow your own list")
  })

  it("doesn't allow to follow private lists", async () => {
    const response = await fetch(
      "http://localhost:3000/api/lists/4887fcf8-194c-457d-82b8-06eb032051c4/follow",
      {
        method: "POST",
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      },
    )
    expect(response.status).toBe(400)
    expect(response.status).toBe(400)
    expect(await response.text()).toEqual("You can't follow a private list")
  })
  it("doesn't allow to add media to another users list", async () => {
    const response = await fetch(
      "http://localhost:3000/api/lists/4887fcf8-194c-457d-82b8-06eb032051c4/media",
      {
        method: "POST",
        body: JSON.stringify({ mediaId: "movies_5" }),
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      },
    )
    expect(response.status).toBe(401)
  })
  it("doesn't allow to delete media from another users list", async () => {
    const response = await fetch(
      "http://localhost:3000/api/lists/4887fcf8-194c-457d-82b8-06eb032051c4/media/movies_5",
      {
        method: "DELETE",
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      },
    )
    expect(response.status).toBe(401)
  })
  it("doesn't allow to add duplicate media", async () => {
    const response = await fetch(
      "http://localhost:3000/api/lists/c6037ab1-4c29-4cf2-939e-1a8151743f6b/media",
      {
        method: "POST",
        body: JSON.stringify({ mediaId: "movies_604" }),
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      },
    )
    expect(response.status).toBe(400)
    expect(await response.text()).toEqual("Duplicated media")
  })
  it("returns the correct error when the mediaId is invalid", async () => {
    const response = await fetch(
      "http://localhost:3000/api/lists/c6037ab1-4c29-4cf2-939e-1a8151743f6b/media",
      {
        method: "POST",
        body: JSON.stringify({ mediaId: "movies_abc" }),
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      },
    )
    expect(response.status).toBe(404)
    expect(await response.text()).toEqual("Invalid mediaId")
  })
})
