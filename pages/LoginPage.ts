import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login screen, plus the menu action that logs the user out.
 * Edit this file when: the login form changes (new field, new button text).
 */
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly menuButton: Locator;
  private readonly logoutButton: Locator;

  // Public because the steps assert on these two.
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async goto(): Promise<void> {
    await this.open('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Logout lives inside the side menu, so the menu has to be opened first.
   * On the current site it is exposed as a button, not a link. The accessibility snapshot
   * in the failure report showed that, which is why role-based locators are worth it.
   */
  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutButton.click();
  }
}
