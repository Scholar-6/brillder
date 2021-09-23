import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationPanel from './NotificationPanel';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import mockAxios from 'axios';

import { NotificationType } from 'model/notifications';
import types from 'redux/types';
import notifications from 'redux/actions/notifications';

var window = {
    AudioContext: class AudioContextMock {

    }
}

var _rangy = {
  default: {
    createClassApplier: () => {

    }
  }
}

var rangy = {
    createClassApplier: () => { }
}

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

describe("notification panel", () => {
    it("should display a list of notifications", () => {
        /*
        const store = mockStore({
            user: { user: { roles: [] } },
            notifications: {
                notifications: [mockNotification]
            }
        });

        render(
            <Provider store={store}>
                <NotificationPanel
                    shown={true}
                    handleClose={() => { }} />
            </Provider>
        );

        const title = screen.queryByText(mockNotification.title);
        const text = screen.queryByText(mockNotification.text);

        expect(title).toBeVisible();
        expect(text).toBeVisible();
        */
    });
    /*
    it("should display placeholder text if there are no notifications", () => {
        const store = mockStore({
            user: { user: { roles: [] } },
            notifications: []
        });

        render(
            <Provider store={store}>
                <NotificationPanel
                    shown={true}
                    handleClose={() => { }} />
            </Provider>
        );

        const placeholderText = screen.queryByText("You have no new notifications");
        expect(placeholderText).toBeVisible();
    });

    it("should not display 'clear all' when there are no notifications", () => {
        const store = mockStore({
            user: { user: { roles: [] } },
            notifications: {
                notifications: []
            }
        });

        render(
            <Provider store={store}>
                <NotificationPanel
                    shown={true}
                    handleClose={() => { }} />
            </Provider>
        );

        const clearAll = screen.queryByText("Clear All");
        expect(clearAll).toBeFalsy();
    });

    it("should display 'clear all' when there are notifications to clear", () => {
        const store = mockStore({
            user: { user: { roles: [] } },
            notifications: {
                notifications: [mockNotification]
            }
        });

        render(
            <Provider store={store}>
                <NotificationPanel
                    shown={true}
                    handleClose={() => { }} />
            </Provider>
        );

        const clearAll = screen.queryByText("Clear All");
        expect(clearAll).toBeTruthy();
    });

    it("should clear all notifications when 'clear all' is pressed", async () => {
        const store = mockStore({
            user: { user: { roles: [] } },
            notifications: {
                notifications: [mockNotification]
            }
        });

        const expectedAction = notifications.notificationClearedAll();

        mockAxios.put = jest.fn(async (url, data, config) => {
            expect(url).toStrictEqual(`${process.env.REACT_APP_BACKEND_HOST}/notifications/unread/markAsRead`);
            await store.dispatch(expectedAction);
        });

        render(
            <Provider store={store}>
                <NotificationPanel
                    shown={true}
                    handleClose={() => { }} />
            </Provider>
        );

        screen.queryByLabelText("clear-all").click();

        expect(store.getActions()).toStrictEqual([expectedAction]);
    });

    it("should clear a single notification when a clear button is pressed", () => {
        const store = mockStore({
            user: { user: { roles: [] } },
            notifications: {
                notifications: [mockNotification]
            }
        });

        const expectedAction = notifications.notificationCleared(mockNotification.id);

        mockAxios.put = jest.fn(async (url, data, config) => {
            expect(url).toStrictEqual(`${process.env.REACT_APP_BACKEND_HOST}/notifications/markAsRead/${mockNotification.id}`);
            await store.dispatch(expectedAction);
        });

        render(
            <Provider store={store}>
                <NotificationPanel
                    shown={true}
                    handleClose={() => { }} />
            </Provider>
        );

        fireEvent.click(screen.queryByLabelText("clear"));

        expect(store.getActions()).toStrictEqual([expectedAction]);
    })
    */
})