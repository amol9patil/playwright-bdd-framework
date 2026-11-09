import type { Locator, Page } from '@playwright/test';

/**
 * Parent of every page object :-
 * locators are readonly fields set in the constructor, methods are things a user does, and assertions stay in the step definitions.
 *
 * Edit this file when: something is true of every page (a shared header, a common helper).
 */
export abstract class BasePage {
  /** Heading at the top of every logged-in page ("Products", "Your Cart" and so on). */
  readonly pageTitle: Locator;

  protected constructor(protected readonly page: Page) {
    this.pageTitle = page.getByTestId('title');
  }

  protected async open(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Reloads the current page. Used to check that the session survives a refresh. */
  async reload(): Promise<void> {
    await this.page.reload();
  }
}
