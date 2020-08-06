import React from 'react';
import NewCommentPanel from './NewCommentPanel';
import { render, screen, fireEvent } from '@testing-library/react';
import { Brick } from 'model/brick';

const mockBrick: Brick = {
    id: 1
} as Brick;

describe("new comment panel", () => {
    it("should create a new comment with text", () => {
        const createComment = jest.fn();

        render(
            <NewCommentPanel currentQuestionId={1} currentBrick={mockBrick} createComment={createComment} />
        );

        const textField = screen.getByPlaceholderText(/add suggestion/i);
        expect(textField).toBeVisible();
        fireEvent.change(textField, { target: { value: "Test Comment" } });

        const postButton = screen.getByText(/post/i);
        expect(postButton).toBeVisible();
        fireEvent.click(postButton);

        expect(createComment).toBeCalledTimes(1);
        expect(createComment).toBeCalledWith({ text: "Test Comment", brickId: mockBrick.id, questionId: 1 });
    })
})