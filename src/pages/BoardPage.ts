import { Page, Locator, expect } from '@playwright/test';

export class BoardPage {
    readonly page: Page;

    // Selectors
    private get lists() { return this.page.locator('[data-testid="list"]'); }
    private get addListButton() { return this.page.getByRole('button', { name: 'Add another list' }); }
    private get listNameInput() { return this.page.getByPlaceholder('Enter list name…'); }
    private get addListSubmit() { return this.page.getByRole('button', { name: 'Add list' }); }

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

    async goto(boardUrl: string) {
        await this.page.goto(boardUrl);
        //await this.page.waitForLoadState('networkidle');
        await expect(this.lists.first()).toBeVisible({ timeout: 10000 });
        await this.dismissPopups();
    }

    /**
     * Get a specific list by name
     */
    getList(listName: string): Locator {
        return this.lists.filter({ has: this.page.getByRole('heading', { name: listName }) });
    }

    /**
     * Get a card's clickable link by name (opens card modal when clicked)
     */
    getCard(cardName: string): Locator {
        // Use getByRole with exact name for reliable matching
        return this.page.getByRole('link', { name: cardName, exact: true });
    }

    /**
     * Add a card to a specific list
     */
    async addCard(listName: string, cardName: string) {
        const list = this.getList(listName);
        await list.getByRole('button', { name: `Add a card` }).click();
        await this.page.getByTestId('list-card-composer-textarea').fill(cardName);
        await this.page.getByTestId('list-card-composer-add-card-button').click();
        await expect(list.locator('[data-testid="trello-card"]').filter({ hasText: cardName })).toBeVisible();
    }

    /**
     * Add a new list to the board
     */
    async addList(listName: string) {
        await this.addListButton.click();
        await this.listNameInput.fill(listName);
        await this.addListSubmit.click();
        await expect(this.getList(listName)).toBeVisible();
    }

    /**
     * Get all list names on the board
     */
    async getListNames(): Promise<string[]> {
        const headings = this.page.locator('[data-testid="list"] h2');
        return await headings.allTextContents();
    }

    /**
     * Get card count in a specific list
     */
    async getCardCount(listName: string): Promise<number> {
        const list = this.getList(listName);
        return await list.locator('[data-testid="trello-card"]').count();
    }

    /**
     * Archive a card using the quick edit dropdown menu on board
     */
    async archiveCard(cardName: string) {
        // Hover on card to reveal the edit button
        const card = this.page.locator('[data-testid="trello-card"]').filter({ hasText: cardName });
        await card.hover();
        await this.page.getByRole('button', { name: `Edit card ${cardName}` }).click();
        await this.page.getByTestId('quick-card-editor-archive').click();
    }
}
