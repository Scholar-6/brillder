import * as Y from "yjs";
import { History } from "history";

import { WebsocketProvider } from "y-websocket";
import * as encoding from "lib0/encoding.js";
import * as syncProtocol from "y-protocols/sync.js";

export const getYDoc = (history: History, brickId: number, firstName: string, lastName: string) => {
    const ydoc = new Y.Doc({ autoLoad: true });

    const wsProvider = new WebsocketProvider(process.env.REACT_APP_WEBSOCKET_HOST!, "brick" + brickId.toString(), ydoc);
    const normalOnMessage = wsProvider.ws!.onmessage;
    wsProvider.ws!.onmessage = function (this: WebSocket, ev) {
        try {
            const json = JSON.parse(ev.data);
            if(json.event === "new-brick") {
                window.location.href = `/build/brick/${json.brickId}/subject`;
            }
        } catch {
            // the event isn't JSON, so just call the usual event handler
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

    const awareness = wsProvider.awareness;
    awareness.setLocalStateField("user", {
        name: `${firstName} ${lastName}`,
        color: "#C43C30",
    });
    awareness.on("change", (changes: any) => {
        console.log(Array.from(awareness.getStates().values()));
    });

    // sync the document 100ms after initialization.
    // this gives it enough time to load from the database.
    // a bit of a hack, but I couldn't find any other way to force it to sync.
    setTimeout(() => {
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, 0)
        syncProtocol.writeSyncStep1(encoder, ydoc)
        wsProvider.ws!.send(encoding.toUint8Array(encoder))
    }, 100);
    
    return { ydoc, awareness };
}