import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import CommentItem from './CommentItem';
import { Comment } from 'model/comments';
import { Brick } from 'model/brick';

const mockBrick: Brick = {
    id: 1
} as Brick;

const mockComment: Comment = {
    id: 1,
    author: {
        id: 1,
        email: "test@test.com",
        firstName: "Firstname",
        lastName: "Lastname"
    },
    brick: mockBrick,
    text: "Test Comment",
    timestamp: new Date(2020, 3, 28, 16, 10),
    children: [
        {
            id: 2,
            author: {
                id: 2,
                email: "test2@test.com",
                firstName: "Forename",
                lastName: "Surname"
            },
            brick: mockBrick,
            text: "Test Reply",
            timestamp: new Date(2020, 8, 3)
        }
    ]
} as Comment;

describe('comment item', () => {
    it('should display parent comment data', () => {
        const createComment = jest.fn();

        render(
            <CommentItem comment={mockComment} createComment={createComment} />
        );

        const commentText = screen.queryByText(mockComment.text);
        const commentAuthor = screen.queryByText(`${mockComment.author.firstName} ${mockComment.author.lastName}`);
        const commentDate = screen.queryByText("16:10 28 Apr"); // test based on designs given.

        expect(commentText).toBeVisible();
        expect(commentAuthor).toBeVisible();
        expect(commentDate).toBeVisible();
    })
});