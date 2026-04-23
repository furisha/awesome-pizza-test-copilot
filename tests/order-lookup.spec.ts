import { test, expect, request } from "../fixtures/test";
import { OrderPage } from "../page-objects/orderPage";

test.describe("Order Lookup", () => {
  let ORDER_ID: string;
  let order: OrderPage;

  test.beforeAll(async () => {
    const apiContext = await request.newContext({ baseURL: "http://localhost:3000" });
    const response = await apiContext.post("/api/orders", {
      data: {
        sender: "LookupTestUser",
        contents: [{ name: "Margherita Pizza", quantity: 1 }],
      },
    });
    const body = await response.json();
    ORDER_ID = body.data.id;
    await apiContext.dispose();
  });
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.onMenuPage().navigate();
    order = pageManager.onOrderPage();
  });

  // TC-09: Order Lookup — Valid ID
  test("looking up a valid order ID shows order details", async () => {
    await order.orderIdField.fill(ORDER_ID);
    await order.lookupOrderButton.click();

    await expect(order.orderDetailsPanel).toBeVisible();
    await expect(
      order.orderDetailsPanel.locator(".order-info-value").first()
    ).toContainText(ORDER_ID);
    await expect(order.orderDetailsPanel.locator(".status-badge")).toHaveText("RECEIVED");
  });

  // TC-10: Order Lookup — Invalid ID
  test("looking up an invalid order ID shows error notification and hides details panel", async () => {
    await order.orderIdField.fill("nonexistent-id");
    await order.lookupOrderButton.click();

    await expect(order.errorNotification).toBeVisible();
    await expect(order.orderDetailsPanel).toBeHidden();
  });

  // TC-11: Order Lookup via Enter Key
  test("pressing Enter in the order ID field triggers the lookup", async () => {
    await order.orderIdField.fill(ORDER_ID);
    await order.orderIdField.press("Enter");

    await expect(order.orderDetailsPanel).toBeVisible();
    await expect(order.orderDetailsPanel.locator(".status-badge")).toHaveText("RECEIVED");
  });
});
