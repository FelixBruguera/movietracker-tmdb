import { describe, test, expect, beforeAll } from "vitest"

describe("the lists endpoint", async () => {
  let cookie = null
  beforeAll(async () => {
    await fetch("http://localhost:3000/api/auth/sign-in/username", {
      method: "POST",
      body: JSON.stringify({ username: "test", password: "123456789" }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => (cookie = response.headers.getSetCookie()))
  })

  describe("with invalid requests", () => {
    test("it only allows the creator of a list to delete it", async () => {
      const response = await fetch(
        "http://localhost:3000/api/lists/4428a02e-80b8-409a-bd51-2958889f922d",
        {
          method: "DELETE",
          headers: { Cookie: cookie, "Content-Type": "application/json" },
        },
      )
      expect(response.status).toBe(404)
    })
    test("it only allows the creator of a list to update it", async () => {
      const response = await fetch(
        "http://localhost:3000/api/lists/4428a02e-80b8-409a-bd51-2958889f922d",
        {
          method: "PATCH",
          body: JSON.stringify({
            name: "testing",
            description: "test",
            isPrivate: false,
            isWatchlist: false,
          }),
          headers: { Cookie: cookie, "Content-Type": "application/json" },
        },
      )
      expect(response.status).toBe(404)
    })
    test("a user cannot follow their own list", async () => {
      const response = await fetch(
        "http://localhost:3000/api/lists/14a4b7ec-76ca-4ee3-8494-1f4cdae20cb1/follow",
        {
          method: "POST",
          headers: { Cookie: cookie, "Content-Type": "application/json" },
        },
      )
      expect(response.status).toBe(400)
    })

    test("a user cannot follow a private list", async () => {
      const response = await fetch(
        "http://localhost:3000/api/lists/03bea2de-9058-4178-a1d8-5969a9548c40/follow",
        {
          method: "POST",
          headers: { Cookie: cookie, "Content-Type": "application/json" },
        },
      )
      expect(response.status).toBe(400)
    })
  })
})
