
export class TrelloAPI {
    
    private baseURL = 'https://api.trello.com/1';

    constructor(
        private apiKey: string,
        private apiToken: string
    ) { }

    async createBoard(name: string): Promise<string> {
        const params = new URLSearchParams({
            name: name,
            key: this.apiKey,
            token: this.apiToken
        });

        const response = await fetch(`${this.baseURL}/boards?${params}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to create board: ${response.statusText}`);
        }

        const board = await response.json();
        return board.id;
    }

    async getBoards(): Promise<any[]> {
        const response = await fetch(
            `${this.baseURL}/members/me/boards?key=${this.apiKey}&token=${this.apiToken}`
        );

        if (!response.ok) {
            throw new Error(`Failed to get boards: ${response.statusText}`);
        }

        return await response.json();
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
        const response = await fetch(
            `${this.baseURL}/boards/${boardId}?key=${this.apiKey}&token=${this.apiToken}`,
            { method: 'DELETE' }
        );

        if (!response.ok) {
            throw new Error(`Failed to delete board: ${response.statusText}`);
        }
    }
  async createList(boardId: string, listName: string): Promise<string> {
    const params = new URLSearchParams({
      name: listName,
      idBoard: boardId,
      key: this.apiKey,
      token: this.apiToken
    });

    const response = await fetch(`${this.baseURL}/lists?${params}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to create list: ${response.statusText}`);
    }

    const list = await response.json();
    return list.id;
  }
    // get all lists on a board
    async getLists(boardId: string): Promise<any[]> {
        const response = await fetch(
            `${this.baseURL}/boards/${boardId}/lists?key=${this.apiKey}&token=${this.apiToken}`
        );
        return await response.json();
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

        const response = await fetch(`${this.baseURL}/cards?${params}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to create card: ${response.statusText}`);
        }

        const card = await response.json();
        return card.id;
    }

    // get all cards on a board
    async getCards(boardId: string): Promise<any[]> {
        const response = await fetch(
            `${this.baseURL}/boards/${boardId}/cards?key=${this.apiKey}&token=${this.apiToken}`
        );
        return await response.json();
    }

    // delete a card by ID
    async deleteCard(cardId: string): Promise<void> {
        await fetch(
            `${this.baseURL}/cards/${cardId}?key=${this.apiKey}&token=${this.apiToken}`,
            { method: 'DELETE' }
        );
    }
}