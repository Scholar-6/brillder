import types from '../types';
import { Notification } from 'model/notifications';

export interface NotificationsState {
    notifications: Notification[] | null;
    latestNotificationShown: boolean;
    error: string;
}

const NotificationsInitialState: NotificationsState = {
    notifications: null,
    latestNotificationShown: false,
    error: ""
};

export default (state = NotificationsInitialState, action: any) => {
    switch (action.type) {
        case types.GET_NOTIFICATIONS_SUCCESS:
            return {
                notifications: action.notifications,
                latestNotificationShown:
                    action.notifications.length > 0 && // if there is at least one notification
                    Date.now() - new Date(action.notifications[0].timestamp).valueOf() < 300000 // and the newest one is newer than 5 minutes.
            } as NotificationsState;
        case types.GET_NOTIFICATIONS_FAILURE:
            return { error: action.error } as NotificationsState;
        case types.RECEIVED_NOTIFICATION:
            return {
                notifications: [ action.notification, ...(state.notifications ?? []) ],
                latestNotificationShown: true
            } as NotificationsState;
        case types.NOTIFICATION_LATEST_DISMISSED:
            return {
                ...state,
                latestNotificationShown: false
            }
        case types.NOTIFICATION_CLEAR:
            return {
            // eslint-disable-next-line
                notifications: state.notifications?.filter(notification => notification.id != action.notificationId)
            };
        case types.NOTIFICATION_CLEAR_ALL:
            return { notifications: [] };
        case types.NOTIFICATION_RESET:
            return { notifications: undefined };
        case types.NOTIFICATION_CHANGED:
            return { notifications: [
                ...(state.notifications ?? []).filter(notification => notification.id !== action.notification.id),
                action.notification
            ] }
        default: return state;
    }
}