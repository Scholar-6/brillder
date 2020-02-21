import React from 'react'
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// @ts-ignore
import MathType from '@wiris/mathtype-ckeditor5';

import './Equation.scss'

export interface EquationComponentProps {
  index: number,
  data: any,
  cleanComponent(): void
  updateComponent(component: any, index: number): void
}

const editorConfiguration = {
  plugins: [ MathType ],
  toolbar: ['MathType', 'ChemType']
};

const EquationComponent: React.FC<EquationComponentProps> = ({index, data, cleanComponent, updateComponent}) => {
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

export default EquationComponent
