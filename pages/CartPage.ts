import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Shopping cart: reviewing what was added, removing items and starting checkout.
 * Edit this file when: the cart layout or its buttons change.
 */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  /** One line item in the cart, found by its exact product name. */
  cartItem(productName: string): Locator {
    return this.cartItems.filter({ has: this.page.getByText(productName, { exact: true }) });
  }

  async remove(productName: string): Promise<void> {
    await this.cartItem(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
