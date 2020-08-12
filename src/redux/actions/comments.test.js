import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import comments from './comments';
import mockAxios from 'axios';
import types from '../types';

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

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

describe("comment actions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns the correct action on a successful GET", async () => {
        const store = mockStore({ comments: null, error: "" });

        const expectedAction = {
            type: types.GET_COMMENTS_SUCCESS,
            comments: [ mockComment ]
        };

        mockAxios.get.mockResolvedValue({ data: [ mockComment ] });
        await store.dispatch(comments.getComments(1));

        expect(store.getActions()).toContainEqual(expectedAction);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    it("returns the correct action on a failed GET", async () => {
        const store = mockStore({ comments: null, error: "" });

        const expectedAction = {
            type: types.GET_COMMENTS_FAILURE,
            error: "Mock error."
        };

        mockAxios.get.mockRejectedValue({ message: "Mock error." });
        await store.dispatch(comments.getComments(1));

        expect(store.getActions()).toContainEqual(expectedAction);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    it("returns the correct action on a successful new comment", async () => {
        const store = mockStore({ comments: [], error: "" });

        const expectedAction = {
            type: types.CREATE_COMMENT_SUCCESS,
            newComment: mockComment
        };

        mockAxios.post.mockResolvedValue({ data: mockComment });
        await store.dispatch(comments.createComment({ ...mockComment, id: undefined }));

        expect(store.getActions()).toContainEqual(expectedAction);
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
    });

    it("returns the correct action on a failed new comment", async () => {
        const store = mockStore({ comments: [], error: "" });

        const expectedAction = {
            type: types.CREATE_COMMENT_FAILURE,
            error: "Mock Error."
        };

        mockAxios.post.mockRejectedValue({ message: expectedAction.error });
        await store.dispatch(comments.createComment({ ...mockComment, id: undefined }));

        expect(store.getActions()).toContainEqual(expectedAction);
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
    })

    it("returns the correct action on an edit request", () => {
        const store = mockStore({ comments: [mockComment], error: "" });

        const expectedAction = {
            type: types.EDIT_COMMENT,
            commentId: 1,
            newText: "New Comment Text"
        };

        store.dispatch(comments.editComment(1, "New Comment Text"));

        expect(store.getActions()).toContainEqual(expectedAction);
    });
})