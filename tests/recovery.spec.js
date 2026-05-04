// @ts-check
import { test, expect } from '@playwright/test';
import { runSteps, configure } from 'passmark';

configure({
  ai: {
    gateway: 'openrouter'
  }
});

test('Recovery from wrong navigation', async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto('https://app.plane.so/trt1/projects/540e0ea8-a635-4939-a1ea-a62ec21c2adb/issues/');
  await page.waitForTimeout(3000);

  // Dismiss the trial popup if it appears
  const trialButton = page.locator('button:has-text("Let\'s get started")');
  if (await trialButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await trialButton.click();
    await page.waitForTimeout(1000);
  }

  await runSteps({
    page,
    userFlow: 'Create a work item after recovering from wrong page',
    steps: [
      { description: 'Navigate to https://www.google.com' },
      { description: 'Click the "Add work item" button to create a new issue' },
      { description: 'Type "Recovery Test Issue" in the title field' },
      { description: 'Click the Save button' },
    ],
    assertions: [
      { assertion: 'A work item titled "Recovery Test Issue" was successfully created' }
    ],
    test,
    expect
  });
});