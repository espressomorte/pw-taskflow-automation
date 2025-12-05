import { Page, Locator, expect } from '@playwright/test';

export class CardPage {
    readonly page: Page;

    // Card modal selectors - based on actual Trello DOM
    private get modal() { return this.page.locator('[data-testid="card-back-name"]'); }
    private get closeButton() { return this.page.getByLabel('Close dialog'); }
    private get titleInput() { return this.page.locator('[data-testid="card-back-title-input"]'); }
    private get descriptionButton() { return this.page.locator('[data-testid="description-button"]'); }
    private get actionsButton() { return this.page.locator('[data-testid="card-back-actions-button"]'); }

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Dismiss any popup modals (like Jira ads)
     */
    async dismissPopups() {
        try {
            const minimizeBtn = this.page.locator('button[title="Minimize"]');
            if (await minimizeBtn.isVisible({ timeout: 500 })) {
                await minimizeBtn.click();
                await this.page.waitForTimeout(300);
            }
        } catch {
            // Popup not present, continue
        }
    }

    /**
     * Open a card by clicking on its link
     */
    async openCard(cardName: string) {
        await this.dismissPopups();
        const cardLink = this.page.getByRole('link', { name: cardName });
        await cardLink.hover();

        // Чекаємо поки елемент буде ready для кліку
        await cardLink.waitFor({ state: 'attached' });
        await cardLink.waitFor({ state: 'visible' });

        // Клік з option чекати поки navigation завершиться
        await cardLink.click({
            noWaitAfter: false,
            timeout: 5000
        });

        await expect(this.modal).toBeVisible({ timeout: 10000 });
    }

    /**
     * Get the card title
     */
    async getTitle(): Promise<string> {
        return await this.titleInput.inputValue();
    }

    /**
     * Edit the card title
     */
    async setTitle(newTitle: string) {
        await this.titleInput.fill(newTitle);
        await this.titleInput.press('Enter');
    }

    /**
     * Set card description
     */
    async setDescription(text: string) {
        await this.page.getByTestId('description-button').click();
        await this.page.getByTestId('editor-content-container').getByRole('paragraph').click();
        await this.page.getByRole('textbox', { name: 'Description' }).fill(text);
        await this.page.getByRole('button', { name: 'Save' }).click();
    }

    /**
     * Archive the current card via actions menu
     */
    async archiveCard() {
        await this.actionsButton.click();
        await this.page.getByRole('menuitem', { name: 'Archive' }).click();
    }

    /**
     * Close the card modal
     */
    async close() {
        await this.closeButton.click();
        await expect(this.modal).not.toBeVisible();
    }

    /**
     * Check if card modal is open
     */
    async isOpen(): Promise<boolean> {
        return await this.modal.isVisible();
    }
}
