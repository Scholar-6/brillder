import React from 'react'
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './Text.scss'

export interface TextComponentProps {
  locked: boolean
  index: number
  data: any
  updateComponent(component: any, index: number): void
}

const TextComponent: React.FC<TextComponentProps> = ({locked, index, data, updateComponent}) => {
  if (!data.value) {
    data.value = "";
  }

  let isBuilding = true;

  return (
    <div className="question-build-text-editor">
      <CKEditor
        editor={ClassicEditor}
        data={data.value}
        disabled={locked}
        config={{toolbar: ['bold']}}
        onChange={(e: any, editor: any) => {
          if (isBuilding) {
            isBuilding= false;
            return;
          }
          let value = editor.getData();
          let comp = Object.assign({}, data);
          comp.value = value;
          updateComponent(comp, index);
        }}
      />
    </div>
  );
}

export default TextComponent
