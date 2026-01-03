import { test, expect } from '@playwright/test';

test('should generate a scenario and display its mind map', async ({ page }) => {
  await page.goto('/generate');

  // Fill the scenario prompt
  await page.locator('textarea[placeholder="Enter your scenario here (e.g., \'a day at the beach\')"]').fill('a trip to the mountains');

  // Click the generate button
  await page.getByRole('button', { name: 'Generate Scenario' }).click();

  // Assert that the URL has changed to the scenario page
  // Increased timeout to 60s because AI generation can be slow
  await expect(page).toHaveURL(/.*\/scenario\/[a-f0-9]+$/, { timeout: 60000 });

  // Assert that the scenario prompt is displayed on the page as a heading
  await expect(page.getByRole('heading', { name: 'a trip to the mountains', exact: false })).toBeVisible();

  // Assert that the Mind Map container is visible
  await expect(page.locator('.svelte-flow')).toBeVisible();
});
