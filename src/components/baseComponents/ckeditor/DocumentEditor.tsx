import React from 'react'
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// @ts-ignore
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// @ts-ignore
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// @ts-ignore
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// @ts-ignore
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
// @ts-ignore
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
// @ts-ignore
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
// @ts-ignore
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// @ts-ignore
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
// @ts-ignore
import List from '@ckeditor/ckeditor5-list/src/list';
// @ts-ignore
import MathType from '@wiris/mathtype-ckeditor5/src/plugin';
// @ts-ignore
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
// @ts-ignore
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
// @ts-ignore
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
// @ts-ignore
import { addToolbarToDropdown, createDropdown } from "@ckeditor/ckeditor5-ui/src/dropdown/utils";
// @ts-ignore
import SplitButtonView from "@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview";
// @ts-ignore
import Table from '@ckeditor/ckeditor5-table/src/table';
// @ts-ignore
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import colors from './colors';

import './DocumentEditor.scss';
import LatexCustom from './LatexCustom';

export interface DocumentEditorProps {
  data: string;
  disabled?: boolean;
  toolbar?: any;
  placeholder?: string;
  mediaEmbed?: boolean;
  colorsExpanded?: boolean;
  defaultAlignment?: string;
  validationRequired?: boolean;
  onBlur(): void;
  onChange(data: string): void;
}

interface DocumentEditorState {
  data: string;
  focused: boolean;
  editor: any;
  ref: any;
}

class InsertDropDown extends Plugin {
  editor: any = null;
  constructor( editor:any ) {
    super(editor);
    this.editor = editor;
  }

  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add("InsertDropDown", (locale:any) => {
      const dropdownView = createDropdown(locale, SplitButtonView);
      dropdownView.class="ck-custom-dropdown";
      const buttons:any[] = [];
      buttons.push(editor.ui.componentFactory.create('subscript'));
      buttons.push(editor.ui.componentFactory.create('strikethrough'));
      addToolbarToDropdown(dropdownView, buttons);
      return dropdownView;
    });
  }
}

class DocumentEditorComponent extends React.Component<DocumentEditorProps, DocumentEditorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: props.data,
      focused: false,
      editor: null,
      ref: React.createRef()
    }
  }

  UNSAFE_componentWillReceiveProps(props: DocumentEditorProps) {
    if (this.state.editor) {
      let data = this.state.editor.getData();
      if (props.data !== data) {
        this.state.editor.setData(props.data ? props.data : '');
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
  }

  handleOnInit = (editor: any) => {
    editor.locale.contentLanguageDirection = '';
    editor.execute( 'alignment', { value: 'justify' } );

    const {current} = this.state.ref;
    if (current) {
      current.appendChild(editor.ui.view.toolbar.element);
    }

    this.replaceHtml("ck-button__label", "Remove color", "Remove colour");
    this.replaceHtml("ck-tooltip__text", "Remove color", "Remove colour");
    
    this.setState({...this.state, editor});
  }

  render() {
    let config = {
      extraPlugins: [InsertDropDown, LatexCustom],
      plugins: [
        Essentials, Paragraph,
        Bold, Italic, Strikethrough, Superscript, Subscript,
        FontColor, List, MathType, Alignment,
        Table, TableToolbar
      ],
      fontColor: {
        colors: this.props.colorsExpanded ? colors.expandedColors : colors.baseColors
      },
      toolbar: [
        'bold', 'italic', 'fontColor', 'superscript', 'insertDropDown',
        'bulletedList', 'numberedList', 'latex'
      ],
      mediaEmbed: { previewsInData: true },
      toolbarCanCollapse: false,
      placeholder: ''
    };

    /* MediaEmbed plugin enables media links in editor */
    if (this.props.mediaEmbed) {
      config.plugins.push(MediaEmbed);
      config.toolbar.push('mediaEmbed');
    }

    if (this.props.toolbar) {
      config.toolbar = this.props.toolbar;
    }
    if (this.props.placeholder) {
      config.placeholder = this.props.placeholder;
    }

    let className="document-editor";
    if (this.props.validationRequired && !this.state.data) {
      className+=" content-invalid";
    }

    return (
      <div className={className}>
        <div ref={this.state.ref} />
        <CKEditor
          disabled={this.props.disabled ? true : false}
          data={this.state.data}
          editor={ClassicEditor}
          config={config}
          onInit={(e:any) => this.handleOnInit(e)}
          onChange={(e: any, editor: any) => {
            if (!this.state.focused) { return; }
            const data = editor.getData();
            this.props.onChange(data);
            this.replaceHtml("ck-label", "Document colors", "Document colours");
            this.setState({...this.state, data});
          }}
          onFocus={() => {
            this.setState({...this.state, focused: true });
          }}
          onBlur={() => {
            this.setState({...this.state, focused: false });
            this.props.onBlur();
          }}
        />
      </div>
    );
  }
}

export default DocumentEditorComponent
