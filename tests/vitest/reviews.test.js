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
    test("it only allows valid ratings", async () => {
      const response = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          text: "testing",
          rating: "15",
          movie_id: { title: "test", id: 5305 },
        }),
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      })
      expect(response.status).toBe(500)
    })
    test("when a review is duplicated the transaction fails", async () => {
      const response = await fetch("http://localhost:3000/api/reviews/", {
        method: "POST",
        body: JSON.stringify({
          text: "Good movie",
          rating: "8",
          movie: { title: "test", id: 755898 },
          create_log: true,
        }),
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      })
      expect(response.status).toBe(404)
      //   const reviewsAfter = await fetch(
      //     "http://localhost:3000/api/users/6873aee958fc5297537ac5a6/reviews",
      //   ).then((data) => data.json())
      //   expect(reviewsAfter[0].info.totalReviews).toBe(1)
      //   const logsAfter = await fetch(
      //     "http://localhost:3000/api/users/6873aee958fc5297537ac5a6/diary",
      //   ).then((data) => data.json())
      //   expect(logsAfter[0].movies).toHaveLength(0)
    })
    test("it only allows the creator of a review to delete it", async () => {
      const response = await fetch("http://localhost:3000/api/reviews/25", {
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
    test("it only allows the creator of a review to update it", async () => {
      const response = await fetch("http://localhost:3000/api/reviews/25", {
        method: "PATCH",
        body: JSON.stringify({ text: "testing", rating: "5" }),
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      })
      expect(response.status).toBe(404)
    })
    test("it doesn't allow to like a review more than once", async () => {
      const response = await fetch(
        "http://localhost:3000/api/reviews/like/21",
        {
          method: "POST",
          headers: { Cookie: cookie, "Content-Type": "application/json" },
        },
      )
      expect(response.status).toBe(500)
    })
  })
})
