import React from 'react'
import { Grid, Box } from '@material-ui/core';

import './questionType.scss';
import { QuestionType } from '../../model/question';


export interface QuestionTypeProps {
  history: any,
  questionType: number,
  questionNumber: number
}

function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

const QuestionTypePage: React.FC<QuestionTypeProps> = ({ history, questionType, questionNumber }: QuestionTypeProps) => {
  let typeArray: string[] = Object.keys(QuestionType);
  typeArray = typeArray.map(SplitByCapitalLetters)

  function addQuestion() {
    history.push(`/build/investigation/question-component/${questionNumber}`);
  }

  return (
    <div className="question-type">
      <Grid container direction="row" justify="center" className="card-description">
        Choose question type...
      </Grid>
      <Grid container direction="row">
        {
          typeArray.map((item, i) => {
            return (
              <Grid xs={3} item key={i}>
                <Box className="question-container" onClick={addQuestion}>
                  <div className="link-description">{item}</div>
                </Box>
              </Grid>
            );
          })
        }
      </Grid>
    </div>
  );
}

export default QuestionTypePage
