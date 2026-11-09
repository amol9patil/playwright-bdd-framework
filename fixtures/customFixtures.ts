// Fixtures provide the page objects to the step files, so a step file doesn't need to create
// the page object for each page itself (no `new LoginPage(page)` inside the steps).
// This file also holds the logged-in session that scenarios reuse (see authState below).
// Edit this file when: you add a new page object (add it to PageFixtures and to test.extend).
import { test as base, createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import type { BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { credentials } from '../utils/env';

/** Cookies and local storage of a logged-in browser, as Playwright saves them. */
type AuthState = Awaited<ReturnType<BrowserContext['storageState']>>;

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

type WorkerFixtures = {
  authState: AuthState;
};

export const test = base.extend<PageFixtures, WorkerFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),

  // Logs in through the UI once per worker, in a throwaway browser context, and keeps the
  // session (Playwright's storageState). Scenarios that need a logged-in user load it instead
  // of typing the credentials again. That is where most of the run time was going.
  // Scenarios that test the login itself never ask for it, so they still start logged out.
  authState: [
    async ({ browser }, use) => {
      const baseURL = base.info().project.use.baseURL;
      const context = await browser.newContext({ baseURL });
      const page = await context.newPage();

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(credentials.username, credentials.password);
      await expect(page).toHaveURL(/inventory\.html/);

      const state = await context.storageState();
      await context.close();
      await use(state);
    },
    { scope: 'worker' },
  ],
});

export const { Given, When, Then } = createBdd(test);
export { expect } from '@playwright/test';
