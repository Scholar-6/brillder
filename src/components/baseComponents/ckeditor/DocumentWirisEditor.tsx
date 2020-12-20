import React, { Component } from "react";
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
import Link from '@ckeditor/ckeditor5-link/src/link';
// @ts-ignore
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink';
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
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
// @ts-ignore
import BlockQuoteUI from "@ckeditor/ckeditor5-block-quote/src/blockquoteui";
// @ts-ignore
import Image from "@ckeditor/ckeditor5-image/src/image";
// @ts-ignore
import UpcastWriter from "@ckeditor/ckeditor5-engine/src/view/upcastwriter";
import "./DocumentEditor.scss";
import UploadImageCustom from './UploadImageCustom';
import colors from './colors';
import LatexCustom from "./LatexCustom";

export interface DocumentWEditorProps {
  disabled: boolean;
  editOnly?: boolean;
  data: string;
  toolbar?: any;
  placeholder?: string;
  mediaEmbed?: boolean;
  link?: boolean;
  blockQuote?: boolean;
  defaultAlignment?: string;
  isValid?: boolean | null;
  validationRequired?: boolean;
  colorsExpanded?: boolean;
  onBlur(): void;
  onChange(data: string): void;

  uploadStarted?(): void;
  uploadFinished?(): void;
}

interface DocumentWEditorState {
  data: string;
  focused: boolean;
  editor: any;
  ref: any;
  isWirisInserting: boolean;
}

class DocumentWirisEditorComponent extends Component<DocumentWEditorProps, DocumentWEditorState> {
  constructor(props: DocumentWEditorProps) {
    super(props);
    this.state = {
      data: props.data,
      focused: false,
      editor: null,
      ref: React.createRef(),
      isWirisInserting: false,
    };
  }

  componentDidUpdate() {
    if (this.state.editor) {
      const {props} = this;
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
        console.log(res)
        this.setState({ ...this.state, isWirisInserting: false });
      }
    );
    windowRef.WirisPlugin.Core.addGlobalListener(wirisBeforeInsertionListener);
    windowRef.WirisPlugin.Core.addGlobalListener(wirisAfterInsertionListener);

    editor.on("comment-update", () => {
      const data = editor.getData();
      this.props.onChange(data);
      this.replaceHtml("ck-label", "Document colors", "Document colours");
      this.setState({ ...this.state, data });
    })
    
    // get uploading status
    editor.commands.add('uploading', {
      props: this.props,
      execute() {
        if (this.props.uploadStarted) {
          console.log('upload started')
          this.props.uploadStarted();
        }
      },
      destroy() {}
    });
    editor.commands.add('uploaded', {
      props: this.props,
      execute() {
        if (this.props.uploadFinished) {
          console.log('upload finished')
          this.props.uploadFinished();
        }
      },
      destroy() {}
    });

    const upcastWriter = new UpcastWriter();
    editor.plugins.get('Clipboard').on('inputTransformation', (evt: any, data: any) => {
      const frag = data.content;

      const convertTree = (node: any) => {
        if(node.is('element')) {
          upcastWriter.removeStyle('color', node);
          if(node.childCount > 0) {
            for(const child of node.getChildren()) {
              convertTree(child);
            }
          }
        }
      }

      for(const node of frag) {
        convertTree(node);
      }
    })
  };

  render() {
    let config = {
      extraPlugins: [UploadImageCustom, LatexCustom],
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
        colors: this.props.colorsExpanded ? colors.expandedColors : colors.baseColors
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
        "latex"
      ],
      mediaEmbed: { previewsInData: true },
      comments: { commentOnly: this.props.editOnly ?? false },
      link: {},
      placeholder: "",
    };

    /* MediaEmbed plugin enables media links in editor */
    if (this.props.mediaEmbed) {
      config.plugins.push(MediaEmbed);
      config.toolbar.push("mediaEmbed");
    }

    if (this.props.link) {
      config.plugins.push(Link);
      config.plugins.push(AutoLink);
      config.link = { addTargetToExternalLinks: true };
    }

    const mediaContentFix = (data: string, editorContent: any) => {
      let children = editorContent.children as any;
      let index = 0;
      for (let child of children) {
        if (child.tagName === 'FIGURE' && child.className === 'media') {
          // fix for media if video inserted
          // add paragraph before and after to enable entering text in editor
          if (index === 0) {
            editorContent.insertBefore(document.createElement('p'), child);
            if (children.length === 2) {
              editorContent.appendChild(document.createElement('p'));
            }
            data = editorContent.innerHTML;
          }
        }
        index++;
      }
      return data;
    }
    /* MediaEmbed plugin enables media links in editor */

    if (this.props.toolbar) {
      config.toolbar = this.props.toolbar;
    }
    if (this.props.blockQuote) {
      config.plugins.push(BlockQuote);
      config.plugins.push(BlockQuoteUI);
      config.toolbar.push("blockQuote");
    }
    if (this.props.placeholder) {
      config.placeholder = this.props.placeholder;
    }

    let className = "document-editor";
    if (this.props.validationRequired && !this.state.data) {
      className += " content-invalid";
    } else if (this.props.isValid === false) {
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
            let data = editor.getData();
            /* 9/24/2020 preparation for changing color of math jax
            try {
              let newRes = [];
              const res = parseDataToArray(data);
              for (let item of res) {
                if (isMathJax(item)) {
                  console.log(item);
                }
                newRes.push(item);
              }
            } catch { }
            */

            let editorContent = document.createElement('div');
            editorContent.innerHTML = data;
            data = mediaContentFix(data, editorContent);
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
