import { Page } from "@playwright/test";
import { MenuPage } from "../page-objects/menuPage";

export class PageManager {
  private readonly menuPage: MenuPage;

  constructor(page: Page) {
    this.menuPage = new MenuPage(page);
  }

  onMenuPage(): MenuPage {
    return this.menuPage;
  }
}
