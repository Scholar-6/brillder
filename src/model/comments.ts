import { Brick } from "./brick";
import { Question } from "./question";

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
    question?: Question;
    children: Comment[];
    author: Author;
    timestamp: Date;
}