
import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected readonly page: Page) { }

    async dismissPopups(): Promise<void> {
        try {
            const minimizeBtn = this.page.locator('button[title="Minimize"]');
            if (await minimizeBtn.isVisible({ timeout: 500 })) {
                await minimizeBtn.click();
                await minimizeBtn.waitFor({ state: 'hidden' }); // замість waitForTimeout
            }
        } catch {
            // Popup not present, continue
        }
    }
}