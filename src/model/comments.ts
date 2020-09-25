import { Brick } from "./brick";
import { Question } from "./question";
import { User } from "./user";

export interface Author {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
}

export interface Comment {
    id: number;
    text: string;
    brick: Brick;
    question?: Question;
    children: Comment[];
    author: Author;
    timestamp: Date;
    readBy: User[];
}