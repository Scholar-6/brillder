import React from 'react'
import DocumentCKEditor from 'components/baseComponents/DocumentEditor';

import './SynthesisPage.scss';
import { Grid, Button } from '@material-ui/core';


export interface SynthesisProps {
  synthesis: string;
  onSynthesisChange(text: string): void
  onReview(): void
}

const SynthesisPage: React.FC<SynthesisProps> = ({ synthesis, onSynthesisChange, onReview }) => {
  document.title = "Synthesis";

  return (
    <div className="question-type synthesis-page">
      <div className="inner-question-type">
        <Grid container direction="row">
          <Grid item md={9}>
            <DocumentCKEditor data={synthesis} placeholder="" onChange={onSynthesisChange} />
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
