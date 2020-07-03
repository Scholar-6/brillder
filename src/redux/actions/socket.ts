import { Action } from 'redux';

// actions to be sent to the socket.io server.

export const socketLogin = (userId: number) => {
    return {
        type: "socket/USER_LOGIN",
        userId
    } as Action;
}

export const socketLogout = () => {
    return {
        type: "socket/USER_LOGOUT"
    }
}