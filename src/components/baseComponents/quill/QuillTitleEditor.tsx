import Quill from "quill";
import React from "react";
import ReactQuill from "react-quill";
import "./QuillEditor.scss";
import "react-quill/dist/quill.snow.css";
import "quill-table-ui/dist/index.css";
import Snackbar from "@material-ui/core/Snackbar";

import "./QuillLatex";
import "./QuillAutoLink";
import "./QuillMediaEmbed";
import "./QuillKeyboard";
import "./QuillCapitalization";
import "./QuillBlockQuote";
import "./QuillTitleEditor.scss";
import QuillBetterTable from "./QuillBetterTable";
import { QuillEditorContext } from "./QuillEditorContext";
import { stripHtml } from "components/build/questionService/ConvertService";

function randomEditorId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

interface QuillEditorProps {
  data?: string;
  disabled: boolean;
  placeholder?: string;
  validate?: boolean;
  isValid?: boolean | null;
  toolbar: string[];
  onChange?(data: string): void;
}

const QuillSimpleEditor = React.forwardRef<HTMLDivElement, QuillEditorProps>((props, forwardRef) => {
  /*eslint-disable-next-line*/
  const [currentQuillId, setCurrentQuillId] = React.useContext(QuillEditorContext);
  const [limitOverflow, setLimitOverflow] = React.useState(false);

  const callOnChange = React.useCallback((content: string) => props.onChange?.(content), [props.onChange]);

  const onChange = (content: string) => {
    const valueString = stripHtml(content);

    if (valueString.length > 50) {
      setLimitOverflow(true);
    } else {
      setLimitOverflow(false);
      setData(content);
      callOnChange(content);
    }
  }

  const [uniqueId] = React.useState(randomEditorId());
  const [data, setData] = React.useState(props.data);
  const [quill, setQuill] = React.useState<Quill | null>(null);

  const onFocus = React.useCallback(() => {
    setCurrentQuillId(uniqueId);
  }, [setCurrentQuillId, uniqueId]);

  const onBlur = React.useCallback(() => {
    if (currentQuillId === uniqueId) {
      setCurrentQuillId(undefined);
    }
    /*eslint-disable-next-line*/
  }, [currentQuillId, setCurrentQuillId, uniqueId])

  const modules = React.useMemo(() => ({
    toolbar: false,
    autolink: false,
    mediaembed: false,
    keyboard: {
      bindings: QuillBetterTable.keyboardBindings,
    },
    history: {
      userOnly: true,
    },
    table: false,
    'better-table': false,
    capitalization: true,
  }), [uniqueId]);

  const ref = React.useCallback((node: ReactQuill) => {
    if (node) {
      const editor = node.getEditor();
      if (quill !== editor) {
        setQuill(editor);
      }
    }
    /*eslint-disable-next-line*/
  }, []);

  const valid = (!props.validate || (data && (props.isValid !== false)));

  return (
    <div
      className={`simple plan-brick-title quill-document-editor ${valid ? "" : " content-invalid"} quill-id-${uniqueId}`}
      data-toolbar={props.toolbar}
      ref={forwardRef}
    >
      <ReactQuill
        theme="snow"
        value={data || ""}
        onKeyUp={() => {
          // overflow replace text to show that data isn`t changing
          if (limitOverflow) {
            if (quill && data) {
              const selection = quill.getSelection();
              quill.setText(stripHtml(data));
              if (selection) {
                quill.setSelection(selection);
              }
            }
          }
        }}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        readOnly={props.disabled}
        placeholder={props.placeholder}
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
              Titles can be a maximum of 50 characters long
            </div>
          </React.Fragment>
        }
      />
    </div>
  );
});

export default QuillSimpleEditor;
