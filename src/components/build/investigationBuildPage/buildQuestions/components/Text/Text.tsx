import React, { useEffect } from 'react'

import './Text.scss'
import { Grid } from '@material-ui/core';


declare var CKEDITOR: any;

export interface TextComponentProps {
  locked: boolean
  index: number
  data: any
  updateComponent(component: any, index: number): void
}

const TextComponent: React.FC<TextComponentProps> = (props) => {
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
    <div className="question-build-text-editor">
      <div className="text-label-container">
        <Grid className="text-label" container justify="center" alignContent="center">
          Text
        </Grid>
      </div>
      <div id={id}></div>
    </div>
  );
}

export default TextComponent

/*
import React from 'react'
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './Text.scss'
import { Grid } from '@material-ui/core';

export interface TextComponentProps {
  locked: boolean
  index: number
  data: any
  updateComponent(component: any, index: number): void
}

const TextComponent: React.FC<TextComponentProps> = ({locked, index, data, updateComponent}) => {
  const [focused, setFocus] = React.useState(false);
  if (!data.value) {
    data.value = "";
  }

  return (
    <div className="question-build-text-editor">
      <div className="text-label-container">
        <Grid className="text-label" container justify="center" alignContent="center">
          Text
        </Grid>
      </div>
      <CKEditor
        editor={ClassicEditor}
        data={data.value}
        disabled={locked}
        config={{toolbar: ['bold']}}
        onChange={(e: any, editor: any) => {
          if (!focused) {
            return;
          }
          let value = editor.getData();
          let comp = Object.assign({}, data);
          comp.value = value;
          updateComponent(comp, index);
        }}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
      />
    </div>
  );
}

export default TextComponent
*/