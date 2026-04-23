import { test, expect, request } from "../fixtures/test";

type Pizza = { name: string };

let PIZZAS: Pizza[] = [];

test.beforeAll(async () => {
  const apiContext = await request.newContext({ baseURL: "http://localhost:3000" });
  const response = await apiContext.get("/api/daily-menu");
  const body = await response.json();
  PIZZAS = body.data.map((item: Pizza) => ({ name: item.name }));
  await apiContext.dispose();
});

test.describe("Order Placement", () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.onMenuPage().navigate();
  });

  // TC-05: Place Order button disabled states
  test("Place Order button is disabled on page load", async ({ pageManager }) => {
    const order = pageManager.onOrderPage();
    await expect(order.placeOrderButton).toBeDisabled();
  });

  test("Place Order button is disabled with name but empty cart", async ({ pageManager }) => {
    const order = pageManager.onOrderPage();
    await order.fillCustomerName("Alice");
    await expect(order.placeOrderButton).toBeDisabled();
  });

  test("Place Order button is disabled with item but no name", async ({ pageManager }) => {
    const menu = pageManager.onMenuPage();
    const order = pageManager.onOrderPage();
    await menu.increment(PIZZAS[0].name);
    await expect(order.placeOrderButton).toBeDisabled();
  });

  // TC-06: Place Order button enabled state
  test("Place Order button is enabled with name and item in cart", async ({ pageManager }) => {
    const menu = pageManager.onMenuPage();
    const order = pageManager.onOrderPage();
    await menu.increment(PIZZAS[0].name);
    await order.fillCustomerName("Alice");
    await expect(order.placeOrderButton).toBeEnabled();
  });

  // TC-07: Successful order placement
  test("successful order placement clears cart and shows notification", async ({ pageManager }) => {
    const menu = pageManager.onMenuPage();
    const order = pageManager.onOrderPage();
    const pizza = PIZZAS[0];

    await menu.increment(pizza.name);
    await menu.increment(pizza.name);
    await order.fillCustomerName("Alice");
    await order.placeOrder();

    await expect(order.successNotification).toContainText("Order placed successfully!");
    await expect(order.emptyCartMessage).toBeVisible();
    await expect(order.customerNameInput).toHaveValue("");
    await expect(order.placeOrderButton).toBeDisabled();
    const orderId = await order.orderIdField.inputValue();
    expect(orderId).toMatch(/^order-/);
  });

  // TC-08: Order placement with multiple items
  test("order with multiple items shows correct quantities in cart", async ({ pageManager }) => {
    const menu = pageManager.onMenuPage();
    const order = pageManager.onOrderPage();
    const [first, second] = PIZZAS;

    await menu.increment(first.name);
    await menu.increment(second.name);
    await menu.increment(second.name);

    await expect(order.getCartItemQuantity(first.name)).toContainText("1");
    await expect(order.getCartItemQuantity(second.name)).toContainText("2");
    expect(await order.getTotalItemsCount()).toBe(3);

    await order.fillCustomerName("Bob");
    await order.placeOrder();

    await expect(order.successNotification).toContainText("Order placed successfully!");
  });
});
