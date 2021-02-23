import React from "react";
import { getYDoc } from "socket/yjs";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

interface YJSProviderProps extends React.PropsWithChildren<any> {
    brickId: number;
    user: User;
}

interface YJSContext {
    ydoc: Y.Doc;
    awareness?: Awareness;
    json: any;
}
export const YJSContext = React.createContext<YJSContext | null>(null);

const YJSProvider: React.FC<YJSProviderProps> = props => {
    const [ydoc, setYdoc] = React.useState<Y.Doc>();
    const [awareness, setAwareness] = React.useState<Awareness>();
    const history = useHistory();
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    
    const handleQuestionChange = React.useCallback((evt: Y.YEvent[], transaction: Y.Transaction) => {
        forceUpdate();
    }, [ydoc]);

    React.useEffect(() => {
        const { ydoc: newYDoc, awareness: newAwareness } = getYDoc(history, props.brickId, props.user.firstName, props.user.lastName);
        newYDoc.getMap("brick").observeDeep((evt, transaction) => {
            forceUpdate();
        });

        newYDoc.on("subdocs", ({added, removed, loaded}: {
            added: Set<Y.Doc>,
            removed: Set<Y.Doc>,
            loaded: Set<Y.Doc>
        }) => {
            added.forEach((q) => {
                q.getMap().observeDeep(handleQuestionChange);
            })
        });

        setYdoc(newYDoc);
        setAwareness(newAwareness);
    }, [props.brickId]);

    return (
        <YJSContext.Provider value={ydoc ? {
            ydoc,
            json: ydoc.toJSON(),
            awareness,
        } : null}>
            {props.children}
        </YJSContext.Provider>
    );
};

const mapState = (state: ReduxCombinedState) => ({
    user: state.user.user,
});

export default connect(mapState)(YJSProvider);