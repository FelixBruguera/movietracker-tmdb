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
  test.describe("reviews", () => {
    test.describe.configure({ mode: "serial" })
    test.beforeEach(async ({ page }) => {
      await expect(page.getByText("Test")).toBeVisible()
      await page.goto("/movies/5")
    })
    test("Creating a review", async ({ page }) => {
      await page.getByLabel("Add or manage your review").click()
      await page.getByRole("textbox").fill("Great movie")
      await page.getByRole("combobox", { name: "Your Rating" }).click()
      await page.getByLabel("9").click()
      await page.getByText("Save").click()
      await expect(page.getByText("Review created")).toBeVisible()
      await expect(page.getByText("Great Movie")).toHaveCount(2)
    })
    test("Editing a review", async ({ page }) => {
      await page.getByLabel("Add or manage your review").click()
      await page.getByLabel("Edit your review").click()
      await page.getByRole("textbox").fill("Not that great")
      await page.getByRole("combobox", { name: "Your Rating" }).click()
      await page.getByLabel("2").click()
      await page.getByText("Save").click()
      await expect(page.getByText("Review updated")).toBeVisible()
      await expect(page.getByText("Not that great")).toHaveCount(2)
    })
    test("Liking a review", async ({ page }) => {
      await page.getByLabel("Like").click()
      await expect(page.getByText("Like added")).toBeVisible()
      await expect(page.getByText("1 like")).toBeVisible()
    })
    test("Disliking a review", async ({ page }) => {
      await page.getByLabel("Dislike").click()
      await expect(page.getByText("Like removed")).toBeVisible()
      await expect(page.getByText("1 like")).not.toBeVisible()
    })
    test("Deleting a review", async ({ page }) => {
      await page.getByLabel("Add or manage your review").click()
      await page.getByLabel("Delete your review").click()
      await page.getByText("Delete").click()
      await expect(page.getByText("Review Deleted")).toBeVisible()
      await expect(page.getByText("Not that great")).toHaveCount(0)
    })
    // test("Creating a review with a log", async ({ page }) => {
    //   await page.getByAltText("Salomè").click()
    //   await page.getByRole("textbox").fill("Great movie")
    //   await page.getByRole("combobox", { name: "Your Rating" }).click()
    //   await page.getByLabel("9").click()
    //   await page.getByLabel("Add to diary").check()
    //   await page.getByText("Save").click()
    //   await expect(page.getByText("Succesfully added")).toBeVisible()
    //   await expect(page.getByText("Your review")).toBeVisible()
    //   await page.getByRole("link", { name: "testuser" }).first().click()
    //   await expect(page.getByLabel("Total reviews")).toHaveText("2")
    //   await page.getByText("Diary").click()
    //   await expect(page.getByLabel("Total logs")).toHaveText("1")
    //   await expect(page.getByAltText("Salomè")).toBeVisible()
    // })
    // test("Deleting log created with the review form", async ({ page }) => {
    //   await page.getByAltText("Salomè").click()
    //   await page.getByLabel("Manage your logs").click()
    //   await page.getByRole("button", { name: "Delete" }).click()
    //   await page.getByRole("button", { name: "Delete" }).click()
    //   await expect(page.getByText("Succesfully deleted")).toBeVisible()
    // })
  })
})
