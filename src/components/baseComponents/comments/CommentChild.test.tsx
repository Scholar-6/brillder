import React from 'react';
import CommentChild from './CommentChild';
import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
import { render, screen } from '@testing-library/react';

const mockBrick: Brick = {
    id: 1
} as Brick;

const mockChild: Comment = {
    id: 2,
    author: {
        id: 2,
        email: "test2@test.com",
        firstName: "Forename",
        lastName: "Surname"
    },
    brick: mockBrick,
    text: "Test Reply",
    timestamp: new Date(2020, 7, 3, 13, 2)
} as Comment;

describe("comment child", () => {
    it("should display reply information", async () => {
        render(
            <CommentChild key={mockChild.id} comment={mockChild} currentBrick={mockBrick} isAuthor={false} />
        );

        const replyText = screen.getByText(mockChild.text);
        const authorText = `${mockChild.author.firstName} ${mockChild.author.lastName}`
        const replyAuthor = screen.getByText(authorText);
        const replyDate = screen.getByText("13:02 3 Aug");

        expect(replyText).toBeVisible();
        expect(replyAuthor).toBeVisible();
        expect(replyDate).toBeVisible();
    });
});