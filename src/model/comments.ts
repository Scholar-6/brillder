import { Brick } from "./brick";

export interface Author {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

export interface Comment {
    id: number;
    text: string;
    brick: Brick;
    author: Author;
    timestamp: Date;
}