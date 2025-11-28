import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
    await page.goto('https://trello.com/login');
    await page.getByTestId('username').fill(process.env.TRELLO_EMAIL!);
    await page.getByTestId('login-submit-idf-testid').click();
    await page.getByTestId('password').fill(process.env.TRELLO_PASS!);
    await page.getByTestId('login-submit-idf-testid').click();

    await page.waitForURL('**/boards*', { timeout: 10000 });

    await page.context().storageState({ path: 'auth.json' });
});
