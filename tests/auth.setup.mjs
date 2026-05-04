import { chromium } from '@playwright/test';

(async () => {
  // This uses Playwright's built-in Chromium — same browser as your tests
  const browser = await chromium.launch({ headless: false, channel: undefined });
  const page = await browser.newPage();

  await page.goto('https://app.plane.so');
  await page.waitForTimeout(2000);

  await page.locator('input[type="email"]').fill('testmail.3618@gmail.com');
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(2000);

  await page.locator('input[type="password"]').fill('Scypher1845%');
  await page.locator('button:has-text("Continue")').click();

  await page.waitForURL(url => !url.toString().includes('login'), { timeout: 30000 });
  await page.waitForTimeout(2000);

  await page.context().storageState({ path: 'auth.json' });
  console.log('✅ Auth saved to auth.json');

  await browser.close();
})();