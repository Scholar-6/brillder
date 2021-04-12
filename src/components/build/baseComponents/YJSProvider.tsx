import React from "react";
import { getYDoc } from "socket/yjs";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { toRenderJSON } from "services/SharedTypeService";

interface YJSProviderProps extends React.PropsWithChildren<any> {
    brickId: number;
    user: User;
}

interface YJSContext {
    ydoc: Y.Doc;
    awareness?: Awareness;
    json: any;
    undoManager?: Y.UndoManager;
}
export const YJSContext = React.createContext<YJSContext | null>(null);

const YJSProvider: React.FC<YJSProviderProps> = props => {
    const [ydoc, setYdoc] = React.useState<Y.Doc>();
    const [awareness, setAwareness] = React.useState<Awareness>();
    const [undoManager, setUndoManager] = React.useState<Y.UndoManager>();
    const history = useHistory();
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);

    const handleQuestionChange = React.useCallback((evt: Y.YEvent[]) => {
        try {
            const res = toRenderJSON(evt);
            //!! this check if very important and delicate could couse to infinity loading of build page !!
            if ((res[0].keysChanged.has("created") || res[0].keysChanged.has("id")) === false) {
                return;
            }
        } catch { }
        console.log('force update 1')
        forceUpdate();
    /*eslint-disable-next-line*/
    }, [ydoc]);

    React.useEffect(() => {
        const { ydoc: newYDoc, awareness: newAwareness } = getYDoc(history, props.brickId, props.user.firstName, props.user.lastName);
        newYDoc.getMap("brick").observeDeep((evt) => {
            try {
                const res = toRenderJSON(evt);
                //!! this check if very important and delicate could couse to infinity loading of build page !!
                if ((res[0].keysChanged.has("created") || res[0].keysChanged.has("id")) === false) {
                    return;
                }
            } catch { }
            console.log('force update 2')
            forceUpdate();
        });

        newYDoc.on("subdocs", ({ added, removed, loaded }: {
            added: Set<Y.Doc>,
            removed: Set<Y.Doc>,
            loaded: Set<Y.Doc>
        }) => {
            added.forEach((q) => {
                q.getMap().observeDeep(handleQuestionChange);
                if(!q.meta) q.meta = {};
                q.meta.undoManager = new Y.UndoManager(q.getMap(), { captureTimeout: 200 });
            })
        });

        const newUndoManager = new Y.UndoManager(newYDoc.getMap("brick"), { captureTimeout: 200, trackedOrigins: new Set([null]) });

        setYdoc(newYDoc);
        setAwareness(newAwareness);
        setUndoManager(newUndoManager);

        // newAwareness.on("update", () => console.log(newAwareness.getStates()));
    /*eslint-disable-next-line*/
    }, [props.brickId]);

    return (
        <YJSContext.Provider value={ydoc ? {
            ydoc,
            json: ydoc.toJSON(),
            awareness,
            undoManager,
        } : null}>
            {props.children}
        </YJSContext.Provider>
    );
};

const mapState = (state: ReduxCombinedState) => ({
    user: state.user.user,
});

export default connect(mapState)(YJSProvider);