import { Page } from "@playwright/test";
import { MenuPage } from "../page-objects/menuPage";
import { OrderPage } from "../page-objects/orderPage";

export class PageManager {
  private readonly menuPage: MenuPage;
  private readonly orderPage: OrderPage;

  constructor(page: Page) {
    this.menuPage = new MenuPage(page);
    this.orderPage = new OrderPage(page);
  }

  onMenuPage(): MenuPage {
    return this.menuPage;
  }

  onOrderPage(): OrderPage {
    return this.orderPage;
  }
}
