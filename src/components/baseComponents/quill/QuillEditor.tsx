import { Delta, Sources } from "quill";
import React from "react";
import ReactQuill, { Quill } from "react-quill"; 
import { QuillBinding } from "y-quill";
import "./QuillEditor.scss";
import "react-quill/dist/quill.snow.css";
import _ from "lodash";
//import { ReactComponent as LatexIcon } from "assets/img/latex.svg";
import * as Y from "yjs";

import "./QuillLatex";
import "./QuillAutoLink";
import "./QuillMediaEmbed";
import "./QuillImageUpload";
import "./QuillCursors";
import { YJSContext } from "components/build/baseComponents/YJSProvider";
import ImageDialog from "components/build/buildQuestions/components/Image/ImageDialog";
import ImageUpload from "./QuillImageUpload";
import { QuillEditorContext } from "./QuillEditorContext";
import QuillToolbar from "./QuillToolbar";

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
    showToolbar?: boolean;
    className?: string;
    imageDialog?: boolean;
    onChange?(data: string): void;
    onBlur?(): void;
}

const QuillEditor = React.forwardRef<HTMLDivElement, QuillEditorProps>((props, forwardRef) => {
    /*eslint-disable-next-line*/
    const [currentQuillId, setCurrentQuillId] = React.useContext(QuillEditorContext);

    const callOnChange = React.useCallback(
        _.debounce((content: string, delta: Delta, source: Sources) => {
            if(props.onChange) {
                props.onChange(content);
            }
        }, 500),
        []
    );

    const onChange = (content: string, delta: Delta, source: Sources) => {
        if(!props.sharedData) setData(content);
        callOnChange(content, delta, source);
    }

    const [uniqueId] = React.useState(randomEditorId());
    const [data, setData] = React.useState(props.data);
    const [quill, setQuill] = React.useState<Quill | null>(null);

    const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
    const [imageDialogFile, setImageDialogFile] = React.useState<File>();
    const [imageDialogData, setImageDialogData] = React.useState<any>(null);
    const [imageModule, setImageModule] = React.useState<ImageUpload>();
    React.useEffect(() => {
        if(imageModule) {
            imageModule.openDialog = (file?: File, data?: any) => {
                setImageDialogFile(file);
                setImageDialogData(data);
                setImageDialogOpen(true);
            }
        }
    }, [imageModule])

    const context = React.useContext(YJSContext);
    const awareness = context?.awareness;

    const modules = {
        toolbar: (props.showToolbar ?? false) ? {
            container: `.quill-${uniqueId}`,
        } : false,
        autolink: props.allowLinks,
        mediaembed: props.allowMediaEmbed,
        imageupload: props.imageDialog,
        cursors: true,
    }
    
    /*
    const toolbarItems: { [key: string]: any } = {
        bold: <button className="ql-bold" />,
        italic: <button className="ql-italic" />,
        strikethrough: <button className="ql-strike" />,
        fontColor: <select className="ql-color">
          <option value="#C43C30">Red</option>
          <option value="#0681DB">Blue</option>
          <option value="#30C474">Green</option>
          <option value="#FF9D00">Yellow</option>
          <option value="#6A2E15">Brown</option>
          <option value="#4523FF">Purple</option>
          <option value="#FC7502">Orange</option>
        </select>,
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
    */

    const ref = React.useCallback((node: ReactQuill) => {
        if(node && props.sharedData) {
            const editor = node.getEditor();
            new QuillBinding(props.sharedData, editor, awareness);
            setImageModule(editor.getModule("imageupload") as ImageUpload);
            if(quill !== editor) {
                setQuill(editor);
            }
        }
    /*eslint-disable-next-line*/
    }, []);

    const valid = (!props.validate || (
        ((data?.trim().length || props.sharedData?.toString().trim().length) ?? "") > 0 && (props.isValid !== false)
    ));

    return (
        <div
            className={`quill-document-editor${valid ? "" : " content-invalid"} quill-id-${uniqueId} ${props.className ?? ""}`}
            data-toolbar={props.toolbar}
            ref={forwardRef}
        >
            {(props.showToolbar ?? false) &&
                // <div className={`ql-toolbar quill-${uniqueId}`}>
                // {
                //     props.toolbar.length > 0 &&
                //     <div className="ql-formats">
                //     {props.toolbar.map((item) => (
                //         <React.Fragment key={item}>{ toolbarItems[item] }</React.Fragment>
                //     ))}
                //     </div>
                // }
                // </div>
                <QuillToolbar
                    quill={quill}
                    quillId={uniqueId}
                    toolbar={props.toolbar}
                    enabled={props.disabled ? [] : props.toolbar}
                />
            }
            <ReactQuill
                theme="snow"
                // value={props.sharedData ? undefined : (data || "")}
                onChange={onChange}
                onBlur={props.onBlur}
                onFocus={() => setCurrentQuillId(uniqueId)}
                readOnly={props.disabled}
                placeholder={props.placeholder}
                modules={modules}
                ref={ref}
            />
            {props.imageDialog &&
                <ImageDialog
                    initData={imageDialogData ?? {}}
                    initFile={imageDialogFile ?? null}
                    open={imageDialogOpen}
                    upload={(...args) => {
                        if(imageModule) {
                            imageModule.uploadImages.bind(imageModule)(...args);
                        }
                        setImageDialogOpen(false);
                        setImageDialogFile(undefined);
                    }}
                    updateData={(source, caption, align, height) => {
                        if(imageModule) {
                            imageModule.updateImage.bind(imageModule)({source, caption, align, height});
                        }
                        setImageDialogOpen(false);
                        setImageDialogFile(undefined);
                    }}
                    setDialog={open => setImageDialogOpen(false)}
                />
            }
        </div>
    );
});

export default QuillEditor;