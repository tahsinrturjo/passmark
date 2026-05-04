// @ts-check
import { test, expect } from '@playwright/test';
import { runSteps, configure } from 'passmark';

configure({
  ai: { gateway: 'openrouter' }
});

test('Vague instructions - can AI figure out what to do', async ({ page }) => {
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
    userFlow: 'Do the thing to make a new task',
    steps: [
      { description: 'Make a new thing' },
      { description: 'Call it "Vague Test Item"' },
      { description: 'Finish it' },
    ],
    assertions: [
      { assertion: 'A new work item called "Vague Test Item" was created successfully' }
    ],
    test,
    expect
  });
});