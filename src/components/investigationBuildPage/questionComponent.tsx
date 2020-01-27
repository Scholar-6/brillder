import React from 'react'

import { Grid } from '@material-ui/core';

import ShortAnswer from './horizontalStepper/shortAnswer/shortAnswer';
import { QuestionTypeEnum } from '../model/question';

export interface QuestionProps {
  type: QuestionTypeEnum
}

const QuestionComponent: React.FC<QuestionProps> = ({ type }) => {
  return (
    <Grid container item xs={8} sm={10}>
      <Grid container direction="row">
        <Grid container justify="center" item xs={12}>
          <ShortAnswer activeStep={1} />
        </Grid>
      </Grid>
      <br />
    </Grid>
  );
}

export default QuestionComponent
