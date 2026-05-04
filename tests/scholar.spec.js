// @ts-check
import { test, expect } from '@playwright/test';
import { runSteps, configure } from 'passmark';

configure({
  ai: {
    gateway: 'openrouter'
  }
});

test('Find research paper on Google Scholar', async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto('https://scholar.google.com');
  await page.waitForTimeout(3000);

  await runSteps({
    page,
    userFlow: 'Search for a research paper on Google Scholar and open it',
    steps: [
      { description: 'Type "transformer attention mechanisms" in the search box' },
      { description: 'Click the search button' },
      { description: 'Complete the CAPTCHA if it appears' },
      { description: 'Wait for the search results to load' },
      { description: 'Click on the first research paper result' },
    ],
    assertions: [
      { assertion: 'A research paper about transformer attention mechanisms is now open or visible on the screen' }
    ],
    test,
    expect
  });
});