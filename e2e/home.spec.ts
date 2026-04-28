import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders a heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('has a navigation bar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('CTA link navigates to /plan/new', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /plan|start|get started/i }).first().click();
    await expect(page).toHaveURL('/plan/new');
  });

  test('sign in button is visible when logged out', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});
