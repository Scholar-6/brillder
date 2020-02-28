import React from 'react'
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './Quote.scss'

export interface QuoteComponentProps {
  locked: boolean
  index: number
  data: any
  updateComponent(component: any, index: number): void
}

const editorConfiguration = {
  toolbar: ['bold']
};

const QuoteComponent: React.FC<QuoteComponentProps> = ({locked, index, data, updateComponent}) => {
  if (!data.value) {
    data.value = "";
  }

  return (
    <div className="question-build-text-editor">
      <input placeholder="Enter Quote Here..."/>
    </div>
  );
}

export default QuoteComponent
