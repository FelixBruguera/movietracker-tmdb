import { test, expect } from "@playwright/test"

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
  test.describe("lists", () => {
    test.describe.configure({ mode: "serial" })
    test.beforeEach(async ({ page }) => {
      await expect(page.getByText("Test")).toBeVisible()
      await page.goto("/lists")
    })
    test("Private lists are not visible to everyone", async ({ page }) => {
      await expect(page.getByText("Testing list")).not.toBeVisible()
    })
    test("Creating a list", async ({ page }) => {
      await page.getByLabel("Create a new list").click()
      await page.getByLabel("Name").fill("My new list")
      await page.getByLabel("Description").fill("A list of my favorite movies")
      await page.getByText("Save").click()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
      await expect(page.getByText("My new list")).toBeVisible()
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
      await page.getByText("Test list").click()
      await page.getByLabel("Follow list", { exact: true }).click()
      await expect(page.getByText("Succesfully followed")).toBeVisible()
      await expect(page.getByLabel("Followers")).toHaveText("1")
    })
    test("Unfollowing a list", async ({ page }) => {
      await page.getByText("Test list").click()
      await page.getByLabel("Unfollow list").click()
      await expect(page.getByText("Succesfully unfollowed")).toBeVisible()
      await expect(page.getByLabel("Followers")).toHaveText("0")
    })
  })
  test.describe("creating a copy of a list", () => {
    test.describe.configure({ mode: "serial" })
    test.beforeEach(async ({ page }) => {
      await expect(page.getByText("Test")).toBeVisible()
      await page.goto("/lists")
    })
    test("Creating a copy of a list", async ({ page }) => {
      await page.getByText("public", { exact: true }).click()
      await page.getByLabel("Create a copy of this list").click()
      await page.getByLabel("Name").fill("My copy of public")
      await page.getByLabel("Description").fill("A copy of the public list")
      await page.getByText("Save").click()
      await expect(page.getByText("Succesfully Copied")).toBeVisible()
      await page.getByRole("link", { name: "Lists" }).click()
      await expect(page.getByText("My copy of public")).toBeVisible()
      await page.getByText("My copy of public").click()
      await expect(page.getByAltText("War of the Worlds")).toBeVisible()
      await expect(page.getByAltText("The Conjuring: Last Rites")).toBeVisible()
    })
    test("Deleting the copied list", async ({ page }) => {
      await page.getByText("My copy of public").click()
      await page.getByLabel("Delete").click()
      await page.getByText("Delete").click()
      await expect(page.getByText("Succesfully Deleted")).toBeVisible()
      await expect(page.getByText("My copy of public")).not.toBeVisible()
      await expect(page.getByText("public", { exact: true })).toBeVisible()
    })
  })
})
