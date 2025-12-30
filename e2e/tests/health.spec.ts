import { test, expect } from '@playwright/test';

test.describe('Health Checks', () => {
  test('frontend should be accessible', async ({ page }) => {
    await page.goto('/');

    // Check if the page title is correct
    await expect(page).toHaveTitle(/RSS Reader MVP/);

    // Check if the main heading is visible
    const heading = page.locator('h1');
    await expect(heading).toHaveText('RSS Reader MVP');
  });

  test('backend GraphQL endpoint should be accessible', async ({ request }) => {
    // Test the health query via GraphQL
    const response = await request.post('http://localhost:8787/graphql', {
      data: {
        query: '{ health }',
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.data.health).toBe('ok');
  });

  test('backend REST health endpoint should be accessible', async ({ request }) => {
    const response = await request.get('http://localhost:8787/health');

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeDefined();
  });
});
