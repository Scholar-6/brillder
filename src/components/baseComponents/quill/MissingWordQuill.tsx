import Quill, { Sources } from "quill";
import React, { useEffect } from "react";
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
import "./QuillCapitalization";
import "./QuillBlockQuote";
import QuillBetterTable from "./QuillBetterTable";
import { QuillEditorContext } from "./QuillEditorContext";
import QuillCustomClipboard from "./QuillCustomClipboard";

function randomEditorId() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

interface QuillEditorProps {
    data?: string;
    disabled: boolean;
    placeholder?: string;
    tabIndex?: number;
    allowMediaEmbed?: boolean;
    validate?: boolean;
    isValid?: boolean | null;
    toolbar: string[];
    className?: string;
    onChange?(data: string): void;
    onBlur?(): void;
}

const MissingWordQuill = React.forwardRef<HTMLDivElement, QuillEditorProps>((props, forwardRef) => {
    const [updateTimeout, setUpdateTimeout] = React.useState(-1);

    /*eslint-disable-next-line*/
    const [currentQuillId, setCurrentQuillId] = React.useContext(QuillEditorContext);

    const onChange = (content: string) => {
        setData(content);
        
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }

        const timeout = setTimeout(() => {
            if (props.onChange) {
                props.onChange(content);
            }
        }, 150);
        setUpdateTimeout(timeout);
    }

    const [uniqueId] = React.useState(randomEditorId());

    const [data, setData] = React.useState(props.data);
    useEffect(() => {
      if (props.data !== data) {
        setData(props.data);
      }
    /*eslint-disable-next-line*/
    }, [props.data]);

    const [quill, setQuill] = React.useState<Quill | null>(null);

    const [clipboardModule, setClipboardModule] = React.useState<QuillCustomClipboard>();

    const onFocus = React.useCallback(() => {
        setCurrentQuillId(uniqueId);
    }, [setCurrentQuillId, uniqueId]);

    const onBlur = React.useCallback(() => {
        if(currentQuillId === uniqueId) {
            setCurrentQuillId(undefined);
        }
        props?.onBlur?.();
    /*eslint-disable-next-line*/
    }, [currentQuillId, setCurrentQuillId, uniqueId, props.onBlur])

    const modules = React.useMemo(() => ({
        toolbar: false,
        autolink: false,
        mediaembed: props.allowMediaEmbed ?? false,
        imageupload: false,
        clipboard: true,
        keyboard: {
            bindings: QuillBetterTable.keyboardBindings,
        },
        history: {
            userOnly: true,
        },
        table: false,
        desmos: false,
        capitalization: true,
    /*eslint-disable-next-line*/
    }), [uniqueId]);

    const ref = React.useCallback((node: ReactQuill) => {
        if(node) {
            const editor = node.getEditor();
            setClipboardModule(editor.getModule("clipboard") as QuillCustomClipboard);
            editor.on("editor-change", () => {
                const clipboard = editor.getModule("clipboard");
                if (clipboardModule !== clipboard) {
                    setClipboardModule(clipboard);
                }
            });
            if(quill !== editor) {
                setQuill(editor);
            }
        }
    /*eslint-disable-next-line*/
    }, []);

    const valid = (!props.validate || (data && (props.isValid !== false)));

    return (
        <div
            className={`quill-document-editor${valid ? "" : " content-invalid"} quill-id-${uniqueId} ${props.className ?? ""}`}
            data-toolbar={props.toolbar}
            ref={forwardRef}
        >
            <ReactQuill
                theme="snow"
                value={data || ""}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                readOnly={props.disabled}
                placeholder={props.placeholder}
                tabIndex={props.tabIndex}
                modules={modules}
                ref={ref}
            />
        </div>
    );
});

export default MissingWordQuill;