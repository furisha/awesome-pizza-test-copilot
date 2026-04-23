import { test as base } from "@playwright/test";
import { PageManager } from "../page-manager/pageManager";

type MyFixtures = {
  pageManager: PageManager;
};

export const test = base.extend<MyFixtures>({
  pageManager: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
  },
});

export { expect, request } from "@playwright/test";
