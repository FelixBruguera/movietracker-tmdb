import { test, expect } from "@playwright/test"

test.describe("the index route", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.getByLabel("Settings").click()
    await page.getByRole("button", { name: "Your region" }).click()
    await page.getByPlaceholder("Search").fill("Ven")
    await page.getByText("Venezuela").click()
    await page
      .getByRole("button", { name: "Close", exact: true })
      .click({ force: true })
    await expect(page.getByText("Select your country")).not.toBeVisible()
    await page.getByLabel("Settings").click({ force: true })
    await expect(
      page.getByRole("button", { name: "Your region" }),
    ).not.toBeVisible()
  })
  test.describe("sorting", () => {
    test("sorting by vote count", async ({ page }) => {
      await page.getByText("Most Popular").click()
      await page.getByText("Most voted").click()
      const posters = page.getByRole("listitem").getByRole("img")
      await expect(posters.first()).toHaveAttribute("alt", "Inception")
    })
  })
  test.describe("filtering", () => {
    test("combining multiple fields", async ({ page }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Genres").click()
      await page.getByRole("button", { name: "Clear", exact: true }).click()
      await page.getByLabel("Romance").check()
      await page.keyboard.down("Escape")
      await page.getByLabel("Release year minimum").fill("1998")
      await page.getByLabel("Release year maximum").fill("1998")
      await page.getByLabel("TMDB Average Rating (1-10) minimum").fill("8")
      await page.getByText("Submit").click()
      const posters = page.getByRole("listitem").getByRole("img")
      await expect(posters).toHaveCount(1)
      await expect(page.getByAltText("Asunder")).toBeVisible()
    })
    test("by keyword", async ({ page }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Keywords").click()
      await page.getByPlaceholder("Search").fill("siete pecados")
      await page.getByLabel("Add").click()
      await page.getByRole("button", { name: "Close", exact: true }).click()
      await expect(
        page.getByText("los siete pecados").first(),
      ).not.toBeVisible()
      await page.getByText("Submit").click()
      await expect(page.getByAltText("Se7en")).toBeVisible()
      const posters = page.getByRole("listitem").getByRole("img")
      await expect(posters).toHaveCount(1)
    })
    test("displays the correct messages for empty responses", async ({
      page,
    }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Genres").click()
      await page.getByRole("button", { name: "Clear", exact: true }).click()
      await page.getByLabel("Romance").check()
      await page.keyboard.down("Escape")
      await page.getByLabel("Release year minimum").fill("1998")
      await page.getByLabel("Release year maximum").fill("1998")
      await page.getByLabel("TMDB Average Rating (1-10) minimum").fill("9")
      await page.getByText("Submit").click()
      await expect(page.getByText("No Results found")).toBeVisible()
      const posters = page.getByRole("listitem").getByRole("img")
      await expect(posters).not.toBeVisible()
    })
    test("displays the correct message for invalid inputs", async ({
      page,
    }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Release year minimum").fill("1998")
      await page.getByLabel("Release year maximum").fill("1995")
      await page.getByText("Submit").click()
      await expect(page.getByText("Invalid release year range")).toBeVisible()
    })
  })
  test.describe("Saving searches", () => {
    test.describe.configure({ mode: "serial" })
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
    test("saving a search", async ({ page }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Languages").click()
      await page.getByLabel("Spanish").getByText("Spanish").click()
      await page.getByLabel("Release year minimum").fill("1985")
      await page.getByLabel("Release year maximum").fill("1985")
      await page.getByLabel("TMDB Vote Count minimum").fill("100")
      await page.getByText("Submit").click()
      const posters = page.getByRole("listitem").getByRole("img")
      await expect(posters).toHaveCount(1)
      await expect(page.getByAltText("Waiting for the Hearse")).toBeVisible()
      await page.getByLabel("Save Search").click()
      await page.getByLabel("Name").fill("Test")
      await page.getByRole("button", { name: "Save", exact: true }).click()
      await expect(page.getByText("Search Saved")).toBeVisible()
      await page.getByText("TV").click()
      await page.getByLabel("Saved searches").click()
      await page.getByText("Test", { exact: true }).click()
      await expect(page.getByAltText("Waiting for the Hearse")).toBeVisible()
      await page.getByRole("button", { name: "Close", exact: true }).click()
      await page.getByText("Filters").click()
      await expect(
        page.getByRole("combobox", { name: "Languages" }),
      ).toHaveText("Spanish")
      await expect(page.getByLabel("Release year minimum")).toHaveValue("1985")
      await expect(page.getByLabel("Release year maximum")).toHaveValue("1985")
      await expect(page.getByLabel("TMDB Vote Count minimum")).toHaveValue(
        "100",
      )
    })
    test("saving a search with a duplicated name", async ({ page }) => {
      await page.getByLabel("Save Search").click()
      await page.getByLabel("Name").fill("Test")
      await page.getByRole("button", { name: "Save", exact: true }).click()
      await expect(page.getByText("Search name must be unique")).toBeVisible()
    })
    test("updating a search", async ({ page }) => {
      await page.getByLabel("Saved searches").click()
      await page
        .getByRole("listitem")
        .filter({ hasText: "Test" })
        .getByLabel("Edit")
        .click()
      await page.getByLabel("Name").fill("Test updated")
      await page.getByRole("button", { name: "Save", exact: true }).click()
      await expect(page.getByText("Search Updated")).toBeVisible()
    })
    test("deleting a search", async ({ page }) => {
      await page.getByLabel("Saved searches").click()
      await page
        .getByRole("listitem")
        .filter({ hasText: "Test" })
        .getByLabel("Delete")
        .click()
      await page.getByRole("button", { name: "Delete" }).click()
      await expect(page.getByText("Search Deleted")).toBeVisible()
    })
  })
})
