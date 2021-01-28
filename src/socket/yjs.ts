import * as Y from "yjs";

import { WebsocketProvider } from "y-websocket";

export const getYDoc = (brickId: number) => {
    const ydoc = new Y.Doc({ autoLoad: true });

    const wsProvider = new WebsocketProvider(process.env.REACT_APP_WEBSOCKET_HOST!, "brick" + brickId.toString(), ydoc);

    ydoc.on("subdocs", ({added, removed, loaded}: {
        added: Set<Y.Doc>,
        removed: Set<Y.Doc>,
        loaded: Set<Y.Doc>
    }) => {
        loaded.forEach(subdoc => {
            new WebsocketProvider(process.env.REACT_APP_WEBSOCKET_HOST!, subdoc.guid, subdoc);
        });
    });

    ydoc.getMap("brick").observe((val) => {
        // console.log(ydoc.toJSON());
    });
    
    return ydoc;
}