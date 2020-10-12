import React from 'react';
import io from "socket.io-client";
import createSocketIoMiddleware from "redux-socket.io";

export const socket = io(process.env.REACT_APP_BACKEND_HOST ?? "");
export const socketIoMiddleware = createSocketIoMiddleware(socket, ["socket/"]);

export const useSocket = (evt: string, callback: any) => {
    React.useEffect(() => {
        socket.on(evt, callback);

        return () => {
            socket.off(evt, callback);
        }
    }, [evt, callback]);

    return socket;
}