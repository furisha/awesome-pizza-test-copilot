import { test, expect } from "../fixtures/test";

test.describe("Theme Toggle", () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.onMenuPage().navigate();
  });

  test("toggles to dark theme when button is clicked", async ({ page }) => {
    const toggleButton = page.getByRole("button", { name: "Toggle dark theme" });

    await toggleButton.click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("toggles back to light theme on second click", async ({ page }) => {
    const toggleButton = page.getByRole("button", { name: /toggle/i });

    await toggleButton.click();
    await toggleButton.click();

    await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
  });
});
