import { Page, Locator } from "@playwright/test";

export class MenuPage {
  private readonly page: Page;
  private readonly menuItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuItems = page.locator(".menu-item");
  }

  async navigate() {
    await this.page.goto("/");
    await this.menuItems.first().waitFor({ state: "visible" });
  }

  getItemByName(name: string): Locator {
    return this.menuItems.filter({
      has: this.page.locator("h3", { hasText: name }),
    });
  }

  async getItemCount(): Promise<number> {
    return this.menuItems.count();
  }

  async getAllItemNames(): Promise<string[]> {
    return this.menuItems.locator("h3").allInnerTexts();
  }

  async getQuantity(pizzaName: string): Promise<number> {
    const quantityText = await this.getItemByName(pizzaName)
      .locator(".quantity-display")
      .innerText();
    return parseInt(quantityText, 10);
  }

  getDecrementButton(pizzaName: string): Locator {
    return this.getItemByName(pizzaName).locator(".quantity-btn").nth(0);
  }

  async increment(pizzaName: string) {
    await this.getItemByName(pizzaName).locator(".quantity-btn").nth(1).click();
  }

  async decrement(pizzaName: string) {
    await this.getDecrementButton(pizzaName).click();
  }

  getName(pizzaName: string): Locator {
    return this.getItemByName(pizzaName).locator("h3");
  }

  getDescription(pizzaName: string): Locator {
    return this.getItemByName(pizzaName).locator("p");
  }

  getImage(pizzaName: string): Locator {
    return this.getItemByName(pizzaName).locator("img");
  }
}
