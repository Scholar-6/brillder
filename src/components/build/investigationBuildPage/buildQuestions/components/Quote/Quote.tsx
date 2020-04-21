import React, { useEffect } from 'react'

import './Quote.scss'
import { Grid } from '@material-ui/core';


declare var CKEDITOR: any;

export interface TextComponentProps {
  locked: boolean
  index: number
  data: any
  updateComponent(component: any, index: number): void
}

const QuoteComponent: React.FC<TextComponentProps> = (props) => {
  const id = "editor-" + new Date().getTime();
  const [created, setCreated] = React.useState(false);

  useEffect(() => {
    if (created === false) {
      var editor = CKEDITOR.replace(id, {
        toolbar: [
          { name: 'colors', items: [ 'TextColor' ] },
          { name: 'basicstyles', items: [ 'Bold', 'Italic' ] }
        ],
        height: 100
      });

      editor.setData(props.data.value);

      editor.on('change', (e:any) => {
        let comp = Object.assign({}, props.data);
        comp.value = e.editor.getData();
        props.updateComponent(comp, props.index);
      });
      setCreated(true);
    }
  }, [id, props, created]);

  return (
    <div className="question-build-quote-editor">
      <div className="text-label-container">
        <Grid className="text-label" container justify="center" alignContent="center">
          Quote
        </Grid>
      </div>
      <div id={id}></div>
    </div>
  );
}

export default QuoteComponent


/*
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
    <div className="question-build-quote-editor">
      <div className="text-label-container">
        <Grid className="text-label" container justify="center" alignContent="center">
          Quote
        </Grid>
      </div>
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
    </div>
  );
}

export default QuoteComponent
*/