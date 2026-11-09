import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Product listing ("Products" screen): browsing, sorting and adding to the cart.
 * Edit this file when: the product cards or the sort options change.
 */
export class InventoryPage extends BasePage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  /** Opens the product list directly. Needs an existing session, see authState in the fixtures. */
  async goto(): Promise<void> {
    await this.open('/inventory.html');
  }

  /** exact: true matters here, otherwise a partial name can match more than one card. */
  private productCard(productName: string): Locator {
    return this.items.filter({ has: this.page.getByText(productName, { exact: true }) });
  }

  async addToCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  /** The product card shows a Remove button once the item is in the cart. */
  async removeFromCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  /** Takes the visible option text, e.g. "Price (low to high)". */
  async sortBy(optionLabel: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
