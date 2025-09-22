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
      await expect(page.getByText("Test")).toBeVisible()
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
  test.describe("tv diary logs", () => {
    test.describe.configure({ mode: "serial" })

    test.beforeEach(async ({ page }) => {
      await expect(page.getByText("Test")).toBeVisible()
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
})
