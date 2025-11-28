// src/tests/api-only-card-creation.spec.ts
import { test, expect } from '@playwright/test';
import { TrelloAPI } from '../src/api/trello-api';

test.describe('API Card Operations', () => {
    let trelloAPI: TrelloAPI;
    let boardId: string;
    let listId: string;

    test.beforeAll(async () => {
        trelloAPI = new TrelloAPI(process.env.TRELLO_KEY!, process.env.TRELLO_TOKEN!);

        // Створюємо дошку через API
        boardId = await trelloAPI.createBoard('API Test');
        listId = await trelloAPI.createList(boardId, 'firstList');

        // Assert
        expect(listId).toBeDefined();
        expect(typeof listId).toBe('string');

        const lists = await trelloAPI.getLists(boardId);
        const createdList = lists.find(list => list.id === listId);
        expect(createdList.name).toBe('firstList');

    });

    test.afterAll(async () => {
        await trelloAPI.deleteBoard(boardId);
    });

    test('create card via API only', async () => {
        const cardName = 'byAPI';

        const cardId = await trelloAPI.createCard(listId, cardName, 'Description from API');
        const cards = await trelloAPI.getCards(boardId);
        const createdCard = cards.find(card => card.id === cardId);

        expect(createdCard).toBeDefined();
        expect(createdCard.name).toBe(cardName);
        expect(createdCard.desc).toBe('Description from API');
    });

    test('create multiple cards via API', async () => {
        const cardsToCreate = ['API Card 1', 'API Card 2', 'API Card 3'];

        for (const cardName of cardsToCreate) {
            await trelloAPI.createCard(listId, cardName);
        }

        const cards = await trelloAPI.getCards(boardId);
        const createdCardNames = cards.map(card => card.name);

        expect(createdCardNames).toEqual(expect.arrayContaining(cardsToCreate));
    });
});