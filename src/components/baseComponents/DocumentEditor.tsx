import React from 'react'
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import './DocumentEditor.scss';


export interface DocumentEditorProps {
  data: string,
  placeholder: string,
  onChange(data: string): void,
}

interface DocumentEditorState {
  data: string,
  focused: boolean,
  ref: any,
}

class DocumentEditorComponent extends React.Component<DocumentEditorProps, DocumentEditorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: props.data,
      focused: false,
      ref: React.createRef()
    }
  }

  handleOnInit = (editor: any) => {
    const {current} = this.state.ref;
    if (current) {
      current.appendChild( editor.ui.view.toolbar.element);
    }
  }

  render() {
    return (
      <div className="document-editor">
        <div ref={this.state.ref} />
        <CKEditor
          data={this.state.data}
          editor={DecoupledEditor}
          config={{
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
          }}
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
