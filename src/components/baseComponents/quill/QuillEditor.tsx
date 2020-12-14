import { Delta, Sources } from "quill";
import React, { Component } from "react";
import ReactQuill, {Quill} from "react-quill"; 
import "./QuillEditor.scss";
import "react-quill/dist/quill.snow.css";
import _ from "lodash";
import { ReactComponent as LatexIcon } from "assets/img/latex.svg";

import "./QuillLatex";
import "./QuillAutoLink";
import "./QuillMediaEmbed";
import "./QuillImageUpload"
import { validateHint } from "components/build/questionService/ValidateQuestionService";

function randomEditorId() {
     return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

interface QuillEditorProps {
    data: string;
    disabled: boolean;
    placeholder?: string;
    allowLinks?: boolean;
    allowMediaEmbed?: boolean;
    validate?: boolean;
    isValid?: boolean | null;
    toolbar: string[];
    onChange(data: string): void;
    onBlur?(): void;
}

const QuillEditor: React.FC<QuillEditorProps> = (props) => {
    const callOnChange = React.useCallback(
        _.debounce((content: string, delta: Delta, source: Sources) => {
            props.onChange(content);
        }, 500),
        []
    );

    const onChange = (content: string, delta: Delta, source: Sources) => {
        setData(content);
        callOnChange(content, delta, source);
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

    const valid = (!props.validate || (data && (props.isValid !== false)));

    return (
        <div className={`quill-document-editor${valid ? "" : " content-invalid"}`}>
            <div className={`ql-toolbar quill-${uniqueId}`}>
                <div className="ql-formats">
                {props.toolbar.map((item) => (
                    <>{ toolbarItems[item] }</>
                ))}
                </div>
            </div>
            <ReactQuill
                theme="snow"
                value={data || ""}
                onChange={onChange}
                onBlur={props.onBlur}
                readOnly={props.disabled}
                placeholder={props.placeholder}
                modules={modules}
            />
        </div>
    );
}

export default QuillEditor;