import types from '../types';
import { Notification } from 'model/notifications';

export interface NotificationsState {
    notifications: Notification[] | null;
    error: string;
}

const NotificationsInitialState: NotificationsState = {
    notifications: null,
    error: ""
};

export default (state = NotificationsInitialState, action: any) => {
    switch (action.type) {
        case types.GET_NOTIFICATIONS_SUCCESS:
            return { notifications: action.notifications } as NotificationsState;
        case types.GET_NOTIFICATIONS_FAILURE:
            return { error: action.error } as NotificationsState;
        case types.RECEIVED_NOTIFICATION:
            return { notifications: [ action.notification, ...(state.notifications ?? []) ] } as NotificationsState;
        case types.NOTIFICATION_CLEAR:
            return {
            // eslint-disable-next-line
                notifications: state.notifications?.filter(notification => notification.id != action.notificationId)
            };
        case types.NOTIFICATION_CLEAR_ALL:
            return { notifications: [] };
        case types.NOTIFICATION_CHANGED:
            return { notifications: [
                ...(state.notifications ?? []).filter(notification => notification.id !== action.notification.id),
                action.notification
            ] }
        default: return state;
    }
}