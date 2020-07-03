import io from "socket.io-client";
import createSocketIoMiddleware from "redux-socket.io";

export const socket = io(process.env.REACT_APP_BACKEND_HOST ?? "");
export const socketIoMiddleware = createSocketIoMiddleware(socket, ["socket/"]);