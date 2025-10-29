import { test, expect } from "@playwright/test"

test.describe("the lists index", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/lists")
  })
  test("filtering by media", async ({ page }) => {
    await page.getByText("Filters").click()
    await page.getByLabel("Media minimum").fill("3")
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByLabel("lists").getByRole("listitem")).toHaveCount(3)
    await expect(
      page.getByRole("heading", { name: "Public list" }),
    ).toBeVisible()
    await expect(page.getByRole("heading", { name: "test list" })).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "My Favorite Movies" }),
    ).toBeVisible()
  })
  test("filtering by followers", async ({ page }) => {
    await page.getByText("Filters").click()
    await page.getByLabel("Followers minimum").fill("1")
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByLabel("lists").getByRole("listitem")).toHaveCount(4)
    await expect(
      page.getByRole("heading", { name: "Public list" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Indie Gems" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Oscar Winners" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "My Favorite Movies" }),
    ).toBeVisible()
  })
  test("sorting by followers", async ({ page }) => {
    await page.getByLabel("Sort Lists").click()
    await page.getByRole("option", { name: "Followers" }).click()
    const firstList = page.getByLabel("Lists").getByRole("listitem").nth(0)
    await expect(firstList).toContainText("Public list")
    const secondList = page.getByLabel("Lists").getByRole("listitem").nth(1)
    await expect(secondList).toContainText("My Favorite Movies")
  })
  test("sorting by movies", async ({ page }) => {
    await page.getByLabel("Sort Lists").click()
    await page.getByRole("option", { name: "Movies" }).click()
    const firstList = page.getByLabel("Lists").getByRole("listitem").nth(0)
    await expect(firstList).toContainText("Public list")
    const secondList = page.getByLabel("Lists").getByRole("listitem").nth(1)
    await expect(secondList).toContainText("My Favorite Movies")
    const thirdList = page.getByLabel("Lists").getByRole("listitem").nth(2)
    await expect(thirdList).toContainText("test list")
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
  test.describe("the lists index", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/lists")
    })
    test("filtering by the users lists", async ({ page }) => {
      await page.getByText("Your lists").click()
      await expect(page.getByLabel("lists").getByRole("listitem")).toHaveCount(
        1,
      )
      await expect(
        page.getByRole("heading", { name: "test list" }),
      ).not.toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Public List" }),
      ).toBeVisible()
    })
    test("filtering by followed lists", async ({ page }) => {
      await page.getByText("Following").click()
      await expect(page.getByLabel("lists").getByRole("listitem")).toHaveCount(
        1,
      )
      await expect(
        page.getByRole("heading", { name: "Indie Gems" }),
      ).toBeVisible()
    })
  })
  test.describe("lists", () => {
    test.describe.configure({ mode: "serial" })
    test.beforeEach(async ({ page }) => {
      await expect(page.getByRole("button", { name: "test" })).toBeVisible()
      await page.goto("/lists")
    })
    test("Private lists are not visible to everyone", async ({ page }) => {
      await expect(page.getByText("My watchlist")).not.toBeVisible()
    })
    test("Creating a list", async ({ page }) => {
      await page.getByLabel("Create a new list").click()
      await page.getByLabel("Name").fill("My new list")
      await page.getByLabel("Description").fill("A list of my favorite movies")
      await page.getByText("Save").click()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
      await expect(page.getByText("My new list")).toBeVisible()
    })
    test("Creating a list with a duplicated name", async ({ page }) => {
      await page.getByLabel("Create a new list").click()
      await page.getByLabel("Name").fill("My new list")
      await page.getByLabel("Description").fill("A list of my favorite movies")
      await page.getByText("Save").click()
      await expect(page.getByText("List names must be unique")).toBeVisible()
      await expect(page.getByText("My new list")).toHaveCount(1)
    })
    test("Updating a list", async ({ page }) => {
      await page.getByText("My new list").click()
      await page.getByLabel("Update your list").click()
      await page.getByLabel("Name").fill("My updated list")
      await page.getByText("Save").click()
      await expect(page.getByText("Succesfully Updated")).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "My updated list" }),
      ).toBeVisible()
    })
    test("Adding media to a list", async ({ page }) => {
      await page.getByText("My updated list").click()
      await page.getByLabel("Add movies or TV Shows").click()
      await page.getByPlaceholder("Search").fill("The Matrix")
      await page
        .getByRole("listitem")
        .filter({ hasText: "The Matrix Reloadedmovie" })
        .getByRole("button")
        .click()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
      await expect(page.getByAltText("The Matrix Reloaded")).toBeVisible()
    })
    test("Removing media from a list", async ({ page }) => {
      await page.getByText("My updated list").click()
      await page.getByAltText("The Matrix Reloaded").click({ button: "right" })
      await page.getByText("Remove").click()
      await page.getByText("Delete").click()
      await expect(page.getByText("Succesfully removed")).toBeVisible()
      await expect(page.getByText("The Matrix")).not.toBeVisible()
    })

    test("Deleting a list", async ({ page }) => {
      await page.getByText("My updated list").click()
      await page.getByLabel("Delete").click()
      await page.getByText("Delete").click()
      await expect(page.getByText("Succesfully Deleted")).toBeVisible()
      await expect(page.getByText("My updated list")).not.toBeVisible()
    })
    test("Following a list", async ({ page }) => {
      await page.getByRole("heading", { name: "test list" }).click()
      await page.getByLabel("Follow list", { exact: true }).click()
      await expect(page.getByText("Succesfully followed")).toBeVisible()
      await expect(page.getByLabel("Followers")).toHaveText("1")
    })
    test("Unfollowing a list", async ({ page }) => {
      await page.getByRole("heading", { name: "test list" }).click()
      await page.getByLabel("Unfollow list").click()
      await expect(page.getByText("Succesfully unfollowed")).toBeVisible()
      await expect(page.getByLabel("Followers")).toHaveText("0")
    })
  })
  test.describe("creating a copy of a list", () => {
    test.describe.configure({ mode: "serial" })
    test.beforeEach(async ({ page }) => {
      await expect(page.getByRole("button", { name: "test" })).toBeVisible()
      await page.goto("/lists")
    })
    test("Creating a copy of a list", async ({ page }) => {
      await page.getByText("test list", { exact: true }).click()
      await page.getByLabel("Create a copy of this list").click()
      await page.getByLabel("Name").fill("My copy of test list")
      await page.getByLabel("Description").fill("A copy of the test list")
      await page.getByText("Save").click()
      await expect(page.getByText("Succesfully Copied")).toBeVisible()
      await page.getByRole("link", { name: "Lists" }).click()
      await expect(page.getByText("My copy of test list")).toBeVisible()
      await page.getByText("My copy of test list").click()
      await expect(page.getByAltText("The Tom and Jerry Show")).toBeVisible()
      await expect(
        page.getByAltText("The Fairly OddParents", { exact: true }),
      ).toBeVisible()
      await expect(
        page.getByAltText("The Fairly OddParents: Fairy Idol", { exact: true }),
      ).toBeVisible()
    })
    test("Deleting the copied list", async ({ page }) => {
      await page.getByText("My copy of test list").click()
      await page.getByLabel("Delete").click()
      await page.getByText("Delete").click()
      await expect(page.getByText("Succesfully Deleted")).toBeVisible()
      await expect(page.getByText("My copy of test list")).not.toBeVisible()
      await expect(page.getByText("test list", { exact: true })).toBeVisible()
    })
  })
})
