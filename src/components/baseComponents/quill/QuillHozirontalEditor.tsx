import Quill, { Sources } from "quill";
import Delta from "quill-delta";
import React from "react";
import ReactQuill from "react-quill";
import "./QuillEditor.scss";
import "react-quill/dist/quill.snow.css";
import "quill-table-ui/dist/index.css";
import _ from "lodash";
import Snackbar from "@material-ui/core/Snackbar";

import "./QuillLatex";
import "./QuillAutoLink";
import "./QuillMediaEmbed";
import "./QuillCustomClipboard";
import "./QuillKeyboard";
import "./QuillSoundUpload";
import "./QuillCapitalization";
import "./QuillBlockQuote";
import { QuillEditorContext } from "./QuillEditorContext";
import QuillToolbar from "./QuillToolbar";
import SoundUpload from "./QuillSoundUpload";
import QuillCustomClipboard from "./QuillCustomClipboard";
import SoundRecordDialog from "components/build/buildQuestions/questionTypes/sound/SoundRecordDialog";
import { fileUrl } from "components/services/uploadFile";
import { stripHtml } from "components/build/questionService/ConvertService";

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
  validate?: boolean;
  isValid?: boolean | null;
  toolbar: string[];
  enabledToolbarOptions?: string[];
  showToolbar?: boolean;
  className?: string;
  soundDialog?: boolean;
  onChange?(data: string): void;
  onBlur?(): void;
}

const QuillEditor = React.forwardRef<HTMLDivElement, QuillEditorProps>((props, forwardRef) => {
  /*eslint-disable-next-line*/
  const [currentQuillId, setCurrentQuillId] = React.useContext(QuillEditorContext);
  const [limitOverflow, setLimitOverflow] = React.useState(false);

  const callOnChange = React.useCallback(
    _.debounce((content: string, delta: Delta, source: Sources) => {
      if (props.onChange) {
        props.onChange(content);
      }
    }, 500),
    [props.onChange]
  );

  const onChange = (content: string, delta: any, source: Sources) => {
    const valueString = stripHtml(content);

    if (valueString.length > 25) {
      setLimitOverflow(true);
    } else {
      setLimitOverflow(false);
      setData(content);
      callOnChange(content, delta, source);
    }
  }

  const [uniqueId] = React.useState(randomEditorId());
  const [data, setData] = React.useState(props.data);
  const [quill, setQuill] = React.useState<Quill | null>(null);

  const [selection, setSelection] = React.useState(0);
  const [soundDialogOpen, setSoundDialogOpen] = React.useState(false);
  const [soundDialogData, setSoundDialogData] = React.useState<any>({});
  const [soundModule, setSoundModule] = React.useState<SoundUpload>();
  React.useEffect(() => {
    if (soundModule) {
      soundModule.openDialog = () => {
        if (quill) {
          const range = quill.getSelection();
          const position = range ? range.index : 0;
          setSelection(position);
        }
        setSoundDialogData({});
        setSoundDialogOpen(true);
      }
    }
    /*eslint-disable-next-line*/
  }, [soundModule]);

  const [clipboardModule, setClipboardModule] = React.useState<QuillCustomClipboard>();

  const onFocus = React.useCallback(() => {
    setCurrentQuillId(uniqueId);
  }, [setCurrentQuillId, uniqueId]);

  const onBlur = React.useCallback(() => {
    if (currentQuillId === uniqueId) {
      setCurrentQuillId(undefined);
    }
    props?.onBlur?.();
    /*eslint-disable-next-line*/
  }, [currentQuillId, setCurrentQuillId, uniqueId, props.onBlur])

  const modules = React.useMemo(() => ({
    toolbar: (props.showToolbar ?? false) ? {
      container: `.quill-${uniqueId}`,
    } : false,
    autolink: props.allowLinks ?? false,
    mediaembed: props.allowMediaEmbed ?? false,
    soundupload: props.soundDialog ?? false,
    clipboard: true,
    history: {
      userOnly: true,
    },
    capitalization: true,
    /*eslint-disable-next-line*/
  }), [uniqueId, props.showToolbar, props.allowLinks, props.allowMediaEmbed]);

  const ref = React.useCallback((node: ReactQuill) => {
    if (node) {
      const editor = node.getEditor();
      setSoundModule(editor.getModule("soundupload") as SoundUpload);
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

  const valid = (!props.validate || (data && (props.isValid !== false)));

  return (
    <div
      className={`simple horizontal-shuffle-editor quill-document-editor${valid ? "" : " content-invalid"} quill-id-${uniqueId} ${props.className ?? ""}`}
      data-toolbar={props.toolbar}
      ref={forwardRef}
    >
      {(props.showToolbar ?? false) &&
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
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={limitOverflow}
        onClose={() => setLimitOverflow(false)}
        action={
          <React.Fragment>
            <div>
              <span className="exclamation-mark">!</span>
              Because phone screens are narrow, there is a limit of 25 characters for horizontal shuffle answers. For answers requiring more text, we recommend using a vertical shuffle instead
            </div>
          </React.Fragment>
        }
      />
      {props.soundDialog &&
        <div>
          <SoundRecordDialog
            isOpen={soundDialogOpen}
            save={async (v, caption, permision, source) => {
              if (quill) {
                quill.insertEmbed(selection, 'audio', { url: fileUrl(v), caption, permision, source }, 'user');
              }
              setSoundDialogOpen(false);
            }}
            data={soundDialogData}
            close={() => setSoundDialogOpen(false)}
          />
        </div>
      }
    </div>
  );
});

export default QuillEditor;