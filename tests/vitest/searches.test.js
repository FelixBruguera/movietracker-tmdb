import { describe, test, expect, assert, beforeAll } from "vitest"

describe("the user/searches endpoint", async () => {
  let cookie = null
  beforeAll(async () => {
    await fetch("http://localhost:3000/api/auth/sign-in/username", {
      method: "POST",
      body: JSON.stringify({ username: "test", password: "123456789" }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => (cookie = response.headers.getSetCookie()))
  })
  describe("with invalid requests", () => {
    test("it only allows the creator of a search to update it ", async () => {
      const response = await fetch(
        "http://localhost:3000/api/user/searches/55",
        {
          method: "PATCH",
          body: JSON.stringify({
            name: "testing",
          }),
          headers: { Cookie: cookie, "Content-Type": "application/json" },
        },
      )
      expect(response.status).toBe(404)
    })
    test("it only allows the creator of a search to delete it ", async () => {
      const response = await fetch(
        "http://localhost:3000/api/user/searches/55",
        {
          method: "DELETE",
          headers: { Cookie: cookie, "Content-Type": "application/json" },
        },
      )
      expect(response.status).toBe(404)
    })
  })
})
