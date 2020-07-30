import reducer from './comments';
import types from '../types';

const mockComment = {
    id: 1,
    author: {
        email: "admin@test.com",
        firstName: "Admin",
        lastName: "User"
    },
    text: "Comment Text",
    timestamp: new Date(0)
};

describe("comments reducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {})).toStrictEqual({
            comments: null,
            mostRecentComment: null,
            error: ""
        });
    });

    it("should handle GET_COMMENTS_SUCCESS", () => {
        const action = {
            type: types.GET_COMMENTS_SUCCESS,
            comments: [ mockComment ]
        };

        const newState = reducer(undefined, action);
        expect(newState).toStrictEqual({ comments: [ mockComment ] })
    });

    it("should handle GET_COMMENTS_FAILURE", () => {
        const action = {
            type: types.GET_COMMENTS_FAILURE,
            error: "Mock error."
        };

        const newState = reducer(undefined, action);
        expect(newState).toStrictEqual({ error: "Mock error." });
    });

    it("should handle CREATE_COMMENT_SUCCESS", () => {
        const initialState = {
            comments: [mockComment]
        };

        const newComment = { ...mockComment, id: 2 }

        const action = {
            type: types.CREATE_COMMENT_SUCCESS,
            newComment
        };

        const newState = reducer(initialState, action);
        expect(newState.comments).toContainEqual(mockComment);
        expect(newState.comments).toContainEqual(newComment);
        expect(newState.mostRecentComment).toStrictEqual(newComment);
    });

    it("should handle CREATE_COMMENT_FAILURE", () => {
        const initialState = {
            comments: [mockComment],
            error: ""
        };

        const action = {
            type: types.CREATE_COMMENT_FAILURE,
            error: "Mock Error."
        };

        const newState = reducer(initialState, action);
        expect(newState.comments).toContainEqual(mockComment);
        expect(newState.error).toStrictEqual("Mock Error.");
    })

    it("should handle EDIT_COMMENT", () => {
        const initialState = {
            comments: [mockComment, { ...mockComment, id: 2 }]
        };

        const action = {
            type: types.EDIT_COMMENT,
            commentId: 1,
            newText: "New Comment Text"
        };

        const newState = reducer(initialState, action);
        expect(newState.comments).toContainEqual({ ...mockComment, text: "New Comment Text" });
        expect(newState.comments).toContainEqual({ ...mockComment, id: 2 });
    })

    it("should handle NEW_COMMENT", () => {
        const initialState = {
            comments: [ mockComment ]
        };

        const action = {
            type: types.NEW_COMMENT,
            comment: { ...mockComment, id: 2 }
        };

        const newState = reducer(initialState, action);

        expect(newState.comments).toContainEqual(mockComment);
        expect(newState.comments).toContainEqual({ ...mockComment, id: 2 });
    });

    it("should handle NEW_COMMENT with a child comment", () => {
        const initialState = {
            comments: [ mockComment ]
        };

        const action = {
            type: types.NEW_COMMENT,
            comment: { ...mockComment, id: 2, parent: mockComment }
        };

        const newState = reducer(initialState, action);

        const originalComment = newState.comments.find(
            comment => comment.id === mockComment.id
        );
        expect(originalComment).toBeDefined();
        expect(originalComment.children).toContainEqual({ ...action.comment, parent: undefined });
    })
})