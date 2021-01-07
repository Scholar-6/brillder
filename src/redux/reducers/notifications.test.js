import reducer from './notifications';
import types from '../types';
import { NotificationType } from 'model/notifications';

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

describe("notifications reducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {})).toStrictEqual({
            notifications: null,
            latestNotificationShown: false,
            error: ""
        });
    });

    it("should handle GET_NOTIFICATIONS_SUCCESS", () => {
        const action = {
            type: types.GET_NOTIFICATIONS_SUCCESS,
            notifications: [ mockNotification ]
        };

        const newState = reducer(undefined, action);
        expect(newState).toStrictEqual({ notifications: [ mockNotification ], latestNotificationShown: false })
    });

    it("should handle GET_NOTIFICATIONS_FAILURE", () => {
        const action = {
            type: types.GET_NOTIFICATIONS_FAILURE,
            error: "Mock error."
        };

        const newState = reducer(undefined, action);
        expect(newState).toStrictEqual({ error: "Mock error." });
    });

    it("should handle RECEIVED_NOTIFICATION", () => {
        const initialState = {
            notifications: []
        };

        const action = {
            type: types.RECEIVED_NOTIFICATION,
            notification: mockNotification
        };

        const newState = reducer(initialState, action);
        expect(newState).toStrictEqual({ notifications: [ mockNotification ], latestNotificationShown: true })
    });

    it("should handle NOTIFICATION_CLEAR", () => {
        const initialState = {
            notifications: [ mockNotification ]
        };

        const action = {
            type: types.NOTIFICATION_CLEAR,
            notificationId: mockNotification.id
        };

        const newState = reducer(initialState, action);
        expect(newState).toStrictEqual({ notifications: [] });
    });

    it("should handle NOTIFICATION_CLEAR_ALL", () => {
        const initialState = {
            notifications: [ mockNotification ]
        };

        const action = {
            type: types.NOTIFICATION_CLEAR_ALL
        };

        const newState = reducer(initialState, action);
        expect(newState).toStrictEqual({ notifications: [] });
    });

    it("should handle NOTIFICATION_CHANGED", () => {
        const initialState = {
            notifications: [ mockNotification ]
        };

        const action = {
            type: types.NOTIFICATION_CHANGED,
            notification: { ...mockNotification, title: "Changed Title" }
        };

        const newState = reducer(initialState, action);
        expect(newState.notifications).toStrictEqual([ action.notification ]);
    })
})