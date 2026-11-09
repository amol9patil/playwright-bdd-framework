// Steps for Cart.feature. Checkout.feature reuses the "adds" and "opens the cart" steps.
import { When, Then, expect } from '../fixtures/customFixtures';

When('the user adds {string} to the cart', async ({ inventoryPage }, product: string) => {
  await inventoryPage.addToCart(product);
});

When('the user opens the cart', async ({ inventoryPage }) => {
  await inventoryPage.openCart();
});

When(
  'the user removes {string} from the product list',
  async ({ inventoryPage }, product: string) => {
    await inventoryPage.removeFromCart(product);
  },
);

When('the user continues shopping', async ({ cartPage }) => {
  await cartPage.continueShopping();
});

When('the user removes {string} from the cart', async ({ cartPage }, product: string) => {
  await cartPage.remove(product);
});

Then('the cart badge shows {int}', async ({ inventoryPage }, count: number) => {
  await expect(inventoryPage.cartBadge).toHaveText(String(count));
});

Then('the cart badge is not shown', async ({ inventoryPage }) => {
  await expect(inventoryPage.cartBadge).toBeHidden();
});

Then('the cart contains {string}', async ({ cartPage }, product: string) => {
  await expect(cartPage.cartItem(product)).toBeVisible();
});

Then('the cart is empty', async ({ cartPage }) => {
  await expect(cartPage.cartItems).toHaveCount(0);
});
