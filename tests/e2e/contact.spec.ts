import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should submit the contact form successfully', async ({ page }) => {
    await page.goto('/contact');

    // Fill out the form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message.');

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for the success message
    await page.waitForSelector('p:has-text("Thank you for your message!")');
    const successMessage = await page.locator('p:has-text("Thank you for your message!")').textContent();
    expect(successMessage).toContain('Thank you for your message!');
  });
});
