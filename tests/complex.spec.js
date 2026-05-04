// @ts-check
import { test, expect } from '@playwright/test';
import { runSteps, configure } from 'passmark';

configure({
  ai: {
    gateway: 'openrouter'
  }
});

test('Complex multi-step flow', async ({ page }) => {
  test.setTimeout(180_000);

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
    userFlow: 'Create a fully configured work item with priority and state',
    steps: [
      { description: 'Click the "Add work item" button in the top right corner' },
      { description: 'Wait for the create work item modal to appear' },
      { description: 'Type "Complex Flow Test Issue" in the title field' },
      { description: 'Set the priority to "High"' },
      { description: 'Click the Save button' },
      { description: 'Find the newly created work item titled "Complex Flow Test Issue" in the list' },
      { description: 'Open the work item by clicking on it' },
      { description: 'Change the state of the work item to "In Progress"' },
    ],
    assertions: [
      { assertion: 'The work item titled "Complex Flow Test Issue" exists with priority set to "High" and state set to "In Progress"' }
    ],
    test,
    expect
  });
});