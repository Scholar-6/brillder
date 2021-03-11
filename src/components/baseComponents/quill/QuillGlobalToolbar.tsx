import React from 'react';
import { Quill } from 'react-quill';
import { QuillEditorContext } from './QuillEditorContext';
import _ from 'lodash';
import QuillToolbar from './QuillToolbar';

// const getReactPropsByNode = (node: any) => {
//     for(const key in node) {
//         if(key.startsWith("__reactInternalInstance$")) {
//             return node[key]._debugOwner.memoizedProps;
//         }
//     }
//     return null;
// }

interface QuillGlobalToolbarProps {
    availableOptions: string[];
}

const QuillGlobalToolbar: React.FC<QuillGlobalToolbarProps> = props => {
    const [currentQuillId] = React.useContext(QuillEditorContext);

    const [quill, enabled] = React.useMemo((): [Quill | null, string[]] => {
        const elements = document.getElementsByClassName("quill-id-" + currentQuillId);
        if(!(elements && elements.length > 0)) return [null, []];
        const element = elements[0];
        const editorElement = element.getElementsByClassName("quill")[0].getElementsByClassName("ql-container")[0];
        const newQuill = Quill.find(editorElement) as Quill;
        // const reactProps = getReactPropsByNode(element);
        // const toolbar = reactProps.toolbar;
        const toolbarString = element.getAttribute("data-toolbar");
        if(!toolbarString) return [newQuill, []];

        const toolbar = toolbarString.split(",");
        return [newQuill, toolbar];
    }, [currentQuillId]);

    return (
        <QuillToolbar
            className="ql-global-toolbar"
            quill={quill}
            toolbar={props.availableOptions}
            enabled={enabled}
        />
    );
};

export default React.memo(QuillGlobalToolbar, _.isEqual);