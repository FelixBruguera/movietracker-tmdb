import { describe, test, expect, assert, beforeAll } from "vitest"

describe("the reviews endpoint", async () => {
  let cookie = null
  beforeAll(async () => {
    await fetch("http://localhost:3000/api/auth/sign-in/username", {
      method: "POST",
      body: JSON.stringify({ username: "test", password: "123456789" }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => (cookie = response.headers.getSetCookie()))
  })
  describe("with invalid requests", () => {
    test("it only allows the creator of a log to delete it", async () => {
      const response = await fetch("http://localhost:3000/api/diary/20", {
        method: "DELETE",
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      })
      expect(response.status).toBe(404)
      //   const userAfter = await fetch(
      //     "http://localhost:3000/api/users/59b99dc7cfa9a34dcd7885dd/reviews",
      //   ).then((data) => data.json())
      //   expect(userAfter[0].info.totalReviews).toEqual(1)
      //   expect(userAfter[0].reviews).toHaveLength(1)
    })
    test("it only allows the creator of a log to update it", async () => {
      const response = await fetch("http://localhost:3000/api/diary/20", {
        method: "PATCH",
        body: JSON.stringify({ date: "2005-01-01", movie: { id: 247043 } }),
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      })
      expect(response.status).toBe(404)
    })
  })
})
