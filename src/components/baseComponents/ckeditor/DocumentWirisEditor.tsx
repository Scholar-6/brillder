import React from "react";
// @ts-ignore
import CKEditor from "@ckeditor/ckeditor5-react";
// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
// @ts-ignore
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
// @ts-ignore
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
// @ts-ignore
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
// @ts-ignore
import Superscript from "@ckeditor/ckeditor5-basic-styles/src/superscript";
// @ts-ignore
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";
// @ts-ignore
import Subscript from "@ckeditor/ckeditor5-basic-styles/src/subscript";
// @ts-ignore
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
// @ts-ignore
import FontColor from "@ckeditor/ckeditor5-font/src/fontcolor";
// @ts-ignore
import List from "@ckeditor/ckeditor5-list/src/list";
// @ts-ignore
import MathType from "@wiris/mathtype-ckeditor5/src/plugin";
// @ts-ignore
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
// @ts-ignore
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
// @ts-ignore
import Table from "@ckeditor/ckeditor5-table/src/table";
// @ts-ignore
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
// @ts-ignore
import Image from "@ckeditor/ckeditor5-image/src/image";
import "./DocumentEditor.scss";
import UploadImageCustom from './UploadImageCustom';

export interface DocumentWirisEditorProps {
  disabled: boolean;
  data: string;
  toolbar?: any;
  placeholder?: string;
  mediaEmbed?: boolean;
  defaultAlignment?: string;
  validationRequired?: boolean;
  onBlur(): void;
  onChange(data: string): void;
}

interface DocumentWirisEditorState {
  data: string;
  focused: boolean;
  editor: any;
  ref: any;
  isWirisInserting: boolean;
}

class DocumentWirisEditorComponent extends React.Component<
  DocumentWirisEditorProps,
  DocumentWirisEditorState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: props.data,
      focused: false,
      editor: null,
      ref: React.createRef(),
      isWirisInserting: false,
    };
  }

  UNSAFE_componentWillReceiveProps(props: DocumentWirisEditorProps) {
    if (this.state.editor) {
      let data = this.state.editor.getData();
      if (props.data !== data) {
        this.state.editor.setData(props.data ? props.data : "");
      }
    }
  }

  replaceHtml = (className: string, text: string, newText: string) => {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i);
      if (element) {
        if (element.textContent === text) {
          element.innerHTML = newText;
        }
      }
    }
  };

  handleOnInit = (editor: any) => {
    console.log(666)
    editor.locale.contentLanguageDirection = "";
    editor.execute("alignment", { value: "justify" });

    const { current } = this.state.ref;
    if (current) {
      current.appendChild(editor.ui.view.toolbar.element);
    }

    this.replaceHtml("ck-button__label", "Remove color", "Remove colour");
    this.replaceHtml("ck-tooltip__text", "Remove color", "Remove colour");

    this.setState({ ...this.state, editor });

    // listen to wiris events
    const windowRef = window as any;
    const wirisBeforeInsertionListener = windowRef.WirisPlugin.Listeners.newListener(
      "onBeforeFormulaInsertion",
      (res: any) => {
        this.setState({ ...this.state, isWirisInserting: true });
      }
    );
    var wirisAfterInsertionListener = windowRef.WirisPlugin.Listeners.newListener(
      "onAfterFormulaInsertion",
      (res: any) => {
        this.setState({ ...this.state, isWirisInserting: false });
      }
    );
    windowRef.WirisPlugin.Core.addGlobalListener(wirisBeforeInsertionListener);
    windowRef.WirisPlugin.Core.addGlobalListener(wirisAfterInsertionListener);
  };

  render() {
    let config = {
      extraPlugins: [UploadImageCustom],
      plugins: [
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Strikethrough,
        Superscript,
        Subscript,
        FontColor,
        List,
        MathType,
        Alignment,
        Table,
        TableToolbar,
        Image,
      ],
      fontColor: {
        colors: [
          {
            color: "#C43C30",
            label: "Red",
          },
          {
            color: "#0681DB",
            label: "Blue",
          },
          {
            color: "#30C474",
            label: "Green",
          },
        ],
      },
      toolbar: [
        "bold",
        "italic",
        "fontColor",
        "superscript",
        "uploadImageCustom",
        "mathType",
        "chemType",
        "bulletedList",
        "numberedList",
      ],
      mediaEmbed: { previewsInData: true },
      placeholder: "",
    };

    /* MediaEmbed plugin enables media links in editor */
    if (this.props.mediaEmbed) {
      config.plugins.push(MediaEmbed);
      config.toolbar.push("mediaEmbed");
    }

    if (this.props.toolbar) {
      config.toolbar = this.props.toolbar;
    }
    if (this.props.placeholder) {
      config.placeholder = this.props.placeholder;
    }

    let className = "document-editor";
    if (this.props.validationRequired && !this.state.data) {
      className += " content-invalid";
    }

    return (
      <div className={className}>
        <div ref={this.state.ref} />
        <CKEditor
          data={this.state.data}
          disabled={this.props.disabled}
          editor={ClassicEditor}
          config={config}
          onInit={(e: any) => this.handleOnInit(e)}
          onChange={(e: any, editor: any) => {
            if (!this.state.focused && !this.state.isWirisInserting) {
              return;
            }
            const data = editor.getData();
            this.props.onChange(data);
            this.replaceHtml("ck-label", "Document colors", "Document colours");
            this.setState({ ...this.state, data });
          }}
          onFocus={() => {
            this.setState({ ...this.state, focused: true });
          }}
          onBlur={() => {
            this.setState({ ...this.state, focused: false });
            this.props.onBlur();
          }}
        />
      </div>
    );
  }
}

export default DocumentWirisEditorComponent;
