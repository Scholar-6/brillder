import { Action } from 'redux';

export const socketLogin = (userId: number) => {
    return {
        type: "socket/USER_LOGIN",
        userId
    } as Action;
};

export const socketLogout = () => {
    return {
        type: "socket/USER_LOGOUT"
    } as Action;
};

export const socketStartEditing = (brickId: number, questionId?: number) => {
    return {
        type: "socket/START_EDITING",
        brickId,
        questionId
    } as Action;
};