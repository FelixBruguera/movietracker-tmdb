import { test, expect } from "@playwright/test"

test.describe("the lists index", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/lists")
  })
  test("filtering by media", async ({ page }) => {
    await page.getByText("Filters").click()
    await page.getByLabel("Media minimum").fill("20")
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByLabel("lists").getByRole("link")).toHaveCount(3)
    await expect(
      page.getByRole("heading", { name: "Public list" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Oscar Winners" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Summer Blockbusters" }),
    ).toBeVisible()
  })
  test("filtering by followers", async ({ page }) => {
    await page.getByText("Filters").click()
    await page.getByLabel("Followers minimum").fill("1")
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByLabel("lists").getByRole("link")).toHaveCount(4)
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
    const firstList = page.getByLabel("Lists").getByRole("link").nth(0)
    await expect(firstList).toContainText("Public list")
    const secondList = page.getByLabel("Lists").getByRole("link").nth(1)
    await expect(secondList).toContainText("My Favorite Movies")
  })
  test("sorting by movies", async ({ page }) => {
    await page.getByLabel("Sort Lists").click()
    await page.getByRole("option", { name: "Movies" }).click()
    const firstList = page.getByLabel("Lists").getByRole("link").nth(0)
    await expect(firstList).toContainText("Public list")
    const secondList = page.getByLabel("Lists").getByRole("link").nth(1)
    await expect(secondList).toContainText("Oscar Winners")
    const thirdList = page.getByLabel("Lists").getByRole("link").nth(2)
    await expect(thirdList).toContainText("Summer Blockbusters")
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
      await expect(page.getByLabel("lists").getByRole("link")).toHaveCount(1)
      await expect(
        page.getByRole("heading", { name: "test list" }),
      ).not.toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Public List" }),
      ).toBeVisible()
    })
    test("filtering by followed lists", async ({ page }) => {
      await page.getByText("Following").click()
      await expect(page.getByLabel("lists").getByRole("link")).toHaveCount(1)
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
        .getByTitle("The Matrix Revolutions", { exact: true })
        .getByRole("button")
        .click()
      await expect(page.getByAltText("The Matrix Revolutions")).toBeVisible()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
    })
    test("Removing media from a list", async ({ page }) => {
      await page.getByText("My updated list").click()
      await page
        .getByAltText("The Matrix Revolutions")
        .click({ button: "right" })
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
      await page.goto("/lists")
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
  test.describe("list filters", () => {
    test.beforeEach(async ({ page }) => {
      await expect(page.getByRole("button", { name: "test" })).toBeVisible()
      await page.goto("/lists/c6037ab1-4c29-4cf2-939e-1a8151743f6b")
    })
    test("filtering by movies", async ({ page }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Media Type").click()
      await page.getByRole("option", { name: "Movies" }).click()
      await page.getByText("Submit").click()
      await expect(page.getByAltText("Manhattan")).not.toBeVisible()
      await expect(page.getByAltText("Dunkirk")).toBeVisible()
      await expect(page.getByLabel("Total Media")).toHaveText("18")
    })
    test("filtering by tv shows", async ({ page }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Media Type").click()
      await page.getByRole("option", { name: "TV" }).click()
      await page.getByText("Submit").click()
      await expect(page.getByAltText("Manhattan")).toBeVisible()
      await expect(page.getByAltText("Dunkirk")).not.toBeVisible()
      await expect(page.getByLabel("Total Media")).toHaveText("10")
    })
    test("filtering by genre", async ({ page }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Genre").click()
      await page.getByRole("option", { name: "War", exact: true }).click()
      await page.getByText("Submit").click()
      await expect(page.getByAltText("Dunkirk")).toBeVisible()
      await expect(
        page.getByAltText("All Quiet on the Western Front"),
      ).toBeVisible()
      await expect(page.getByLabel("Total Media")).toHaveText("2")
    })
    test("filtering by release year", async ({ page }) => {
      await page.getByText("Filters").click()
      await page.getByLabel("Release year minimum").fill("2023")
      await page.getByLabel("Release year maximum").fill("2023")
      await page.getByText("Submit").click()
      await expect(
        page.getByAltText("The Super Mario Bros. Movie"),
      ).toBeVisible()
      await expect(page.getByLabel("Total Media")).toHaveText("1")
    })
  })
  test.describe("collections", () => {
    test.describe.configure({ mode: "serial" })
    test.beforeEach(async ({ page }) => {
      await page.goto("/movies/collection/399")
    })
    test("Adding a collection to a list", async ({ page }) => {
      await page.getByLabel("Add or remove from lists").click()
      await page.getByLabel("Add to list").first().click()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
      await page.goto("/lists")
      await page.getByRole("link", {name: "Public List"}).click()
      await expect(page.getByAltText("Predator", {exact: true})).toBeVisible()
      await expect(page.getByAltText("Predator 2", {exact: true})).toBeVisible()
      await expect(page.getByAltText("Predators", {exact: true})).toBeVisible()
      await expect(page.getByAltText("The Predator", {exact: true})).toBeVisible()
      await expect(page.getByAltText("Prey", {exact: true})).toBeVisible()
      await expect(page.getByAltText("Predator: Badlands", {exact: true})).toBeVisible()
      await expect(page.getByLabel("Total Media")).toHaveText("34")
    })
    test("Removing a collection from a list", async ({ page }) => {
      await page.getByLabel("Add or remove from lists").click()
      await page.getByLabel("Remove from list", { exact: true}).first().click()
      await expect(page.getByText("Succesfully Removed")).toBeVisible()
      await page.goto("/lists")
      await page.getByRole("link", {name: "Public List"}).click()
      await expect(page.getByAltText("Predator", {exact: true})).not.toBeVisible()
      await expect(page.getByAltText("Predator 2", {exact: true})).not.toBeVisible()
      await expect(page.getByAltText("Predators", {exact: true})).not.toBeVisible()
      await expect(page.getByAltText("The Predator", {exact: true})).not.toBeVisible()
      await expect(page.getByAltText("Prey", {exact: true})).not.toBeVisible()
      await expect(page.getByAltText("Predator: Badlands", {exact: true})).not.toBeVisible()
      await expect(page.getByLabel("Total Media")).toHaveText("28")
    })
    test("The remove button is rendered even when there's only 1 movie from the collection in the list", async ({ page }) => {
      await page.getByRole("link", {name: "Prey"}).click()
      await page.getByLabel("Add or remove from lists").click()
      await page.getByLabel("Add to list").first().click()
      await expect(page.getByText("Succesfully Added")).toBeVisible()
      await page.goto("/movies/collection/399")
      await page.getByLabel("Add or remove from lists").click()
      await expect(page.getByLabel("Remove from list", { exact: true })).toBeVisible()
      await expect(page.getByLabel("Add to list")).not.toBeVisible()
    })
    test("Removes the single movie from the list", async ({ page }) => {
      await page.getByLabel("Add or remove from lists").click()
      await expect(page.getByLabel("Remove from list", { exact: true })).toBeVisible()
      await page.getByLabel("Remove from list", { exact: true }).click()
      await expect(page.getByText("Succesfully Removed")).toBeVisible()
      await page.goto("/lists")
       await page.getByRole("link", {name: "Public List"}).click()
      await expect(page.getByAltText("Prey", {exact: true})).not.toBeVisible()
      await expect(page.getByLabel("Total Media")).toHaveText("28")
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
