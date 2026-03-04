
export interface TrelloBoard {
    id: string;
    name: string;
    closed: boolean;
    url: string;
}

export interface TrelloList {
    id: string;
    name: string;
    idBoard: string;
    closed: boolean;
}

export interface TrelloCard {
    id: string;
    name: string;
    desc: string;
    idList: string;
    closed: boolean;
}