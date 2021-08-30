import Quill, { Sources } from "quill";
import Delta from "quill-delta";
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
import "./QuillSoundUpload";
import "./QuillDesmos";
import "./QuillCapitalization";
import "./QuillBlockQuote";
import QuillBetterTable from "./QuillBetterTable";
import ImageDialog from "components/build/buildQuestions/components/Image/ImageDialog";
import { QuillEditorContext } from "./QuillEditorContext";
import QuillToolbar from "./QuillToolbar";
import ImageUpload, { CustomImageBlot } from "./QuillImageUpload";
import SoundUpload, { CustomSoundBlot } from "./QuillSoundUpload";
import QuillCustomClipboard from "./QuillCustomClipboard";
import ValidationFailedDialog from "../dialogs/ValidationFailedDialog";
import { GraphSettings } from "components/build/buildQuestions/components/Graph/Graph";
import QuillDesmos, { DesmosBlot } from "./QuillDesmos";
import QuillDesmosDialog from "./QuillDesmosDialog";
import SoundRecordDialog from "components/build/buildQuestions/questionTypes/sound/SoundRecordDialog";

function randomEditorId() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

export const QuillValidColors = {
    "Red": "#C43C30",
    "Blue": "#0681DB",
    "Green": "#30C474",
    "Yellow": "#FF9D00",
    "Brown": "#6A2E15",
    "Purple": "#4523FF",
    "Orange": "#FC7502",
    "DarkBlue": "#001C58",
};

interface QuillEditorProps {
    data?: string;
    disabled: boolean;
    placeholder?: string;
    tabIndex?: number;
    allowLinks?: boolean;
    allowMediaEmbed?: boolean;
    allowTables?: boolean;
    allowDesmos?: boolean;
    validate?: boolean;
    isValid?: boolean | null;
    toolbar: string[];
    enabledToolbarOptions?: string[];
    showToolbar?: boolean;
    className?: string;
    imageDialog?: boolean;
    soundDialog?: boolean;
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

    const [soundInvalid, setSoundInvalid] = React.useState(false);
    const [soundDialogOpen, setSoundDialogOpen] = React.useState(false);
    const [soundDialogShouldUpdate, setSoundDialogShouldUpdate] = React.useState(false);
    const [soundDialogFile, setSoundDialogFile] = React.useState<File>();
    const [soundDialogData, setSoundDialogData] = React.useState<any>({});
    const [soundDialogBlot, setSoundDialogBlot] = React.useState<CustomSoundBlot>();
    const [soundModule, setSoundModule] = React.useState<SoundUpload>();
    React.useEffect(() => {
        if(soundModule) {
            soundModule.openDialog = () => {
                setSoundDialogData({});
                setSoundDialogOpen(true);
                //setSoundDialogShouldUpdate(shouldUpdate ?? false);
                //setSoundDialogBlot(blot);
            }
        }
    }, [soundModule]);

    const [imageInvalid, setImageInvalid] = React.useState(false);
    const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
    const [imageDialogShouldUpdate, setImageDialogShouldUpdate] = React.useState(false);
    const [imageDialogFile, setImageDialogFile] = React.useState<File>();
    const [imageDialogData, setImageDialogData] = React.useState<any>(null);
    const [imageDialogBlot, setImageDialogBlot] = React.useState<CustomImageBlot>();
    const [imageModule, setImageModule] = React.useState<ImageUpload>();
    React.useEffect(() => {
        if(imageModule) {
            imageModule.openDialog = (file?: File, data?: any, blot?: CustomImageBlot, shouldUpdate?: boolean) => {
                setImageDialogFile(file);
                setImageDialogData(data);
                setImageDialogOpen(true);
                setImageDialogShouldUpdate(shouldUpdate ?? false);
                setImageDialogBlot(blot);
            }
        }
    }, [imageModule]);

    const [desmosDialogOpen, setDesmosDialogOpen] = React.useState(false);
    const [desmosValue, setDesmosValue] = React.useState<{ graphSettings: GraphSettings, graphState: any }>({
        graphState: null,
        graphSettings: {
            showSidebar: false,
            showSettings: false,
            allowPanning: false,
            trace: false,
            pointsOfInterest: false
        }
    });
    const [desmosBlotId, setDesmosBlotId] = React.useState<string>();
    const [desmosModule, setDesmosModule] = React.useState<QuillDesmos>();
    React.useEffect(() => {
        if(desmosModule) {
            desmosModule.openDialog = (value?: any, blot?: DesmosBlot) => {
                setDesmosValue(value);
                setDesmosBlotId(value.id);
                setDesmosDialogOpen(true);
            }
        }
    }, [desmosModule])

    const [clipboardModule, setClipboardModule] = React.useState<QuillCustomClipboard>();
    React.useEffect(() => {
        if(imageModule && clipboardModule) {
            clipboardModule.onPasteImage = imageModule.onImagePaste.bind(imageModule);
        }
    }, [imageModule, clipboardModule]);

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

    console.log(props.soundDialog);

    const modules = React.useMemo(() => ({
        toolbar: (props.showToolbar ?? false) ? {
            container: `.quill-${uniqueId}`,
        } : false,
        autolink: props.allowLinks ?? false,
        mediaembed: props.allowMediaEmbed ?? false,
        imageupload: props.imageDialog ?? false,
        soundupload: props.soundDialog ?? false,
        clipboard: true,
        keyboard: {
            bindings: QuillBetterTable.keyboardBindings,
        },
        history: {
            userOnly: true,
        },
        table: false,
        'better-table': props.allowTables ?? false ? {
            operationMenu: {
                items: {},
            },
        } : false,
        desmos: props.allowDesmos ?? false,
        // tableUI: props.allowTables,
        capitalization: true,
    }), [uniqueId, props.showToolbar, props.allowLinks, props.allowMediaEmbed, props.allowTables, props.allowDesmos, props.imageDialog]);
    
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
            setSoundModule(editor.getModule("soundupload") as SoundUpload);
            setDesmosModule(editor.getModule("desmos") as QuillDesmos);
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
                onBlur={onBlur}
                onFocus={onFocus}
                readOnly={props.disabled}
                placeholder={props.placeholder}
                tabIndex={props.tabIndex}
                modules={modules}
                ref={ref}
            />
            {props.imageDialog &&
                <div>
                  <ImageDialog
                    initData={imageDialogData ?? {}}
                    initFile={imageDialogFile ?? null}
                    open={imageDialogOpen}
                    alwaysUpdate={imageDialogShouldUpdate}
                    upload={async(...args) => {
                        if(imageModule) {
                            const res = await imageModule.uploadImages.bind(imageModule)(...args);
                            if (!res) {
                              setImageInvalid(true);
                              return false;
                            }
                        }
                        setImageDialogOpen(false);
                        setImageDialogFile(undefined);
                        return true;
                    }}
                    updateData={(source, caption, align, height, newImageFile) => {
                        if(imageModule) {
                            imageModule.updateImage.bind(imageModule)(imageDialogBlot, {source, caption, align, height, newImageFile});
                        }
                        setImageDialogOpen(false);
                        setImageDialogFile(undefined);
                    }}
                    setDialog={open => setImageDialogOpen(false)}
                  />
                  <ValidationFailedDialog
                    isOpen={imageInvalid} close={() => setImageInvalid(false)}
                    header="This image is too large, try shrinking it."
                  />
                </div>
            }
            {props.soundDialog && 
              <div>
                <SoundRecordDialog
                  isOpen={soundDialogOpen}
                  save={async(v, caption) => {
                      if (soundModule) {
                          const res = await soundModule.uploadImages.bind(soundModule)(v, caption);
                          if (!res) {
                              setSoundInvalid(true);
                          }
                      }
                      setSoundDialogOpen(false);
                  }}
                  data={soundDialogData}
                  close={() => setSoundDialogOpen(false)}
                />
              </div>
            }
            {props.allowDesmos &&
                <QuillDesmosDialog
                    graphState={desmosValue.graphState}
                    graphSettings={desmosValue.graphSettings}
                    isOpen={desmosDialogOpen}
                    close={() => {
                        setDesmosDialogOpen(false);
                    }}
                    setGraphState={(state) => {
                        if(desmosModule) {
                            desmosModule.updateGraph.bind(desmosModule)({ id: desmosBlotId, graphState: state });
                        }
                    }}
                    setGraphSettings={() => {}}
                />
            }
        </div>
    );
});

export default QuillEditor;