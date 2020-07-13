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
})