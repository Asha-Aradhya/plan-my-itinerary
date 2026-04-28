import { test, expect } from '@playwright/test';

test.describe('AI Master', () => {
  test('teaser is visible on /plan/new', async ({ page }) => {
    await page.goto('/plan/new');
    await expect(page.getByRole('heading', { name: /still deciding/i })).toBeVisible();
  });

  test('teaser shows sign-in CTA for logged-out users', async ({ page }) => {
    await page.goto('/plan/new');
    await expect(
      page.getByRole('button', { name: /sign in to plan with our ai master/i }),
    ).toBeVisible();
  });

  test('/plan/chat redirects unauthenticated users to /plan/new', async ({ page }) => {
    await page.goto('/plan/chat');
    await expect(page).toHaveURL('/plan/new');
  });
});
