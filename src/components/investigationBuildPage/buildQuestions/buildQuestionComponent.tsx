import React from 'react'

import { Grid } from '@material-ui/core';

import ShortAnswer from './shortAnswer/shortAnswer';

import './buildQuestionComponent.scss'
import { QuestionTypeEnum, QuestionType } from '../../model/question';


export interface QuestionProps {
  type: QuestionTypeEnum,
  history: any,
}

const BuildQuestionComponent: React.FC<QuestionProps> = ({ type, history }) => {
  console.log(type)
  const renderQuestion = () => {
    switch (type) {
      case (QuestionTypeEnum.ShortAnswer):
        return <ShortAnswer activeStep={1} />
      default:
        history.push('/build/investigation/question');
    }
    return "";
  }

  return (
    <Grid container justify="center" className="build-question-column" item xs={12}>
      {
        renderQuestion()
      }
    </Grid>
  );
}

export default BuildQuestionComponent
