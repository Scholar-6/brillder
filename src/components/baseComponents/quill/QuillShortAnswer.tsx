import Quill from "quill";
import React from "react";
import ReactQuill from "react-quill";
import "./QuillEditor.scss";
import "react-quill/dist/quill.snow.css";
import _ from "lodash";
import Snackbar from "@material-ui/core/Snackbar";

import "./QuillKeyboard";
import QuillBetterTable from "./QuillBetterTable";
import { QuillEditorContext } from "./QuillEditorContext";
import QuillCustomClipboard from "./QuillCustomClipboard";
import { stripHtml } from "components/build/questionService/ConvertService";

function randomEditorId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

interface QuillEditorProps {
  data?: string;
  disabled: boolean;
  placeholder?: string;
  tabIndex?: number;
  validate?: boolean;
  isValid?: boolean | null;
  onChange?(data: string): void;
}

const QuillShortAnswer = React.forwardRef<HTMLDivElement, QuillEditorProps>((props, forwardRef) => {
  /*eslint-disable-next-line*/
  const [currentQuillId, setCurrentQuillId] = React.useContext(QuillEditorContext);
  const [limitOverflow, setLimitOverflow] = React.useState(false);

  const callOnChange = React.useCallback(
    _.debounce((content: string) => {
      if (props.onChange) {
        props.onChange(content);
      }
    }, 500),
    [props.onChange]
  );

  const onChange = (content: string) => {
    const valueString = stripHtml(content);
    const res = valueString.split(" ");
    if (res.length <= 3) {
      setData(content);
      callOnChange(content);
      setLimitOverflow(false);
    } else {
      setLimitOverflow(true);
    }
  }

  const [uniqueId] = React.useState(randomEditorId());
  const [data, setData] = React.useState(props.data);
  const [quill, setQuill] = React.useState<Quill | null>(null);

  const [clipboardModule, setClipboardModule] = React.useState<QuillCustomClipboard>();

  const onFocus = React.useCallback(() => {
    setCurrentQuillId(uniqueId);
  }, [setCurrentQuillId, uniqueId]);

  const modules = React.useMemo(() => ({
    toolbar: false,
    clipboard: true,
    keyboard: {
      bindings: QuillBetterTable.keyboardBindings,
    },
    history: {
      userOnly: true,
    },
    table: false,
  /*eslint-disable-next-line*/
  }), [uniqueId]);

  const ref = React.useCallback((node: ReactQuill) => {
    if (node) {
      const editor = node.getEditor();
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
      className={`quill-document-editor ${valid ? "" : "content-invalid"} quill-id-${uniqueId}`}
      data-toolbar={[]}
      ref={forwardRef}
    >
      <ReactQuill
        theme="snow"
        value={data || ""}
        onKeyUp={() => {
          // overflow replace text to show that data isn`t changing
          if (limitOverflow) {
            if (quill && data) {
              quill.setText(stripHtml(data));
            }
          }
        }}
        onChange={onChange}
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
              There is a limit of two spaces or three words for short answers
            </div>
          </React.Fragment>
        }
      />
    </div>
  );
});

export default QuillShortAnswer;
