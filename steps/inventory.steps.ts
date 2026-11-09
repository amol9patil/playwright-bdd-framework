// Steps for Inventory.feature.
import { When, Then, expect } from '../fixtures/customFixtures';

When('the user sorts products by {string}', async ({ inventoryPage }, option: string) => {
  await inventoryPage.sortBy(option);
});

Then('the inventory shows {int} products', async ({ inventoryPage }, count: number) => {
  await expect(inventoryPage.items).toHaveCount(count);
});

Then('the first product is {string}', async ({ inventoryPage }, name: string) => {
  await expect(inventoryPage.itemNames.first()).toHaveText(name);
});
