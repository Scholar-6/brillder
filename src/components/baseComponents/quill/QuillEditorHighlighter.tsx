import Quill from "quill";
import React from "react";
import ReactQuill from "react-quill";
import "./QuillEditor.scss";
import "react-quill/dist/quill.snow.css";
import "quill-table-ui/dist/index.css";
import _ from "lodash";
//import { ReactComponent as LatexIcon } from "assets/img/latex.svg";

import "./QuillLatex";
import "./QuillAutoLink";
import "./QuillMediaEmbed";
import "./QuillCustomClipboard";
import "./QuillKeyboard";
import "./QuillImageUpload";
import "./QuillDesmos";
import QuillBetterTable from "./QuillBetterTable";
import { QuillEditorContext } from "./QuillEditorContext";
import ImageUpload from "./QuillImageUpload";
import QuillCustomClipboard from "./QuillCustomClipboard";
import QuillDesmos from "./QuillDesmos";

function randomEditorId() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

interface QuillEditorProps {
    data?: string;
    allowLinks?: boolean;
    allowMediaEmbed?: boolean;
    allowTables?: boolean;
    allowDesmos?: boolean;
    onChange?(data: string): void;
    onBlur?(): void;
}

const QuillEditorHighlighter = React.forwardRef<HTMLDivElement, QuillEditorProps>((props, forwardRef) => {
    /*eslint-disable-next-line*/
    const [currentQuillId, setCurrentQuillId] = React.useContext(QuillEditorContext);

    const callOnChange = React.useCallback(
        _.debounce((content: string) => {
            if (props.onChange) {
                props.onChange(content);
            }
        }, 500),
        [props.onChange]
    );

    const onChange = (content: string) => {
        setData(content);
        callOnChange(content);
    }

    const [uniqueId] = React.useState(randomEditorId());
    const [data, setData] = React.useState(props.data);
    const [quill, setQuill] = React.useState<Quill | null>(null);

    const [imageModule, setImageModule] = React.useState<ImageUpload>();
    const [desmosModule, setDesmosModule] = React.useState<QuillDesmos>();

    const [clipboardModule, setClipboardModule] = React.useState<QuillCustomClipboard>();
    React.useEffect(() => {
        if (imageModule && clipboardModule) {
            clipboardModule.onPasteImage = imageModule.onImagePaste.bind(imageModule);
        }
    }, [imageModule, clipboardModule]);

    const onFocus = React.useCallback(() => {
        setCurrentQuillId(uniqueId);
    }, [setCurrentQuillId, uniqueId]);

    const onBlur = React.useCallback(() => {
        if (currentQuillId === uniqueId) {
            setCurrentQuillId(undefined);
        }
        props?.onBlur?.();
    }, [currentQuillId, setCurrentQuillId, uniqueId, props.onBlur])

    const modules = React.useMemo(() => ({
        toolbar: false,
        autolink: props.allowLinks,
        mediaembed: props.allowMediaEmbed,
        imageupload: false,
        clipboard: true,
        keyboard: {
            bindings: QuillBetterTable.keyboardBindings,
        },
        table: false,
        'better-table': props.allowTables ? {
            operationMenu: {
                items: {},
            },
        } : false,
        desmos: props.allowDesmos,
    }), [uniqueId, props.allowLinks, props.allowMediaEmbed, props.allowDesmos]);

    const ref = React.useCallback((node: ReactQuill) => {
        if (node) {
            const editor = node.getEditor();
            setImageModule(editor.getModule("imageupload") as ImageUpload);
            setDesmosModule(editor.getModule("desmos") as QuillDesmos);
            setClipboardModule(editor.getModule("clipboard") as QuillCustomClipboard);
            editor.on("editor-change", () => {
                const clipboard = editor.getModule("clipboard");
                if (clipboardModule !== clipboard) {
                    setClipboardModule(clipboard);
                }
            });
            if (quill !== editor) {
                setQuill(editor);
            }
        }
        /*eslint-disable-next-line*/
    }, []);

    return (
        <div
            className="quill-document-editor"
            data-toolbar={[]}
            ref={forwardRef}
        >
            <ReactQuill
                theme="snow"
                value={data || ""}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                modules={modules}
                ref={ref}
            />
        </div>
    );
});

export default QuillEditorHighlighter;