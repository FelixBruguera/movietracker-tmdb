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

  test.describe("movie diary logs", () => {
    test.describe.configure({ mode: "serial" })

    test.beforeEach(async ({ page }) => {
      await expect(page.getByRole("button", { name: "test" })).toBeVisible()
      await page.goto("/movies/15")
    })

    test("Creating a diary log", async ({ page }) => {
      await page.getByLabel("Add to your diary").click()
      await page.getByLabel("Date").fill("2023-05-15")
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
      await page.getByLabel("Manage your logs").click()
      await expect(page.getByText("May 15 2023")).toBeVisible()
    })

    test("Updating a diary log", async ({ page }) => {
      await page.getByLabel("Manage your logs").click()
      await page.getByLabel("Edit").first().click()
      await page.locator("[type='date']").fill("2000-01-01")
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText("Succesfully updated")).toBeVisible()
      await expect(page.getByText("January 1 2000")).toBeVisible()
    })

    test("Deleting a diary log", async ({ page }) => {
      await page.getByLabel("Manage your logs").click()
      await page.getByRole("button", { name: "Delete" }).click()
      await page.getByRole("button", { name: "Delete" }).click()
      await expect(page.getByText("Succesfully deleted")).toBeVisible()
      await expect(page.getByText("2023-05-15")).not.toBeVisible()
    })
  })
  test.describe("logging a movie from a watchlist removes it from the list", () => {
    test.describe.configure({ mode: "serial" })
    test("adding the movie to the list", async ({ page }) => {
      await page.goto("/movies/566810")
      await page.getByLabel("Add or remove from lists").click()
      await page.getByRole("button", { name: "Add to list" }).click()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
      await page.goto("/lists/c6037ab1-4c29-4cf2-939e-1a8151743f6b")
      await expect(page.getByAltText("The Dark Kingdom")).toBeVisible()
    })
    test("logging the movie", async ({ page }) => {
      await page.goto("/movies/566810")
      await page.getByLabel("Add to your diary").click()
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
    })
    test("checking the list after logging", async ({ page }) => {
      await page.goto("/lists/c6037ab1-4c29-4cf2-939e-1a8151743f6b")
      await expect(page.getByAltText("The Dark Kingdom")).not.toBeVisible()
    })

    test("deleting the log", async ({ page }) => {
      await page.goto("/movies/566810")
      await page.getByLabel("Manage your logs").click()
      await page.getByRole("button", { name: "Delete" }).click()
      await page.getByRole("button", { name: "Delete" }).click()
      await expect(page.getByText("Succesfully deleted")).toBeVisible()
    })
  })
  test.describe("tv diary logs", () => {
    test.describe.configure({ mode: "serial" })

    test.beforeEach(async ({ page }) => {
      await expect(page.getByRole("button", { name: "test" })).toBeVisible()
      await page.goto("/tv/15")
    })

    test("Creating a diary log", async ({ page }) => {
      await page.getByLabel("Add to your diary").click()
      await page.getByLabel("Date").fill("2023-05-15")
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
      await page.getByLabel("Manage your logs").click()
      await expect(page.getByText("May 15 2023")).toBeVisible()
    })

    test("Updating a diary log", async ({ page }) => {
      await page.getByLabel("Manage your logs").click()
      await page.getByLabel("Edit").first().click()
      await page.locator("[type='date']").fill("2000-01-01")
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText("Succesfully updated")).toBeVisible()
      await expect(page.getByText("January 1 2000")).toBeVisible()
    })

    test("Deleting a diary log", async ({ page }) => {
      await page.getByLabel("Manage your logs").click()
      await page.getByRole("button", { name: "Delete" }).click()
      await page.getByRole("button", { name: "Delete" }).click()
      await expect(page.getByText("Succesfully deleted")).toBeVisible()
      await expect(page.getByText("2023-05-15")).not.toBeVisible()
    })
  })
  test.describe("logging a tv show from a watchlist removes it from the list", () => {
    test.describe.configure({ mode: "serial" })
    test("adding the show to the list", async ({ page }) => {
      await page.goto("/tv/157239")
      await page.getByLabel("Add or remove from lists").click()
      await page.getByRole("button", { name: "Add to list" }).click()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
      await page.goto("/lists/c6037ab1-4c29-4cf2-939e-1a8151743f6b")
      await expect(page.getByAltText("Alien: Earth")).toBeVisible()
    })
    test("logging the show", async ({ page }) => {
      await page.goto("/tv/157239")
      await page.getByLabel("Add to your diary").click()
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
    })
    test("checking the list after logging", async ({ page }) => {
      await page.goto("/lists/c6037ab1-4c29-4cf2-939e-1a8151743f6b")
      await expect(page.getByAltText("Alien: Earth")).not.toBeVisible()
    })

    test("deleting the log", async ({ page }) => {
      await page.goto("/tv/157239")
      await page.getByLabel("Manage your logs").click()
      await page.getByRole("button", { name: "Delete" }).click()
      await page.getByRole("button", { name: "Delete" }).click()
      await expect(page.getByText("Succesfully deleted")).toBeVisible()
    })
  })
})
