import { test, expect, request } from "../fixtures/test";

type Pizza = { name: string; description: string };

let PIZZAS: Pizza[] = [];

test.beforeAll(async () => {
  const apiContext = await request.newContext({ baseURL: "http://localhost:3000" });
  const response = await apiContext.get("/api/daily-menu");
  const body = await response.json();
  PIZZAS = body.data.map((item: Pizza) => ({
    name: item.name,
    description: item.description,
  }));
  await apiContext.dispose();
});

test.describe("Menu", () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.onMenuPage().navigate();
  });

  test("all menu items are displayed", async ({ pageManager }) => {
    const menu = pageManager.onMenuPage();
    const count = await menu.getItemCount();
    const names = await menu.getAllItemNames();

    expect(count).toBe(PIZZAS.length);
    for (const pizza of PIZZAS) {
      expect(names).toContain(pizza.name);
    }
  });

  test("each pizza shows name, description and image", async ({ pageManager }) => {
    const menu = pageManager.onMenuPage();
    for (const pizza of PIZZAS) {
      await expect(menu.getName(pizza.name)).toContainText(pizza.name);
      await expect(menu.getDescription(pizza.name)).toContainText(pizza.description);
      await expect(menu.getImage(pizza.name)).toBeVisible();
    }
  });
  
  test("default quantity for every pizza is 0", async ({ pageManager }) => {
    const menu = pageManager.onMenuPage();
    for (const pizza of PIZZAS) {
      expect(await menu.getQuantity(pizza.name)).toBe(0);
    }
  });

  test("incrementing a quantity increases the count by 1", async ({ pageManager }) => {
    const menu = pageManager.onMenuPage();
    const pizza = PIZZAS[0];
    await menu.increment(pizza.name);
    expect(await menu.getQuantity(pizza.name)).toBe(1);
  });

  test("incrementing multiple items tracks each quantity independently", async ({ pageManager }) => {
    const menu = pageManager.onMenuPage();
    const [first, second, , , fifth] = PIZZAS;

    await menu.increment(first.name);
    await menu.increment(first.name);
    await menu.increment(second.name);

    expect(await menu.getQuantity(first.name)).toBe(2);
    expect(await menu.getQuantity(second.name)).toBe(1);
    // verify a non-incremented item is unaffected
    expect(await menu.getQuantity(fifth.name)).toBe(0);
  });

  test("decrementing a quantity at 0 does not go negative", async ({ pageManager }) => {
    const menu = pageManager.onMenuPage();
    const pizza = PIZZAS[0];
    await menu.decrement(pizza.name);
    expect(await menu.getQuantity(pizza.name)).toBe(0);
  });
});
