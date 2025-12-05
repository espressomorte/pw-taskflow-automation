import { Page, expect } from '@playwright/test';
import { AUTH_CONFIG } from '../config/auth.config';

export class LoginPage {
    readonly page: Page;

    get usernameInput() { return this.page.getByTestId('username'); }
    get passwordInput() { return this.page.getByTestId('password'); }
    get submitButton() { return this.page.getByTestId('login-submit'); }

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to login page
     * @param url - base URL of the application
     */
    async gotoLoginPage(url: string) {
        await this.page.goto(`${url}/login`);
        // Wait for Trello's client-side redirect to complete
        await this.page.waitForLoadState('networkidle');
        await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    }

    /**
     * Fill credentials and submit login form
     * @param email - user email
     * @param password - user password
     */
    async login(email: string, password: string) {
        await this.usernameInput.fill(email);
        await this.submitButton.click();
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    /**
     * Complete login flow including wait for success
     * Combines login + wait for redirect to dashboard
     * @param email - user email
     * @param password - user password
     */
    async loginAndWait(email: string, password: string) {
        await this.login(email, password);
        await this.page.waitForURL(AUTH_CONFIG.SUCCESS_URL_PATTERN, {
            timeout: AUTH_CONFIG.LOGIN_TIMEOUT
        });
    }

    /**
     * Save current session to storage state file
     * @param path - optional custom path, defaults to config value
     */
    async saveSession(path: string = AUTH_CONFIG.STORAGE_STATE_PATH) {
        await this.page.context().storageState({ path });
    }
}