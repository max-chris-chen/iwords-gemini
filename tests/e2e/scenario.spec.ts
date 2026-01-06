import { test, expect } from '@playwright/test';

test('should generate a scenario and display its mind map', async ({ page }) => {
  await page.goto('/');

  // Fill the scenario prompt - using the new CapsuleInput placeholder
  const input = page.locator('input[placeholder="Create new scenario..."]');
  await expect(input).toBeVisible();
  
  // Click to focus/expand (optional but mimics user)
  await input.click();
  await input.fill('a trip to the mountains');
  
  // Press Enter to submit
  await input.press('Enter');

  // Assert that the URL has changed to the scenario page
  await expect(page).toHaveURL(/.*\/scenario\/[a-f0-9]+$/, { timeout: 60000 });

  // Assert that the scenario prompt is displayed on the page as a heading
  await expect(page.getByRole('heading', { name: 'a trip to the mountains', exact: false })).toBeVisible();

  // Assert that the Mind Map container is visible
  await expect(page.locator('.svelte-flow')).toBeVisible();
});

test('should expand an existing scenario with more words', async ({ page }) => {
  // 1. Generate a fresh scenario first to ensure we have data
  await page.goto('/');
  const input = page.locator('input[placeholder="Create new scenario..."]');
  await input.click();
  await input.fill('coffee shop');
  await input.press('Enter');
  
  // Wait for mind map to load
  await expect(page).toHaveURL(/.*\/scenario\/[a-f0-9]+$/, { timeout: 60000 });
  await expect(page.locator('.svelte-flow')).toBeVisible();
  
  // 2. Get initial word count
  const wordCountBadge = page.locator('div:has-text("Words")').first();
  await expect(wordCountBadge).toBeVisible();
  const initialText = await wordCountBadge.innerText();
  const initialCount = parseInt(initialText.split(' ')[0]);

  // 3. Find the "+" button on the root node and click it
  const expandButton = page.locator('button[aria-label="Expand scenario"]');
  await expect(expandButton).toBeVisible();
  await expandButton.click();

  // 4. Assert that the word count has increased by 2
  await expect(async () => {
    const newText = await wordCountBadge.innerText();
    const newCount = parseInt(newText.split(' ')[0]);
    expect(newCount).toBe(initialCount + 2);
  }).toPass({ timeout: 60000 });
});