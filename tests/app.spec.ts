import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should have the correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/News and Blog/);
  });

  test('should display the hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('The Latest News and In-Depth Analysis');
  });

  test('should display news articles', async ({ page }) => {
    await page.goto('/');
    const articles = await page.locator('article').count();
    expect(articles).toBeGreaterThan(0);
  });
});

test.describe('Search Page', () => {
  test('should allow users to search for articles', async ({ page }) => {
    await page.goto('/search');
    await page.fill('input[type="text"]', 'technology');
    await page.waitForTimeout(500);
    const articles = await page.locator('article').count();
    expect(articles).toBeGreaterThan(0);
  });
});

test.describe('Contact Page', () => {
  test('should allow users to submit the contact form', async ({ page }) => {
    await page.goto('/contact');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message.');
    await page.click('button[type="submit"]');
    await expect(page.locator('p')).toContainText('Thank you for your message!');
  });
});
