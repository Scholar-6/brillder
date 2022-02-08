import Quill from "quill";
import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import "./QuillEditor.scss";
import "react-quill/dist/quill.snow.css";

import "./QuillKeyboard";
import QuillBetterTable from "./QuillBetterTable";
import QuillCustomClipboard from "./QuillCustomClipboard";

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

const QuillShortAnswerPreview = React.forwardRef<HTMLDivElement, QuillEditorProps>((props, forwardRef) => {
  /*eslint-disable-next-line*/
  const [uniqueId] = React.useState(randomEditorId());
  const [data, setData] = React.useState(props.data);
  const [quill, setQuill] = React.useState<Quill | null>(null);

  useEffect(() => setData(props.data), [props.data]);

  const [clipboardModule, setClipboardModule] = React.useState<QuillCustomClipboard>();

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

  return (
    <div
      className={`quill-document-editor quill-id-${uniqueId}`}
      data-toolbar={[]}
      ref={forwardRef}
    >
      <ReactQuill
        theme="snow"
        value={data || ""}
        onChange={() => {}}
        readOnly={true}
        tabIndex={props.tabIndex}
        modules={modules}
        ref={ref}
      />
    </div>
  );
});

export default QuillShortAnswerPreview;
