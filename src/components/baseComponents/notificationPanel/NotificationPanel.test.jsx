import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationPanel from './NotificationPanel';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import { NotificationType } from 'model/notifications';

const middlewares = [ thunkMiddleware ];
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
        const store = mockStore({
            notifications: {
                notifications: [ mockNotification ]
            }
        });

        render(
            <Provider store={store}>
                <NotificationPanel
                    shown={true}
                    handleClose={() => {}}/>
            </Provider>
        );

        const title = screen.queryByText(mockNotification.title);
        const text = screen.queryByText(mockNotification.text);

        expect(title).toBeVisible();
        expect(text).toBeVisible();
    });

    it("should display placeholder text if there are no notifications", () => {
        const store = mockStore({ notifications: [] });

        render(
            <Provider store={store}>
                <NotificationPanel 
                    shown={true}
                    handleClose={() => {}}/>
            </Provider>
        );

        const placeholderText = screen.queryByText("Looks like you don't have any notifications...");
        expect(placeholderText).toBeVisible();
    });

    it("should not display 'clear all' when there are no notifications", () => {
        const store = mockStore({ notifications: [] });

        render(
            <Provider store={store}>
                <NotificationPanel 
                    shown={true}
                    handleClose={() => {}}/>
            </Provider>
        );
        
        const clearAll = screen.queryByText("Clear All");
        expect(clearAll).toBeFalsy();
    })
})