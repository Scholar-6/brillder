import React from 'react'
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './Text.scss'

export interface TextComponentProps {
  index: number,
  data: any,
  updateComponent(component: any, index: number): void
}

const editorConfiguration = {
  toolbar: ['bold']
};

const TextComponent: React.FC<TextComponentProps> = ({index, data, updateComponent}) => {
  if (!data.value) {
    data.value = "";
  }

  return (
    <div className="question-build-text-editor">
      <CKEditor
        editor={ClassicEditor}
        data={data.value}
        config={editorConfiguration}
        onInit={(editor: any) => {
        }}
        onChange={(event: any, editor: any) => {
          data.value = editor.getData();
          updateComponent(data, index);
        }}
        onBlur={(event: any, editor: any) => {
        }}
        onFocus={(event: any, editor: any) => {
        }}
      />
    </div>
  );
}

export default TextComponent
