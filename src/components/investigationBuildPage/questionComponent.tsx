import React from 'react'

import { Grid } from '@material-ui/core';

import HorizontalStepper from './horizontalStepper/horizontalStepper';
import { QuestionTypeEnum } from '../model/question';

export interface QuestionProps {
  type: QuestionTypeEnum
}

const QuestionComponent: React.FC<QuestionProps> = ({ type }) => {
  return (
    <Grid container item xs={8} sm={10}>
      <Grid container direction="row">
        <Grid container justify="center" item xs={12}>
          <HorizontalStepper />
        </Grid>
      </Grid>
      <br />
    </Grid>
  );
}

export default QuestionComponent
