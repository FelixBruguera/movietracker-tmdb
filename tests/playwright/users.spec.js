import { test, expect } from "@playwright/test"

test.describe("the users index", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/users")
  })
  test("filtering by reviews", async ({ page }) => {
    await page.getByText("Filters").click()
    await page.getByLabel("Reviews minimum").fill("3")
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByLabel("users").getByRole("listitem")).toHaveCount(3)
    await expect(
      page.getByRole("heading", { name: "test", exact: true }),
    ).toBeVisible()
    await expect(page.getByRole("heading", { name: "tester" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "felix" })).toBeVisible()
  })
  test("filtering by diary logs", async ({ page }) => {
    await page.getByText("Filters").click()
    await page.getByLabel("Diary logs minimum").fill("3")
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByLabel("users").getByRole("listitem")).toHaveCount(2)
    await expect(page.getByRole("heading", { name: "test" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "felix" })).toBeVisible()
  })
  test("sorting by reviews descending", async ({ page }) => {
    await page.getByLabel("Sort Users").click()
    await page.getByRole("option", { name: "Reviews" }).click()
    const firstList = page.getByLabel("users").getByRole("listitem").nth(0)
    await expect(firstList).toContainText("felix")
    const secondList = page.getByLabel("users").getByRole("listitem").nth(1)
    await expect(secondList).toContainText("test")
  })
  test("sorting by diary logs", async ({ page }) => {
    await page.getByLabel("Sort Users").click()
    await page.getByRole("option", { name: "Diary logs" }).click()
    const firstList = page.getByLabel("users").getByRole("listitem").nth(0)
    await expect(firstList).toContainText("felix")
    const secondList = page.getByLabel("users").getByRole("listitem").nth(1)
    await expect(secondList).toContainText("test")
  })
})
test.describe("as a logged in user", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/users/login")
    const existingSession = await page
      .getByText("Already signed in")
      .isVisible()
    if (!existingSession) {
      await page.getByLabel("Username").fill("test")
      await page.getByLabel("Password").fill("123456789")
      await page.getByText("Send").click()
    }
  })
  test.describe("the users/:id route", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/users/9qOhDu7YxkvvO7YZuI6KIPZVcnzBfExM")
    })
    test("displays review likes correctly", async ({ page }) => {
      expect(page.getByLabel("Dislike")).toBeVisible()
    })
    test("sorting by rating descending", async ({ page }) => {
      await page.getByLabel("Sort Reviews").click()
      await page.getByRole("option", { name: "Rating" }).click()
      await expect(page.getByAltText("Pulp Fiction")).toBeVisible()
      await expect(page.getByAltText("Breaking Bad")).toBeVisible()
    })
    test("sorting by rating ascending", async ({ page }) => {
      await page.getByLabel("Sort Reviews").click()
      await page.getByRole("option", { name: "Rating" }).click()
      await page.getByLabel("Descending order").click()
      await expect(page.getByAltText("Star Wars: The Last Jedi")).toBeVisible()
    })
    test("sorting by likes ascending", async ({ page }) => {
      await page.getByLabel("Sort Reviews").click()
      await page.getByRole("option", { name: "Likes" }).click()
      const firstList = page.getByLabel("Reviews").getByRole("listitem").nth(0)
      await expect(firstList).toContainText("The Matrix Revolutions")
      await expect(firstList).toContainText("1 Like")
    })
    test("filtering by movies", async ({ page }) => {
      await page.getByLabel("Sort Reviews").click()
      await page.getByRole("option", { name: "Rating" }).click()
      await page.getByText("Filters").click()
      await page.getByLabel("Media Type").click()
      await page.getByRole("option", { name: "Movies" }).click()
      await page.getByText("Submit").click()
      await expect(page.getByAltText("Breaking Bad")).not.toBeVisible()
      await expect(page.getByAltText("Pulp Fiction")).toBeVisible()
    })
    test("filtering by tv shows", async ({ page }) => {
      await page.getByLabel("Sort Reviews").click()
      await page.getByRole("option", { name: "Rating" }).click()
      await page.getByText("Filters").click()
      await page.getByLabel("Media Type").click()
      await page.getByRole("option", { name: "TV" }).click()
      await page.getByText("Submit").click()
      await expect(page.getByAltText("Breaking Bad")).toBeVisible()
      await expect(page.getByAltText("Pulp Fiction")).not.toBeVisible()
    })
    test("filtering by genre", async ({ page }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Genre").click()
      await page.getByRole("option", { name: "Mystery" }).click()
      await page.getByText("Submit").click()
      await expect(page.getByAltText("Ruby Cairo")).toBeVisible()
      await expect(page.getByAltText("Se7en")).toBeVisible()
      await expect(page.getByLabel("Total Reviews")).toHaveText("2")
    })
    test("filtering by rating", async ({ page }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Rating maximum").fill("2")
      await page.getByText("Submit").click()
      await expect(page.getByAltText("Captain America: The Winter Soldier")).toBeVisible()
      await expect(page.getByLabel("Total Reviews")).toHaveText("1")
    })
    test("filtering by release year", async ({ page }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Release year maximum").fill("1980")
      await page.getByText("Submit").click()
      await expect(page.getByAltText("Taxi Driver")).toBeVisible()
      await expect(page.getByAltText("The Empire Strikes Back")).toBeVisible()
      await expect(page.getByAltText("Star Wars")).toBeVisible()
      await expect(page.getByLabel("Total Reviews")).toHaveText("3")
    })
  })
  test.describe("the users/:id/diary route", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/users/9qOhDu7YxkvvO7YZuI6KIPZVcnzBfExM/diary")
    })
    test("sorting by monthly descending", async ({ page }) => {
      await expect(page.getByText("September 2025")).toBeVisible()
      await expect(page.getByText("August 2025")).toBeVisible()
      await expect(page.getByAltText("Pulp Fiction")).toBeVisible()
      await expect(page.getByAltText("Scarface")).toBeVisible()
    })
    test("sorting by monthly ascending", async ({ page }) => {
      await page.getByLabel("Descending order").click()
      await expect(page.getByText("July 2015")).toBeVisible()
      await expect(page.getByText("January 2016")).toBeVisible()
      await expect(
        page.getByAltText("Star Wars", { exact: true }),
      ).toBeVisible()
      await expect(page.getByAltText("How I Met Your Mother")).toBeVisible()
    })
    test("sorting by yearly descending", async ({ page }) => {
      await page.getByLabel("Group logs").click()
      await page.getByRole("option", { name: "Yearly" }).click()
      await expect(page.getByText("2025")).toBeVisible()
      await expect(page.getByAltText("Se7en")).toBeVisible()
      await expect(
        page.getByAltText("Fight Club", { exact: true }),
      ).toBeVisible()
    })
    test("sorting by yearly ascending", async ({ page }) => {
      await page.getByLabel("Group logs").click()
      await page.getByRole("option", { name: "Yearly" }).click()
      await page.getByLabel("Descending order").click()
      await expect(page.getByText("2015")).toBeVisible()
      await expect(page.getByText("2016")).toBeVisible()
      await expect(page.getByAltText("Ozark")).toBeVisible()
      await expect(page.getByAltText("Fargo")).toBeVisible()
    })
    test("filtering by movies", async ({ page }) => {
      await page.getByLabel("Group logs").click()
      await page.getByRole("option", { name: "Yearly" }).click()
      await page.getByLabel("Descending order").click()
      await page.getByLabel("Filter").click()
      await page.getByRole("option", { name: "Movies" }).click()
      await expect(page.getByAltText("Breaking Bad")).not.toBeVisible()
      await expect(page.getByAltText("The Empire Strikes Back")).toBeVisible()
    })
    test("filtering by tv", async ({ page }) => {
      await page.getByLabel("Group logs").click()
      await page.getByRole("option", { name: "Yearly" }).click()
      await page.getByLabel("Descending order").click()
      await page.getByLabel("Filter").click()
      await page.getByRole("option", { name: "TV" }).click()
      await expect(page.getByAltText("How I Met Your Mother")).toBeVisible()
      await expect(page.getByAltText("The Empire Strikes Back")).not.toBeVisible()
    })
  })
  test.describe("the users/:id/lists route", () => {
    test("private lists are not displayed", async ({ page }) => {
      await page.goto("/users/9qOhDu7YxkvvO7YZuI6KIPZVcnzBfExM/lists")
      await expect(page.getByText("My watchlist")).not.toBeVisible()
    })
    test("when there are no public lists the correct error message is shown", async ({
      page,
    }) => {
      await page.goto("/users/9qOhDu7YxkvvO7YZuI6KIPZVcnzBfExM/lists")
      await expect(page.getByText("No public lists yet")).toBeVisible()
    })
    test("sorting by followers descending", async ({ page }) => {
      await page.goto("/users/a46bcfb21e794a9db0a89eea191d7630/lists")
      await page.getByLabel("Sort Lists").click()
      await page.getByRole("option", { name: "Followers" }).click()
      const firstList = page.getByLabel("Lists").getByRole("link").nth(0)
      expect(firstList).toContainText("My Favorite Movies")
      expect(firstList.getByLabel("Followers")).toHaveText("2")
    })
    test("sorting by followers ascending", async ({ page }) => {
      await page.goto("/users/a46bcfb21e794a9db0a89eea191d7630/lists")
      await page.getByLabel("Sort Lists").click()
      await page.getByRole("option", { name: "Followers" }).click()
      await page.getByLabel("Descending order").click()
      const firstList = page.getByLabel("Lists").getByRole("link").nth(2)
      expect(firstList).toContainText("My Favorite Movies")
      expect(firstList.getByLabel("Followers")).toHaveText("2")
    })
    test("sorting by media descending", async ({ page }) => {
      await page.goto("/users/a46bcfb21e794a9db0a89eea191d7630/lists")
      await page.getByLabel("Sort Lists").click()
      await page.getByRole("option", { name: "Media" }).click()
      const firstList = page.getByLabel("Lists").getByRole("link").nth(0)
      expect(firstList).toContainText("Mind-Bending Movies")
      expect(firstList.getByLabel("Media")).toHaveText("7")
    })
    test("sorting by media ascending", async ({ page }) => {
      await page.goto("/users/a46bcfb21e794a9db0a89eea191d7630/lists")
      await page.getByLabel("Sort Lists").click()
      await page.getByRole("option", { name: "Media" }).click()
      await page.getByLabel("Descending order").click()
      const lastList = page.getByLabel("Lists").getByRole("link").nth(2)
      expect(lastList).toContainText("Mind-Bending Movies")
      expect(lastList.getByLabel("Media")).toHaveText("7")
    })
  })
})
