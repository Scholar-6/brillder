import React from 'react'
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './SynthesisPage.scss';
import { Grid, Button } from '@material-ui/core';


export interface SynthesisProps {
  synthesis: string;
  onSynthesisChange(text: string): void
  onReview(): void
}

const editorConfiguration = {
  toolbar: ['bold', 'italic', 'bulletedList', 'numberedList']
};

const SynthesisPage: React.FC<SynthesisProps> = ({ synthesis, onSynthesisChange, onReview }) => {
  document.title = "Synthesis";

  return (
    <div className="question-type synthesis-page">
      <div className="inner-question-type">
        <Grid container direction="row">
          <Grid item md={9}>
            <CKEditor
              editor={ClassicEditor}
              data={synthesis}
              className="ckeditor-synthesis"
              config={editorConfiguration}
              onChange={(e: any, editor: any) => {
                const value = editor.getData();
                onSynthesisChange(value);
              }}
            />
          </Grid>
          <Grid container item md={3}>
            <div style={{width: '100%'}}>
              <div className="finish-text">Finished?</div>
              <div style={{textAlign: 'center'}}>
                <Button className="submit-button" onClick={() => onReview()}>
                  <div>
                    <div>Review</div>
                    <div>&</div>
                    <div>Submit</div>
                  </div>
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default SynthesisPage
