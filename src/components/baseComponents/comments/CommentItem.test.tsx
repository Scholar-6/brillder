import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import CommentItem from './CommentItem';
import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
import { User } from 'model/user';

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

const mockComment: Comment = {
  id: 1,
  author: {
    id: 1,
    email: "test@test.com",
    firstName: "Firstname",
    lastName: "Lastname"
  },
  brick: mockBrick,
  text: "23453",
  timestamp: new Date(2020, 3, 28, 16, 10),
  children: [ mockChild ]
} as Comment;

describe('comment item', () => {
  afterEach(cleanup);

  it('should display parent comment data', () => {
    const createComment = jest.fn();

    render(
      <CommentItem currentUser={{} as User} comment={mockComment} createComment={createComment} isAuthor={false} currentBrick={mockBrick} />
    );

    const commentText = screen.queryByText(mockComment.text);
    const commentAuthor = screen.queryByText(`${mockComment.author.firstName} ${mockComment.author.lastName}`);
    const commentDate = screen.queryByText("16:10 28 Apr"); // test based on designs given.

    expect(commentText).toBeVisible();
    expect(commentAuthor).toBeVisible();
    expect(commentDate).toBeVisible();
  });

  it("should display a comment's children", async () => {
    const createComment = jest.fn();
    const MockCommentChild = jest.fn().mockImplementation(
      props => {
        expect(props).toStrictEqual({
          comment: mockChild,
          currentBrick: mockBrick,
          isAuthor: false
        })
        return <p>Child</p>
      }
    );

    render(
      <CommentItem currentUser={{} as User} comment={mockComment} createComment={createComment} isAuthor={false} currentBrick={mockBrick}>
        {[<MockCommentChild key={mockChild.id} comment={mockChild} currentBrick={mockBrick} isAuthor={false} />]}
      </CommentItem>
    );
    
    expect(MockCommentChild).toBeCalledTimes(1);
  });

  it("should display the reply and delete buttons if author", () => {
    const createComment = jest.fn();

    render(
      <CommentItem
        currentUser={{} as User}
        comment={mockComment}
        createComment={createComment}
        isAuthor={true}
        currentBrick={mockBrick}
      />
    );

    const replyButton = screen.getByLabelText(/reply/i);
    const deleteButton = screen.getByLabelText(/delete/i);

    expect(replyButton).toBeVisible();
    expect(deleteButton).toBeVisible();
  });
});