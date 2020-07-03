import reducer from './user';
import types from '../types';
import { UserStatus } from 'model/user';

const mockUser = {
    id: 1,
    firstName: "Admin",
    lastName: "Adminsson",
    tutorialPassed: false,
    email: "admin@test.com",
    subjects: [],
    status: UserStatus.Active
};

describe("user reducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {})).toStrictEqual({
            user: null,
            error: ""
        });
    });

    it("should handle GET_USER_SUCCESS", () => {
        const action = {
            type: types.GET_USER_SUCCESS,
            user: mockUser
        };

        const newState = reducer(undefined, action);
        
        expect(newState).toStrictEqual({ user: mockUser });
    });

    it("should handle GET_USER_FAILURE", () => {
        const mockError = "Mock error.";

        const action = {
            type: types.GET_USER_FAILURE,
            error: mockError
        };

        const newState = reducer(undefined, action);

        expect(newState).toStrictEqual({ error: mockError });
    });

    it("should handle LOGOUT_SUCCESS", () => {
        const initialState = {
            user: mockUser
        };

        const action = {
            type: types.LOGOUT_SUCCESS
        }

        const newState = reducer(initialState, action)

        expect(newState).toStrictEqual({ user: null });
    })
})