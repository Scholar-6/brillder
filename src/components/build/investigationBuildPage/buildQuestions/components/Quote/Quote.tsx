import React from 'react'
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './Quote.scss'
import { Grid } from '@material-ui/core';


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
      <CKEditor
        editor={ClassicEditor}
        data={data.value}
        disabled={locked}
        config={editorConfiguration}
        onChange={(e: any, editor: any) => {
          data.value = editor.getData();
          updateComponent(data, index);
        }}
      />
      <Grid className="text-label" container justify="center">
        Quote
      </Grid>
    </div>
  );
}

export default QuoteComponent
