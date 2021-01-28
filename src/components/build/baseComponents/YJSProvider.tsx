import React from "react";
import { getYDoc } from "socket/yjs";
import * as Y from "yjs";
import questionPanelWorkArea from "../buildQuestions/questionPanelWorkArea";

interface YJSProviderProps {
    brickId: number;
}

interface YJSContext {
    ydoc: Y.Doc;
    json: any;
}
export const YJSContext = React.createContext<YJSContext | null>(null);

const YJSProvider: React.FC<YJSProviderProps> = props => {
    const [ydoc, setYdoc] = React.useState<Y.Doc>();
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    
    const handleQuestionChange = React.useCallback((evt: Y.YEvent[], transaction: Y.Transaction) => {
        console.log(ydoc?.toJSON().brick.questions.map((q: any) => q.toJSON()));
        forceUpdate();
    }, [ydoc]);

    React.useEffect(() => {
        const newYDoc = getYDoc(props.brickId);
        newYDoc.getMap("brick").observeDeep((evt, transaction) => {
            console.log(ydoc?.toJSON().brick);
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
    }, [props.brickId]);

    return (
        <YJSContext.Provider value={ydoc ? {
            ydoc,
            json: ydoc.toJSON(),
        } : null}>
            {props.children}
        </YJSContext.Provider>
    );
};

export default YJSProvider;