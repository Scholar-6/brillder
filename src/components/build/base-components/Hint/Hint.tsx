
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox'; 

import './Hint.scss';
import { Grid, FormControlLabel } from '@material-ui/core';


const HintComponent: React.FC<any> = () => {
  return (
    <div className="hint-component">
      <Grid container justify="space-between" xs={12}>
        <span className="hint-type">Hint Type* <span className="question-mark">?</span></span>
        <FormControlLabel
          control= {
            <Checkbox />
          }
          label="All Answers"
        />
        <FormControlLabel
          control= {
            <Checkbox />
          }
          label="Each Answer"
        />
      </Grid>
      <Grid container justify="space-between" xs={12}>
        <input className="hint-input-text" placeholder="Enter Hint..."></input>
      </Grid>
    </div>
  );
}

export default HintComponent
