import { test, expect } from '@playwright/test';
const BOARD_URL = process.env.TRELLO_BOARD_URL!;

test('сreate card in first list', async ({ page }) => {

  await page.goto(BOARD_URL);

  await expect(page.getByRole('button', { name: 'Add a card' }).first()).toBeVisible();
  const firstList = page.locator('[data-testid="list"]').first();
  await page.getByRole('button', { name: 'Add a card in firstList' }).click();
  await page.getByTestId('list-card-composer-textarea').fill('byScript');
  await page.getByTestId('list-card-composer-add-card-button').click();
  await expect(firstList.locator('[data-testid="trello-card"]').filter({ hasText: 'byScript' })).toBeVisible();
});
