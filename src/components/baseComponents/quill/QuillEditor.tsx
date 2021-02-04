import { Delta, Sources } from "quill";
import React, { Component, MutableRefObject } from "react";
import ReactQuill, {Quill} from "react-quill"; 
import { QuillBinding } from "y-quill";
import "./QuillEditor.scss";
import "react-quill/dist/quill.snow.css";
import _ from "lodash";
import { ReactComponent as LatexIcon } from "assets/img/latex.svg";
import * as Y from "yjs";

import "./QuillLatex";
import "./QuillAutoLink";
import "./QuillMediaEmbed";
import "./QuillImageUpload"
import quillToHTML from "./QuillToHTML";

function randomEditorId() {
     return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

interface QuillEditorProps {
    data?: string;
    sharedData?: Y.Text;
    disabled: boolean;
    placeholder?: string;
    allowLinks?: boolean;
    allowMediaEmbed?: boolean;
    validate?: boolean;
    isValid?: boolean | null;
    toolbar: string[];
    onChange?(data: string): void;
    onBlur?(): void;
}

const QuillEditor: React.FC<QuillEditorProps> = (props) => {
    const callOnChange = React.useCallback(
        _.debounce((content: string, delta: Delta, source: Sources) => {
            if(props.onChange) {
                props.onChange(content);
            }
        }, 500),
        []
    );

    const onChange = (content: string, delta: Delta, source: Sources) => {
        // setData(content);
        // callOnChange(content, delta, source);
    }

    const [uniqueId, setUniqueId] = React.useState(randomEditorId());
    const [data, setData] = React.useState(props.data);

    const modules = {
        toolbar: {
            container: `.quill-${uniqueId}`,
        },
        autolink: props.allowLinks,
        mediaembed: props.allowMediaEmbed,
        imageupload: true,
    }
    
    const toolbarItems: { [key: string]: any } = {
        bold: <button className="ql-bold" />,
        italic: <button className="ql-italic" />,
        strikethrough: <button className="ql-strike" />,
        fontColor: <select className="ql-color" />,
        subscript: <button className="ql-script" value="sub" />,
        superscript: <button className="ql-script" value="super" />,
        align: <select className="ql-align" />,
        blockQuote: <button className="ql-blockquote" />,
        bulletedList: <button className="ql-list" value="bullet" />,
        numberedList: <button className="ql-list" value="ordered" />,
        latex: (<button className="ql-latex">
            <LatexIcon />
        </button>),
        image: <button className="ql-image" />,
    };

    const ref = React.useCallback((node: ReactQuill) => {
        if(node && props.sharedData) {
            const editor = node.getEditor();
            const binding = new QuillBinding(props.sharedData, editor);
        }
    }, []);

    const valid = (!props.validate || (data && (props.isValid !== false)));

    return (
        <div className={`quill-document-editor${valid ? "" : " content-invalid"}`}>
            <div className={`ql-toolbar quill-${uniqueId}`}>
                <div className="ql-formats">
                {props.toolbar.map((item) => (
                    <React.Fragment key={item}>{ toolbarItems[item] }</React.Fragment>
                ))}
                </div>
            </div>
            <ReactQuill
                theme="snow"
                // value={props.sharedData ? undefined : (data || "")}
                onChange={onChange}
                // onBlur={props.onBlur}
                readOnly={props.disabled}
                placeholder={props.placeholder}
                modules={modules}
                ref={ref}
            />
        </div>
    );
}

export default QuillEditor;