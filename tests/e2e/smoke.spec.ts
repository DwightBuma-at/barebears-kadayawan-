import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/dashboard', '/inventory', '/pos', '/audit-logs'];

for (const route of ROUTES) {
  test(`route ${route} has no horizontal overflow and no axe violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
}
