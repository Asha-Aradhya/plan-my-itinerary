import { test, expect } from '@playwright/test';

test.describe('Plan flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/itinerary/generate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Day 1 — Arrival & First Impressions\nMorning: Explore the city centre.\nAfternoon: Visit local museums.\nEvening: Dinner at a local restaurant.\n\nTravel Essentials\nBest way to get around: Metro.',
      });
    });
  });

  test('step 1 shows validation error when destination is empty', async ({ page }) => {
    await page.goto('/plan/new');
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByRole('alert')).toContainText(/destination/i);
  });

  test('step 2 shows validation error when no trip type is selected', async ({ page }) => {
    await page.goto('/plan/new');

    await page.getByLabel(/destination/i).fill('Rome, Italy');
    await page.getByLabel(/departure date/i).fill('2026-09-01');
    await page.getByLabel(/return date/i).fill('2026-09-07');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByRole('alert')).toContainText(/trip type/i);
  });

  test('step 3 shows validation error when no interest is selected', async ({ page }) => {
    await page.goto('/plan/new');

    // Step 1
    await page.getByLabel(/destination/i).fill('Paris, France');
    await page.getByLabel(/departure date/i).fill('2026-09-01');
    await page.getByLabel(/return date/i).fill('2026-09-07');
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 2
    await page.getByRole('button', { name: /cultural/i }).click();
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 3 — skip interests
    await page.getByRole('button', { name: /mid-range/i }).click();
    await page.getByRole('button', { name: /moderate/i }).click();
    await page.getByRole('button', { name: /generate my itinerary/i }).click();
    await expect(page.getByRole('alert')).toContainText(/interest/i);
  });

  test('completes the full form and reaches the itinerary page', async ({ page }) => {
    await page.goto('/plan/new');

    // Step 1: Destination
    await page.getByLabel(/destination/i).fill('Tokyo, Japan');
    await page.getByLabel(/departure date/i).fill('2026-09-01');
    await page.getByLabel(/return date/i).fill('2026-09-08');
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 2: Travellers
    await page.getByRole('button', { name: /cultural/i }).click();
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 3: Preferences
    await page.getByRole('button', { name: /mid-range/i }).click();
    await page.getByRole('button', { name: /moderate/i }).click();
    await page.getByRole('button', { name: /food & cuisine/i }).click();
    await page.getByRole('button', { name: /generate my itinerary/i }).click();

    await expect(page).toHaveURL('/itinerary');
    await expect(page.getByText(/day 1/i)).toBeVisible({ timeout: 10_000 });
  });

  test('back button returns to the previous step', async ({ page }) => {
    await page.goto('/plan/new');

    await page.getByLabel(/destination/i).fill('Lisbon, Portugal');
    await page.getByLabel(/departure date/i).fill('2026-10-01');
    await page.getByLabel(/return date/i).fill('2026-10-07');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.getByRole('button', { name: /back/i }).click();
    await expect(page.getByLabelText(/destination/i)).toBeVisible();
    await expect(page.getByLabelText(/destination/i)).toHaveValue('Lisbon, Portugal');
  });
});
