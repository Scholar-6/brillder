import React from 'react'

import './SynthesisPage.scss';
import { Grid, Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';


export interface SynthesisProps {
  onSynthesisChange(text: string): void
  goBack(): void
}

const SynthesisPage: React.FC<SynthesisProps> = ({ onSynthesisChange, goBack }) => {
  document.title = "Synthesis";

  return (
    <div className="question-type synthesis-page">
      <div className="inner-question-type">
        <Grid container direction="row">
          <Grid item md={9}>
            <textarea
              placeholder="Synthesis"
              onChange={(e) => onSynthesisChange(e.target.value)}></textarea>
          </Grid>
          <Grid container item md={3}>
            <div style={{width: '100%'}}>
              <div className="finish-text">Finished?</div>
              <div style={{textAlign: 'center'}}>
                <Button className="edit-proposal-button" onClick={() => {}}>
                  <EditIcon className="edit-icon"/>
                  Edit Proposal
                </Button>
              </div>
              <div style={{textAlign: 'center'}}>
                <Button className="submit-button" onClick={() => {}}>
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
