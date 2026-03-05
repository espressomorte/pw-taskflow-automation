import { test, expect } from '../../src/fixtures';

const BOARD_URL = process.env.TRELLO_BOARD_URL!;

test.describe('Board Operations', () => {
    test.describe.configure({ mode: 'serial', retries: 2 });

    test.beforeEach(async ({ boardPage }) => {
        await boardPage.goto(BOARD_URL);
    });

    test('TC-001: Create card in list @smoke', async ({ boardPage, cardCleanup }) => {
        const cardName = `Test Card ${Date.now()}`;
        const listNames = await boardPage.getListNames();
        const firstList = listNames[0];

        cardCleanup.register(cardName);

        const card = await boardPage.addCard(firstList, cardName);
        await expect(card).toBeVisible();
    });

    test('TC-002: Open and close card modal @sanity', async ({ boardPage, cardPage, cardCleanup }) => {
        const cardName = `Modal Test ${Date.now()}`;
        const listNames = await boardPage.getListNames();

        cardCleanup.register(cardName);
        const card = await boardPage.addCard(listNames[0], cardName);
        await expect(card).toBeVisible();

        await cardPage.openCard(cardName);
        await expect(cardPage.getModal()).toBeVisible();

        await cardPage.close();
        await expect(cardPage.getModal()).not.toBeVisible();
    });

    test('TC-003: Edit card title', async ({ boardPage, cardPage, cardCleanup }) => {
        const originalName = `Original ${Date.now()}`;
        const newName = `Updated ${Date.now()}`;
        const listNames = await boardPage.getListNames();

        // Register both names in case rename fails
        cardCleanup.register(originalName);
        cardCleanup.register(newName);

        await boardPage.addCard(listNames[0], originalName);
        await cardPage.openCard(originalName);

        await cardPage.setTitle(newName);
        await cardPage.close();

        await expect(boardPage.getCard(newName)).toBeVisible();
    });

    test('TC-004: Set card description', async ({ boardPage, cardPage, cardCleanup }) => {
        const cardName = `Desc Test ${Date.now()}`;
        const description = 'This is a test description added by automation';
        const listNames = await boardPage.getListNames();

        cardCleanup.register(cardName);
        const card = await boardPage.addCard(listNames[0], cardName);
        await expect(card).toBeVisible();

        await cardPage.openCard(cardName);
        await expect(cardPage.getModal()).toBeVisible();
        await cardPage.setDescription(description);
        await cardPage.close();
        await expect(cardPage.getModal()).not.toBeVisible();
    });

    test('TC-005: Archive card @smoke', async ({ boardPage }) => {
        const cardName = `Archive Test ${Date.now()}`;
        const listNames = await boardPage.getListNames();

        await boardPage.addCard(listNames[0], cardName);
        await boardPage.archiveCard(cardName);
        await expect(boardPage.getCard(cardName)).not.toBeVisible();
    });
});
