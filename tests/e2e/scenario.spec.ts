import { test, expect } from '@playwright/test';

test('should generate a scenario and display its mind map', async ({ page }) => {
  await page.goto('/generate');

  // Fill the scenario prompt
  await page.locator('textarea[placeholder="Enter your scenario here (e.g., \'a day at the beach\')"]').fill('a trip to the mountains');

  // Click the generate button
  await page.getByRole('button', { name: 'Generate Scenario' }).click();

  // Assert that the URL has changed to the scenario page
  await expect(page).toHaveURL(/.*\/scenario\/[a-f0-9]+$/);

  // Assert that the scenario prompt is displayed on the page
  await expect(page.getByText('a trip to the mountains')).toBeVisible();

  // Assert that the Mind Map container is visible (or some other indicator of the mind map)
  // This might require a more specific selector depending on how SvelteFlow renders
  await expect(page.locator('.react-flow__renderer')).toBeVisible(); // Assuming SvelteFlow uses this class
});
