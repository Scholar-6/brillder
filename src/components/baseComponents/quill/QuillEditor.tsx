import { Delta, Sources } from "quill";
import React, { Component } from "react";
import ReactQuill, {Quill} from "react-quill"; 
import "./QuillEditor.scss";
import "react-quill/dist/quill.snow.css";
import {ReactComponent as LatexIcon} from "assets/img/latex.svg";

import './QuillLatex';

interface QuillEditorProps {
    data: string;
    disabled: boolean;
    onChange(data: string): void;
}

const QuillEditor: React.FC<QuillEditorProps> = (props) => {
    const onChange = (content: string, delta: Delta, source: Sources) => {
        props.onChange(content);
    };

    const modules = {
        toolbar: {
            // container: [
            //     "bold", "italic",
            //     { color: [] },
            //     { script: "sub" },
            //     { script: "super" },
            //     "strike",
            //     { align: [] },
            //     { list: "bullet" },
            //     { list: "ordered" },
            //     "blockquote",
            //     "latex"
            // ],
            container: ".quill-toolbar",
        },
    }

    console.log((Quill as any).imports);

    return (
        <div className="quill-document-editor">
            <div className="quill-toolbar">
                <div className="ql-formats">
                    <button className="ql-bold" />
                    <button className="ql-italic" />
                    <button className="ql-strike" />
                    <select className="ql-color" />
                </div>
                <div className="ql-formats">
                    <button className="ql-script" value="sub" />
                    <button className="ql-script" value="super" />
                    <select className="ql-align" />
                    <button className="ql-blockquote" />
                </div>
                <div className="ql-formats">
                    <button className="ql-list" value="bullet" />
                    <button className="ql-list" value="ordered" />
                    <button className="ql-latex">
                        <LatexIcon />
                    </button>
                </div>
            </div>
            <ReactQuill
                theme="snow"
                value={props.data}
                onChange={onChange}
                readOnly={props.disabled}
                modules={modules}
            />
        </div>
    );
}

export default QuillEditor;