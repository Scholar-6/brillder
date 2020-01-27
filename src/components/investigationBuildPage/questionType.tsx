import React from 'react'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Grid, Slider } from '@material-ui/core';

import HorizontalStepper from './horizontalStepper/horizontalStepper';


export interface QuestionTypeProps { }

const QuestionTypePage: React.FC<QuestionTypeProps> = () => {
  return (
    <div>
      <Grid container direction="row">
        <Grid container className="left-sidebar sidebar" justify="center" item xs={2} sm={1}>
        </Grid>
        <Grid container item xs={8} sm={10}>
          <Grid container direction="row">
            <Grid xs={1} sm={2} item md={3}></Grid>
            <Grid container justify="center" item xs={10} sm={8} md={6} className="question">
              <Grid container direction="row">
                <div className="question-title">Geomorfology</div>
              </Grid>
              <Grid container direction="row" className="drop-box">
              </Grid>
              <Grid container direction="row" className="drop-box">
              </Grid>
            </Grid>
          </Grid>
          <br />
        </Grid>
        <Grid container className="right-sidebar sidebar" item xs={2} sm={1}>
        </Grid>
      </Grid>
      <Grid container direction="row" className="page-fotter">
        <Grid container item xs={4} sm={7} md={8} lg={9}></Grid>
        <Grid container item xs={7} sm={4} md={3} lg={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <RemoveIcon className="white" color="inherit" />
            </Grid>
            <Grid item xs>
              <Slider className="white" aria-labelledby="continuous-slider" />
            </Grid>
            <Grid item>
              <AddIcon className="white" color="inherit" />
            </Grid>
            <Grid item className="percentages">
              55 %
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default QuestionTypePage
