import { TrelloBoard, TrelloCard, TrelloList } from "./types";

export class TrelloAPI {

    private baseURL = 'https://api.trello.com/1';

    constructor(
        private apiKey: string,
        private apiToken: string
    ) { }

    private request<T>(url: string, options?: RequestInit): Promise<T> {
        return fetch(url, options).then(async (response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            return response.json() as T;
        });
    }

    async createBoard(name: string): Promise<string> {
        const params = new URLSearchParams({
            name: name,
            key: this.apiKey,
            token: this.apiToken
        });

        const board = await this.request<TrelloBoard>(`${this.baseURL}/boards?${params}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        });
        return board.id;
    }

    async getBoards(): Promise<TrelloBoard[]> {
        return this.request<TrelloBoard[]>(`${this.baseURL}/members/me/boards?key=${this.apiKey}&token=${this.apiToken}`);
    }

    async getBoardByName(boardName: string): Promise<string> {
        const boards = await this.getBoards();
        const board = boards.find(b => b.name === boardName);

        if (!board) {
            throw new Error(`Board "${boardName}" not found`);
        }

        return board.id;
    }

    async deleteBoard(boardId: string): Promise<void> {
        return this.request<void>(`${this.baseURL}/boards/${boardId}?key=${this.apiKey}&token=${this.apiToken}`, { method: 'DELETE' });
    }

    async createList(boardId: string, listName: string): Promise<string> {
        const params = new URLSearchParams({
            name: listName,
            idBoard: boardId,
            key: this.apiKey,
            token: this.apiToken
        });
        const list = await this.request<TrelloList>(`${this.baseURL}/lists?${params}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        });
        return list.id;
    }
    // get all lists on a board
    async getLists(boardId: string): Promise<TrelloList[]> {
        return this.request<TrelloList[]>(`${this.baseURL}/boards/${boardId}/lists?key=${this.apiKey}&token=${this.apiToken}`);
    }

    // get list by name
    async getListByName(boardId: string, listName: string): Promise<string> {
        const lists = await this.getLists(boardId);
        const list = lists.find(l => l.name === listName);
        if (!list) {
            throw new Error(`List "${listName}" not found in board ${boardId}`);
        }
        return list.id;
    }

    // create a card in a list via API
    async createCard(listId: string, cardName: string, description?: string): Promise<string> {
        const params = new URLSearchParams({
            name: cardName,
            idList: listId,
            key: this.apiKey,
            token: this.apiToken
        });

        if (description) {
            params.append('desc', description);
        }
        const card = await this.request<TrelloCard>(`${this.baseURL}/cards?${params}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        });
        return card.id;
    }

    // get all cards on a board
    async getCards(boardId: string): Promise<TrelloCard[]> {

        return this.request<TrelloCard[]>(`${this.baseURL}/boards/${boardId}/cards?key=${this.apiKey}&token=${this.apiToken}`);
    }

    // delete a card by ID
    async deleteCard(cardId: string): Promise<void> {
        return this.request<void>(`${this.baseURL}/cards/${cardId}?key=${this.apiKey}&token=${this.apiToken}`, 
            { method: 'DELETE' });
    }

    // get card by name from a board
    async getCardByName(boardId: string, cardName: string): Promise<string | null> {
        const cards = await this.getCards(boardId);
        const card = cards.find(c => c.name === cardName);
        return card?.id || null;
    }

    // delete card by name from a board
    async deleteCardByName(boardId: string, cardName: string): Promise<void> {
        const cardId = await this.getCardByName(boardId, cardName);
        if (cardId) {
            await this.deleteCard(cardId);
        }
    }
}