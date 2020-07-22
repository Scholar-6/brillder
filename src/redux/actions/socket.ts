import { Action } from 'redux';
import { Brick } from 'model/brick';

// actions to be sent to the socket.io server.

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

export const socketStartEditing = (brickId: number) => {
    return {
        type: "socket/START_EDITING",
        brickId
    } as Action;
};

export const socketStopEditing = () => {
    return {
        type: "socket/STOP_EDITING"
    } as Action;
};

export const socketUpdateBrick = (brick: Brick) => {
    return {
        type: "socket/UPDATE_BRICK",
        brick
    } as Action;
};