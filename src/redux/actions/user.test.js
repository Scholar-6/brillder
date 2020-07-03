import configureMockStore from 'redux-mock-store';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import user from './user';
import mockAxios from 'axios';
import { UserStatus } from 'model/user';
import types from 'redux/types';

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

describe('user actions', () => {
    it("returns the correct action on a successful GET", async () => {
        const store = mockStore({ user: {} });

        const mockUser = {
            id: 1,
            firstName: "Admin",
            lastName: "Adminsson",
            tutorialPassed: false,
            email: "admin@test.com",
            subjects: [],
            status: UserStatus.Active
        };
        const expectedActions = [
            { type: types.GET_USER_SUCCESS, user: mockUser }
        ];

        mockAxios.get.mockResolvedValue({ data: mockUser });
        
        await store.dispatch(user.getUser());

        expect(store.getActions()).toStrictEqual(expectedActions);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });
})