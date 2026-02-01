import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test('should perform a search and display results', async ({ page }) => {
    await page.goto('/search');

    // Fill the search input and submit the form
    await page.fill('input[name="query"]', 'Technology');
    await page.press('input[name="query"]', 'Enter');

    // Wait for the results to load and check that they are visible
    await page.waitForSelector('h2:has-text("Search Results for: Technology")');
    const results = await page.locator('article').count();
    expect(results).toBeGreaterThan(0);
  });
});
