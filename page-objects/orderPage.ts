import { Page, Locator } from "@playwright/test";

export class OrderPage {
  private readonly page: Page;

  readonly placeOrderButton: Locator;
  readonly customerNameInput: Locator;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly totalItems: Locator;
  readonly successNotification: Locator;
  readonly errorNotification: Locator;
  readonly orderIdField: Locator;
  readonly lookupOrderButton: Locator;
  readonly orderDetailsPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.placeOrderButton = page.locator("#place-order-btn");
    this.customerNameInput = page.locator("#customer-name");
    this.cartItems = page.locator(".cart-item");
    this.emptyCartMessage = page.locator(".empty-cart");
    this.totalItems = page.locator("#total-items");
    this.successNotification = page.locator(".notification.success");
    this.errorNotification = page.locator(".notification.error");
    this.orderIdField = page.locator("#order-id");
    this.lookupOrderButton = page.locator("#lookup-order-btn");
    this.orderDetailsPanel = page.locator("#order-details");
  }

  async fillCustomerName(name: string) {
    await this.customerNameInput.fill(name);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  getCartItemByName(name: string): Locator {
    return this.cartItems.filter({
      has: this.page.locator(".cart-item-name", { hasText: name }),
    });
  }

  getCartItemQuantity(name: string): Locator {
    return this.getCartItemByName(name).locator(".cart-item-quantity");
  }

  getRemoveButton(name: string): Locator {
    return this.getCartItemByName(name).locator(".remove-item-btn");
  }

  async getTotalItemsCount(): Promise<number> {
    const text = await this.totalItems.innerText();
    return parseInt(text, 10);
  }
}
