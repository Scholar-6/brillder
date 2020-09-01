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
import FontBackgroundColor from "@ckeditor/ckeditor5-font/src/fontbackgroundcolor";
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
import UploadImageCustom from "./UploadImageCustom";
import { stripHtml } from "components/build/investigationBuildPage/questionService/ConvertService";
import { PlayMode } from "components/play/model";

export interface DocumentHighlightingEditorProps {
  data: string;
  mode: PlayMode;
  mediaEmbed?: boolean;
  onChange(data: string): void;
}

interface DocumentHighlightingEditorState {
  data: string;
  editor: any;
  isWirisInserting: boolean;
}

class DocumentHighlightComponent extends React.Component<
  DocumentHighlightingEditorProps,
  DocumentHighlightingEditorState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: props.data,
      editor: null,
      isWirisInserting: false,
    };
  }

  handleOnInit = (editor: any) => {
    this.setState({ ...this.state, editor });

    
/* 26/08/20 Changed how highlighting works.
    document.addEventListener('selectionchange', () => {
      const {mode} = this.props;
      if (mode === PlayMode.UnHighlighting) {
        editor.execute( 'fontBackgroundColor' );
      } else if (mode === PlayMode.Highlighting) {
        editor.execute( 'fontBackgroundColor', { value: '#F6B72D' } );
      }
    });
*/
    editor.editing.view.document.on('selectionChange', (evt: any, { newSelection }: any) => {
      if(newSelection.isBackward) {
        editor.execute( 'fontBackgroundColor' );
      } else {
        editor.execute( 'fontBackgroundColor', { value: '#F6B72D' } );
      }
    });

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
        FontBackgroundColor,
        MediaEmbed,
        Image,
      ],
      toolbar: [],
      mediaEmbed: { previewsInData: true },
      placeholder: "",
    };

    return (
      <div className="document-editor highlight-editor">
        <CKEditor
          data={this.state.data}
          editor={ClassicEditor}
          config={config}
          onInit={(e: any) => this.handleOnInit(e)}
          onChange={(e: any, editor: any) => {
            const newHtmlData = editor.getData();
            let newData = stripHtml(newHtmlData);
            let oldData = stripHtml(this.state.data);
            if (oldData === newData) {
              this.props.onChange(newHtmlData);
              this.setState({ ...this.state, data: newHtmlData });
            } else {
              editor.setData(this.state.data);
            }
          }}
        />
      </div>
    );
  }
}

export default DocumentHighlightComponent;
