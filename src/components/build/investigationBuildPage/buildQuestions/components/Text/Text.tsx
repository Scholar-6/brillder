import React from 'react'
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './Text.scss'

export interface TextComponentProps {
  index: number,
  data: any,
  cleanComponent(): void
  updateComponent(component: any, index: number): void
}

const editorConfiguration = {
  toolbar: ['bold']
};

const TextComponent: React.FC<TextComponentProps> = ({index, data, cleanComponent, updateComponent}) => {
  if (!data.value) {
    data.value = "";
  }

  return (
    <div className="question-build-text-editor">
      <CKEditor
        editor={ClassicEditor}
        data={data.value}
        config={editorConfiguration}
        onChange={(event: any, editor: any) => {
          data.value = editor.getData();
          updateComponent(data, index);
        }}
      />
    </div>
  );
}

export default TextComponent
