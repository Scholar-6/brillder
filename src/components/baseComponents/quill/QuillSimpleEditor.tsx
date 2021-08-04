import Quill from "quill";
import React from "react";
import ReactQuill from "react-quill";
import "../QuillEditor.scss";
import "react-quill/dist/quill.snow.css";
import "quill-table-ui/dist/index.css";
import _ from "lodash";

import "./QuillLatex";
import "./QuillAutoLink";
import "./QuillMediaEmbed";
import "./QuillKeyboard";
import "./QuillCapitalization";
import "./QuillBlockQuote";
import QuillBetterTable from "./QuillBetterTable";
import { QuillEditorContext } from "./QuillEditorContext";
import QuillToolbar from "./QuillToolbar";

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

const QuillSimpleEditor = React.forwardRef<HTMLDivElement, QuillEditorProps>((props, forwardRef) => {
  /*eslint-disable-next-line*/
  const [currentQuillId, setCurrentQuillId] = React.useContext(QuillEditorContext);

  const callOnChange = React.useCallback(
    _.debounce((content: string) => {
      if (props.onChange) {
        props.onChange(content);
      }
    }, 500),
    [props.onChange]
  );

  const onChange = (content: string) => {
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
      className={`simple quill-document-editor${valid ? "" : " content-invalid"} quill-id-${uniqueId} ${props.className ?? ""}`}
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
    </div>
  );
});

export default QuillSimpleEditor;
