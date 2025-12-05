import { test, expect } from '../../src/fixtures';

test.describe('API Card Operations', () => {

    test('create card via API', async ({ trelloAPI, testBoard }) => {
        const { listId, boardId } = testBoard;
        const cardName = 'Card via Fixture';

        const cardId = await trelloAPI.createCard(listId, cardName, 'Description from API');
        const cards = await trelloAPI.getCards(boardId);
        const createdCard = cards.find(card => card.id === cardId);

        expect(createdCard).toBeDefined();
        expect(createdCard.name).toBe(cardName);
        expect(createdCard.desc).toBe('Description from API');
    });

    test('create multiple cards via API', async ({ trelloAPI, testBoard }) => {
        const { listId, boardId } = testBoard;
        const cardsToCreate = ['API Card 1', 'API Card 2', 'API Card 3'];

        for (const cardName of cardsToCreate) {
            await trelloAPI.createCard(listId, cardName);
        }

        const cards = await trelloAPI.getCards(boardId);
        const createdCardNames = cards.map(card => card.name);

        expect(createdCardNames).toEqual(expect.arrayContaining(cardsToCreate));
    });

    test('delete card via API', async ({ trelloAPI, testBoard }) => {
        const { listId, boardId } = testBoard;

        const cardId = await trelloAPI.createCard(listId, 'Card to Delete');

        let cards = await trelloAPI.getCards(boardId);
        expect(cards.some(card => card.id === cardId)).toBe(true);
        await trelloAPI.deleteCard(cardId);
        cards = await trelloAPI.getCards(boardId);
        expect(cards.some(card => card.id === cardId)).toBe(false);
    });
});
