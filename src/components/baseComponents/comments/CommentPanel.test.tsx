import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import CommentPanel from './CommentPanel';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import { Comment, CommentLocation } from 'model/comments';
import { Brick } from 'model/brick';

import CommentItem from './CommentItem';
jest.mock('./CommentItem');
const MockCommentItem = CommentItem as jest.MockedFunction<typeof CommentItem>;

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

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
    timestamp: new Date(2020, 8, 2),
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

describe("comments panel", () => {
    it("should display a list of comments", () => {
        const store = mockStore({
            comments: {
                comments: [mockComment]
            },
            brick: {
                brick: mockBrick
            },
            user: {
                user: { id: 1 }
            }
        });

        MockCommentItem.mockImplementation(props => {
            expect(props.comment).toStrictEqual(mockComment);
            expect(props.currentBrick).toStrictEqual(mockBrick);
            return <></>;
        });

        render(
            <Provider store={store}>
                <CommentPanel currentLocation={CommentLocation.Brief} currentBrick={mockBrick} />
            </Provider>
        );
    });
});