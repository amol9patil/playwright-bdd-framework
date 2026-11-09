import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Covers all three checkout screens: customer details, order overview and confirmation.
 * Edit this file when: a checkout field or button changes.
 */
export class CheckoutPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  private readonly backHomeButton: Locator;

  /** Validation message shown when the details form is incomplete. */
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    this.errorMessage = page.getByTestId('error');
  }

  /**
   * Fills the details form and presses Continue. With valid details this lands on the order
   * overview. With a missing field the form stays put and shows an error. Empty strings are fine.
   */
  async fillDetails(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /** Used to check the validation: submits the form with every field empty. */
  async continueWithoutDetails(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  /** Leaves checkout and goes back to the cart. */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /** From the confirmation screen back to the product list. */
  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  /** Any text on the order overview, such as "Item total: $39.98". */
  overviewText(text: string): Locator {
    return this.page.getByText(text);
  }

  /** Returns a locator so the step can use a web-first assertion on it. */
  orderConfirmation(message: string): Locator {
    return this.page.getByRole('heading', { name: message });
  }
}
