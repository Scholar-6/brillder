import React from "react";

import './PairMatchPreview.scss';
import { Grid } from "@material-ui/core";


const PairMatchPreview: React.FC<any> = () => {
  return (
    <div className="phone-preview-component pairmatch-preview">
      <Grid container justify="center" className="small-text">
        A small number of words in the
        scene are no longer in current
        use. See if you can match each to
        its correct definition.
      </Grid>
      <div className="jj-pair-content">
        <div className="jj-pair-option-col">
          <div>festinate (adj.)</div>
          <div>questrist (n.)</div>
          <div>corky (adj.)</div>
          <div>pinion (v.)</div>
        </div>
        <div className="jj-pair-answer-col">
          <div className="jj-fourth"><span>bind the arms so they cannot move</span></div>
          <div className="jj-third"><span>old and spoilt, gone off</span></div>
          <div className="jj-first"><span>speedy</span></div>
          <div className="jj-second"><span>seeker or pursuer</span></div>
        </div>
      </div>
    </div>
  )
}

export default PairMatchPreview;
