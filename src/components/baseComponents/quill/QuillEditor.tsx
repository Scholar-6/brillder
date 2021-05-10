import Quill, { Sources } from "quill";
import Delta from "quill-delta";
import React from "react";
import ReactQuill, { Quill as GlobalQuill } from "react-quill"; 
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
import "./QuillTableUI";
import ImageDialog from "components/build/buildQuestions/components/Image/ImageDialog";
import { QuillEditorContext } from "./QuillEditorContext";
import QuillToolbar from "./QuillToolbar";
import ImageUpload, { CustomImageBlot } from "./QuillImageUpload";
import QuillCustomClipboard from "./QuillCustomClipboard";

function randomEditorId() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

interface QuillEditorProps {
    data?: string;
    disabled: boolean;
    placeholder?: string;
    tabIndex?: number;
    allowLinks?: boolean;
    allowMediaEmbed?: boolean;
    allowTables?: boolean;
    validate?: boolean;
    isValid?: boolean | null;
    toolbar: string[];
    enabledToolbarOptions?: string[];
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
        [props.onChange]
    );

    const onChange = (content: string, delta: any, source: Sources) => {
        setData(content);
        callOnChange(content, delta, source);
    }

    const [uniqueId] = React.useState(randomEditorId());
    const [data, setData] = React.useState(props.data);
    const [quill, setQuill] = React.useState<Quill | null>(null);

    const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
    const [imageDialogFile, setImageDialogFile] = React.useState<File>();
    const [imageDialogData, setImageDialogData] = React.useState<any>(null);
    const [imageDialogBlot, setImageDialogBlot] = React.useState<CustomImageBlot>();
    const [imageModule, setImageModule] = React.useState<ImageUpload>();
    React.useEffect(() => {
        if(imageModule) {
            imageModule.openDialog = (file?: File, data?: any, blot?: CustomImageBlot) => {
                setImageDialogFile(file);
                setImageDialogData(data);
                setImageDialogOpen(true);
                setImageDialogBlot(blot);
            }
        }
    }, [imageModule]);

    const [clipboardModule, setClipboardModule] = React.useState<QuillCustomClipboard>();
    React.useEffect(() => {
        if(imageModule && clipboardModule) {
            clipboardModule.onPasteImage = imageModule.onImagePaste.bind(imageModule);
        }
    }, [imageModule, clipboardModule]);

    const onFocus = React.useCallback(() => {
        setCurrentQuillId(uniqueId);
    }, [setCurrentQuillId, uniqueId]);

    const modules = React.useMemo(() => ({
        toolbar: (props.showToolbar ?? false) ? {
            container: `.quill-${uniqueId}`,
        } : false,
        autolink: props.allowLinks,
        mediaembed: props.allowMediaEmbed,
        imageupload: props.imageDialog,
        clipboard: true,
        keyboard: true,
        table: props.allowTables,
        tableUI: props.allowTables,
    }), [uniqueId, props.showToolbar, props.allowLinks, props.allowMediaEmbed, props.imageDialog]);
    
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
        if(node) {
            const editor = node.getEditor();
            setImageModule(editor.getModule("imageupload") as ImageUpload);
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
                    enabled={props.disabled ? [] : (props.enabledToolbarOptions ?? props.toolbar)}
                />
            }
            <ReactQuill
                theme="snow"
                value={data || ""}
                onChange={onChange}
                onBlur={props.onBlur}
                onFocus={onFocus}
                readOnly={props.disabled}
                placeholder={props.placeholder}
                tabIndex={props.tabIndex}
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
                            imageModule.updateImage.bind(imageModule)(imageDialogBlot, {source, caption, align, height});
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