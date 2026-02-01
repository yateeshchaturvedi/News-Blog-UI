import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/News/);
  });

  test('should navigate to the blog page', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Blog/);
  });

  test('should navigate to the search page', async ({ page }) => {
    await page.goto('/search');
    await expect(page).toHaveTitle(/Search/);
  });

  test('should navigate to the contact page', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Contact/);
  });
});
