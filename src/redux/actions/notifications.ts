import axios from 'axios';
import { Action, Dispatch } from 'redux';

import types from '../types';

const getNotificationsSuccess = (notifications: any) => {
    return {
        type: types.GET_NOTIFICATIONS_SUCCESS,
        notifications
    } as Action;
}

const getNotificationsFailure = (errorMessage: string) => {
    return {
        type: types.GET_NOTIFICATIONS_FAILURE,
        error: errorMessage
    } as Action;
}

const getNotifications = () => {
    return function (dispatch: Dispatch) {
        return axios.get(
            `${process.env.REACT_APP_BACKEND_HOST}/notifications/unread`,
            { withCredentials:true }
        ).then(response => {
            const {data} = response;
            dispatch(getNotificationsSuccess(data));
        }).catch(error => {
            dispatch(getNotificationsFailure(error.message));
        });
    }
}

export default { getNotifications }