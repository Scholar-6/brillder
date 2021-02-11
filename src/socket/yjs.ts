import * as Y from "yjs";
import { History } from "history";

import { WebsocketProvider } from "y-websocket";

export const getYDoc = (history: History, brickId: number, firstName: string, lastName: string) => {
    const ydoc = new Y.Doc({ autoLoad: true });

    const wsProvider = new WebsocketProvider(process.env.REACT_APP_WEBSOCKET_HOST!, "brick" + brickId.toString(), ydoc);
    const normalOnMessage = wsProvider.ws!.onmessage;
    wsProvider.ws!.onmessage = function (this: WebSocket, ev) {
        console.log("received message", ev);
        try {
            const json = JSON.parse(ev.data);
            if(json.event === "new-brick") {
                window.location.href = `/build/brick/${json.brickId}/brick-title`;
            }
        } catch {
            normalOnMessage?.call(this, ev);
        }
    };

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

    const awareness = wsProvider.awareness;
    awareness.setLocalStateField("user", {
        name: `${firstName} ${lastName}`,
        color: "#C43C30",
    });
    awareness.on("change", (changes: any) => {
        console.log(Array.from(awareness.getStates().values()));
    })
    
    return { ydoc, awareness };
}