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
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';


import './DocumentEditor.scss';


const editorConfiguration = {
  plugins: [ Essentials, Bold, Italic, Paragraph ],
  toolbar: [ 'bold', 'italic' ]
};

export interface DocumentEditorProps {
  data: string,
  config?: any,
  placeholder: string,
  onChange(data: string): void,
}

interface DocumentEditorState {
  data: string,
  focused: boolean,
  editor: any,
  ref: any,
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

  componentWillReceiveProps(props: DocumentEditorProps) {
    if (this.state.editor) {
      let data = this.state.editor.getData();
      if (props.data !== data) {
        this.state.editor.setData(props.data ? props.data : '');
      }
    }
  }

  handleOnInit = (editor: any) => {
    const {current} = this.state.ref;
    if (current) {
      current.appendChild(editor.ui.view.toolbar.element);
    }
    this.setState({...this.state, editor});
  }

  render() {
    let config = {
      placeholder: this.props.placeholder,
      fontColor: {
        colors: [{
          color: '#C43C30',
          label: 'Red'
        }, {
          color: '#0681DB',
          label: 'Blue'
        }, {
          color: '#30C474',
          label: 'Green'
        }]
      },
      toolbar: ['bold', 'italic', 'fontColor', 'bulletedList', 'numberedList'],
      mediaEmbed: { previewsInData: true }
    }
    if (this.props.config) {
      config = this.props.config;
    }
    return (
      <div className="document-editor">
        <div ref={this.state.ref} />
        <CKEditor
          data={this.state.data}
          editor={ClassicEditor}
          config={editorConfiguration}
          onInit={(e:any) => this.handleOnInit(e)}
          onChange={(e: any, editor: any) => {
            if (!this.state.focused) {
              return;
            }
            const data = editor.getData();
            this.props.onChange(data);
            this.setState({...this.state, data});
          }}
          onFocus={() => {
            this.setState({...this.state, focused: true });
          }}
          onBlur={() => {
            this.setState({...this.state, focused: false });
          }}
        />
      </div>
    );
  }
}

export default DocumentEditorComponent
