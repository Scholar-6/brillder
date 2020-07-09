import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import notifications from './notifications';
import { NotificationType } from 'model/notifications';
import mockAxios from 'axios';
import types from '../types';

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

const mockNotification = {
    id: 1,
    sender: {
        email: "admin@test.com",
        firstName: "Admin",
        lastName: "User"
    },
    title: "Notification Title",
    text: "Notification Text",
    type: NotificationType.Generic,
    read: false,
    timestamp: new Date(0)
};

describe("notification actions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns the correct action on a successful GET", async () => {
        const store = mockStore({ notifications: null, error: "" });

        const expectedAction = {
            type: types.GET_NOTIFICATIONS_SUCCESS,
            notifications: [ mockNotification ]
        };

        mockAxios.get.mockResolvedValue({ data: [ mockNotification ] });
        await store.dispatch(notifications.getNotifications());

        expect(store.getActions()).toContainEqual(expectedAction);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    it("returns the correct action on a failed GET", async () => {
        const store = mockStore({ notifications: null, error: "" });

        const expectedAction = {
            type: types.GET_NOTIFICATIONS_FAILURE,
            error: "Mock error."
        };

        mockAxios.get.mockRejectedValue({ message: "Mock error." });
        await store.dispatch(notifications.getNotifications());

        expect(store.getActions()).toContainEqual(expectedAction);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });
})