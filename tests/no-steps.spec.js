// @ts-check
import { test, expect } from '@playwright/test';
import { runUserFlow, configure } from 'passmark';

configure({
  ai: { gateway: 'openrouter' }
});

test('No steps - AI figures out everything on its own', async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto('https://app.plane.so/trt1/projects/540e0ea8-a635-4939-a1ea-a62ec21c2adb/issues/');
  await page.waitForTimeout(3000);

  // Dismiss trial popup if it appears
  const trialButton = page.locator('button:has-text("Let\'s get started")');
  if (await trialButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await trialButton.click();
    await page.waitForTimeout(1000);
  }

  await runUserFlow({
    page,
    userFlow: 'Create a work item called "AI Did This Alone" and save it',
    steps: 'Create a new work item with the title "AI Did This Alone"',
    test,
    expect
  });
});