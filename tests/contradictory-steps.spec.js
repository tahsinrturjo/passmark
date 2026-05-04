// @ts-check
import { test, expect } from '@playwright/test';
import { runSteps, configure } from 'passmark';

configure({
  ai: {
    gateway: 'openrouter'
  }
});

test('Contradictory priority instructions', async ({ page }) => {
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
    userFlow: 'Create a work item and set conflicting priorities',
    steps: [
      { description: 'Click the "Add work item" button in the top right corner' },
      { description: 'Wait for the create work item modal to appear' },
      { description: 'Type "Contradictory Priority Test" in the title field' },
      { description: 'Set the priority to "High"' },
      { description: 'Set the priority to "Low"' },
      { description: 'Click the Save button to submit the form' },
    ],
    assertions: [
      { assertion: 'The work item was created and its priority is set to "Low"' }
    ],
    test,
    expect
  });
});