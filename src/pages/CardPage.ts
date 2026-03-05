import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CardPage extends BasePage {
    // Card modal selectors - based on actual Trello DOM
    private get closeButton() { return this.page.getByLabel('Close dialog'); }
    private get titleInput() { return this.page.locator('[data-testid="card-back-title-input"]'); }
    private get descriptionButton() { return this.page.locator('[data-testid="description-button"]'); }
    private get actionsButton() { return this.page.locator('[data-testid="card-back-actions-button"]'); }

    /**
     * Open a card by clicking on its link
     */
    async openCard(cardName: string) {
        await this.dismissPopups();
        const cardLink = this.page.getByRole('link', { name: cardName });
        await cardLink.hover();

        await cardLink.waitFor({ state: 'attached' });
        await cardLink.waitFor({ state: 'visible' });

        await cardLink.click({
            noWaitAfter: false,
            timeout: 5000
        });
        await this.getModal().waitFor({ state: 'visible', timeout: 10000 });
    }

    getModal(): Locator {
        return this.page.locator('[data-testid="card-back-name"]');
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
    async archiveCardViaActions() {
        await this.actionsButton.click();
        await this.page.getByRole('menuitem', { name: 'Archive' }).click();
    }
    /**
     * Archive the current card
     */
    async archiveCard(cardName: string) {
        const card = this.page.locator('[data-testid="trello-card"]').filter({ hasText: cardName });
        await card.hover();
        await card.getByTestId('card-done-state-completion-button').click();

        const archiveBtn = this.page.getByRole('button', { name: 'Archive card' });
        await archiveBtn.waitFor({ state: 'visible', timeout: 5000 });
        await archiveBtn.click();
    }
    /**
     * Close the card modal
     */
    async close() {
        await this.closeButton.click();
    }

}
