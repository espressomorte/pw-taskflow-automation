import { test as setup } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { isSessionValid } from '../src/utils/session.utils';

setup('authenticate', async ({ page }) => {
    // Skip login if session is still valid
    if (isSessionValid()) {
        return;
    }

    const loginPage = new LoginPage(page);

    await loginPage.gotoLoginPage(process.env.TRELLO_BASE_URL!);
    await loginPage.loginAndWait(process.env.TRELLO_EMAIL!, process.env.TRELLO_PASS!);
    await loginPage.saveSession();
});