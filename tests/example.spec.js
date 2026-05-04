// @ts-check
import { test, expect } from '@playwright/test';
import { runSteps, configure } from 'passmark';

configure({
  ai: {
    gateway: 'openrouter'
  }
});

test('Create issue with empty title', async ({ page }) => {
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
    userFlow: 'Test empty title validation when creating a work item',
    steps: [
      { description: 'Click the "Add work item" button in the top right corner' },
      { description: 'Wait for the create work item modal to appear' },
      { description: 'Leave the title field completely empty — do not type anything' },
      { description: 'Click the Save button to submit the form' },
    ],
    assertions: [
      { assertion: 'The work item is NOT created — either an error message appears saying title is required, or the dialog stays open and refuses to save' }
    ],
    test,
    expect
  });
});

test('Create issue with 10,000 character title', async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto('https://app.plane.so/trt1/projects/540e0ea8-a635-4939-a1ea-a62ec21c2adb/issues/');
  await page.waitForTimeout(3000);

  // Dismiss the trial popup if it appears
  const trialButton = page.locator('button:has-text("Let\'s get started")');
  if (await trialButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await trialButton.click();
    await page.waitForTimeout(1000);
  }

  const longTitle = 'A'.repeat(10000);

  // Click the button with AI
  await runSteps({
    page,
    userFlow: 'Open the create work item dialog',
    steps: [
      { description: 'Click the "Add work item" button in the top right corner' },
      { description: 'Wait for the create work item modal to appear' },
      { description: 'Click on the title input field' },
    ],
    assertions: [],
    test,
    expect
  });

  // Type directly with Playwright — bypasses AI token limit
  await page.locator('input[placeholder*="title" i], input[placeholder*="Title" i], div[contenteditable="true"]').first().fill(longTitle);;
  await page.waitForTimeout(2000);

  // Now use AI to click save and assert
  await runSteps({
    page,
    userFlow: 'Save the work item and check result',
    steps: [
      { description: 'Click the Save button to submit the form' },
    ],
    assertions: [
      { assertion: 'Either an error shows saying title is too long, OR the item saves successfully with no warning — note exactly what happens' }
    ],
    test,
    expect
  });
});