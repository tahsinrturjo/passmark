// @ts-check
import { test, expect } from '@playwright/test';
import { runSteps, configure } from 'passmark';

configure({
  ai: { gateway: 'openrouter' }
});

test('Wrong button - click a button that does not exist', async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto('https://app.plane.so/trt1/projects/540e0ea8-a635-4939-a1ea-a62ec21c2adb/issues/');
  await page.waitForTimeout(3000);

  // Dismiss trial popup if it appears
  const trialButton = page.locator('button:has-text("Let\'s get started")');
  if (await trialButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await trialButton.click();
    await page.waitForTimeout(1000);
  }

  await runSteps({
    page,
    userFlow: 'Click a button that does not exist on the page',
    steps: [
      { description: 'Click the big red "Delete Everything" button in the middle of the screen' },
    ],
    assertions: [
      { assertion: 'Nothing was deleted and the page looks exactly the same as before' }
    ],
    test,
    expect
  });
});