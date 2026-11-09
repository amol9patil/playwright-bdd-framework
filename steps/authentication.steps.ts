// Steps for Authentication.feature. Also holds "the user is logged in", which most other
// features use in their Background so that every scenario starts from a known state.

import { Given, When, Then, expect } from '../fixtures/customFixtures';
import { credentials } from '../utils/env';

Given('the user is on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

// Starts the scenario already logged in, using the session the fixtures saved for this worker
// (see authState in fixtures/customFixtures.ts). The login screen itself is tested separately
// in the scenarios that never use this step.
Given('the user is logged in', async ({ context, authState, inventoryPage }) => {
  await context.addCookies(authState.cookies);
  await inventoryPage.goto();
  await expect(inventoryPage.pageTitle).toHaveText('Products');
});

When('the user logs in with valid credentials', async ({ loginPage }) => {
  await loginPage.login(credentials.username, credentials.password);
});

// SauceDemo gives every account the same password, so the feature file only names the account.
When('the user logs in as the {string} user', async ({ loginPage }, username: string) => {
  await loginPage.login(username, credentials.password);
});

When(
  'the user logs in as {string} with password {string}',
  async ({ loginPage }, username: string, password: string) => {
    await loginPage.login(username, password);
  },
);

When('the user opens the inventory page directly', async ({ inventoryPage }) => {
  await inventoryPage.goto();
});

When('the user refreshes the page', async ({ inventoryPage }) => {
  await inventoryPage.reload();
});

When('the user logs out', async ({ loginPage }) => {
  await loginPage.logout();
});

Then('the inventory page is displayed', async ({ inventoryPage }) => {
  await expect(inventoryPage.pageTitle).toHaveText('Products');
});

Then('the error message contains {string}', async ({ loginPage }, text: string) => {
  await expect(loginPage.errorMessage).toContainText(text);
});

Then('the login page is displayed', async ({ loginPage }) => {
  await expect(loginPage.loginButton).toBeVisible();
});
