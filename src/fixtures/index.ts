import { test as base, expect } from '@playwright/test';
import { TrelloAPI } from '../api/trello-api';
import { BoardPage } from '../pages/BoardPage';
import { CardPage } from '../pages/CardPage';

// Extract board ID from URL like https://trello.com/b/F0uKSAMG/test
function getBoardIdFromUrl(url: string): string {
    const match = url.match(/\/b\/([^/]+)/);
    return match ? match[1] : '';
}

// Define fixture types
type TestFixtures = {
    trelloAPI: TrelloAPI;
    testBoard: { boardId: string; listId: string };
    boardPage: BoardPage;
    cardPage: CardPage;
    cardCleanup: { register: (cardName: string) => void };
};

export const test = base.extend<TestFixtures>({
    /**
     * TrelloAPI client fixture
     */
    trelloAPI: async ({ }, use) => {
        const api = new TrelloAPI(
            process.env.TRELLO_KEY!,
            process.env.TRELLO_TOKEN!
        );
        await use(api);
    },

    /**
     * Test Board fixture with automatic cleanup
     */
    testBoard: async ({ trelloAPI }, use) => {
        const boardId = await trelloAPI.createBoard(`Test-${Date.now()}`);
        const listId = await trelloAPI.createList(boardId, 'TestList');

        await use({ boardId, listId });

        await trelloAPI.deleteBoard(boardId);
    },

    /**
     * BoardPage fixture
     */
    boardPage: async ({ page }, use) => {
        await use(new BoardPage(page));
    },

    /**
     * CardPage fixture
     */
    cardPage: async ({ page }, use) => {
        await use(new CardPage(page));
    },

    /**
     * Card cleanup fixture - register card names to delete after test
     */
    cardCleanup: async ({ trelloAPI }, use) => {
        const cardNames: string[] = [];
        const boardId = getBoardIdFromUrl(process.env.TRELLO_BOARD_URL!);

        await use({
            register: (cardName: string) => cardNames.push(cardName)
        });

        // Cleanup: delete all registered cards by name
        for (const cardName of cardNames) {
            await trelloAPI.deleteCardByName(boardId, cardName).catch(() => {
                // Ignore errors (card might already be archived/deleted)
            });
        }
    },
});

export { expect };
