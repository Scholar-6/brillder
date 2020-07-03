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
            return { notifications: [ ...(state.notifications ?? []), action.notification ] } as NotificationsState;
        case types.NOTIFICATION_CLEAR:
            return {
                notifications: state.notifications?.filter(notification => notification.id != action.notificationId)
            };
        case types.NOTIFICATION_CLEAR_ALL:
            return { notifications: [] };
        default: return state;
    }
}