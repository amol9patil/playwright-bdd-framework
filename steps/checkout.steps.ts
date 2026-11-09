// Steps for Checkout.feature.
import { When, Then, expect } from '../fixtures/customFixtures';

// One business-level step that covers the whole happy path. The detail lives in the page objects.
When(
  'the user checks out with first name {string}, last name {string} and postal code {string}',
  async ({ cartPage, checkoutPage }, firstName: string, lastName: string, postalCode: string) => {
    await cartPage.startCheckout();
    await checkoutPage.fillDetails(firstName, lastName, postalCode);
    await checkoutPage.finish();
  },
);

// Goes from the cart to the details form and submits it. Valid details reach the order overview,
// missing ones show a validation error. Both outcomes are asserted in the scenario.
When(
  'the user enters checkout details with first name {string}, last name {string} and postal code {string}',
  async ({ cartPage, checkoutPage }, firstName: string, lastName: string, postalCode: string) => {
    await cartPage.startCheckout();
    await checkoutPage.fillDetails(firstName, lastName, postalCode);
  },
);

When('the user starts checkout', async ({ cartPage }) => {
  await cartPage.startCheckout();
});

When('the user cancels the checkout', async ({ checkoutPage }) => {
  await checkoutPage.cancel();
});

When('the user finishes the order', async ({ checkoutPage }) => {
  await checkoutPage.finish();
});

When('the user returns to the product list', async ({ checkoutPage }) => {
  await checkoutPage.backHome();
});

When('the user continues checkout without entering details', async ({ cartPage, checkoutPage }) => {
  await cartPage.startCheckout();
  await checkoutPage.continueWithoutDetails();
});

Then('the order overview shows {string}', async ({ checkoutPage }, text: string) => {
  await expect(checkoutPage.overviewText(text)).toBeVisible();
});

Then('the order confirmation says {string}', async ({ checkoutPage }, message: string) => {
  await expect(checkoutPage.orderConfirmation(message)).toBeVisible();
});

Then('the checkout error contains {string}', async ({ checkoutPage }, text: string) => {
  await expect(checkoutPage.errorMessage).toContainText(text);
});
