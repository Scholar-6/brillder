import React from 'react';
import ReplyCommentPanel from './ReplyCommentPanel';
import { render, screen, fireEvent } from '@testing-library/react';
import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
import { Question } from 'model/question';

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
  question: { id: 1 } as Question,
  text: "Test Comment",
  timestamp: new Date(2020, 8, 2),
  children: [ ]
} as Comment;

describe("reply comment panel", () => {
  it("should create a new reply with text", () => {
    const createComment = jest.fn();
      
    render(
      <ReplyCommentPanel
        parentComment={mockComment}
        currentBrick={mockBrick}
        collapsePanel={() => {}}
        createComment={createComment}
        currentQuestionId={mockComment.question?.id}
      />
    );

    const textField = screen.getByPlaceholderText(/add reply/i);
    expect(textField).toBeVisible();
    fireEvent.change(textField, { target: { value: "Test Reply" } });

    const postButton = screen.getByText(/post/i);
    expect(postButton).toBeVisible();
    fireEvent.click(postButton);

    expect(createComment).toBeCalledTimes(1);
    expect(createComment).toBeCalledWith({
      text: "Test Reply",
      brickId: mockBrick.id,
      parentId: mockComment.id,
      questionId: mockComment.question?.id
    });
  })
})