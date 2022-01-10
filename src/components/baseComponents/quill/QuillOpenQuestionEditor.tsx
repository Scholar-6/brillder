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
import QuillBetterTable from "./QuillBetterTable";
import { QuillEditorContext } from "./QuillEditorContext";
import QuillToolbar from "./QuillToolbar";
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
  allowTables?: boolean;
  validate?: boolean;
  isValid?: boolean | null;
  toolbar: string[];
  enabledToolbarOptions?: string[];
  showToolbar?: boolean;
  className?: string;
  onChange?(data: string): void;
  onBlur?(): void;
}

const QuillOpenQuestionEditor = React.forwardRef<HTMLDivElement, QuillEditorProps>((props, forwardRef) => {
  /*eslint-disable-next-line*/
  const [currentQuillId, setCurrentQuillId] = React.useContext(QuillEditorContext);
  const [limitOverflow, setLimitOverflow] = React.useState(false);

  const callOnChange = React.useCallback((content: string) => props.onChange?.(content), [props.onChange]);

  const onChange = (content: string) => {
    const valueString = stripHtml(content);

    if (valueString.length > 257) {
      setLimitOverflow(true);
    } else {
      setLimitOverflow(false);

      if (content.indexOf('class="il-image-container"') === -1) {
        setData(content);
        callOnChange(content);
      } else {
        if (props.data) {
          setData(props.data);
          callOnChange(props.data);
        }
      }
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
    props?.onBlur?.();
    /*eslint-disable-next-line*/
  }, [currentQuillId, setCurrentQuillId, uniqueId, props.onBlur])

  const modules = React.useMemo(() => ({
    toolbar: (props.showToolbar ?? false) ? {
      container: `.quill-${uniqueId}`,
    } : false,
    autolink: props.allowLinks ?? false,
    mediaembed: props.allowMediaEmbed ?? false,
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
    capitalization: true,
  }), [uniqueId, props.showToolbar, props.allowLinks, props.allowMediaEmbed, props.allowTables]);

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
      className={`simple open-question-plan-quill quill-document-editor${valid ? "" : " content-invalid"} quill-id-${uniqueId} ${props.className ?? ""}`}
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
              Keep your Open Question snappy - you have reached our character limit
            </div>
          </React.Fragment>
        }
      />
    </div>
  );
});

export default QuillOpenQuestionEditor;
