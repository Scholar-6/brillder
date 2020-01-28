import React from 'react'
import { Grid, Box } from '@material-ui/core';

import './questionType.scss';
import { QuestionType, QuestionTypeEnum } from '../../model/question';


export interface QuestionTypeProps {
  questionType: QuestionTypeEnum,
  setQuestionType: Function
}

function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

const QuestionTypePage: React.FC<QuestionTypeProps> = ({ questionType, setQuestionType }: QuestionTypeProps) => {
  let typeArray: string[] = Object.keys(QuestionType);

  const setType = (type: QuestionTypeEnum) => {
    setQuestionType(type);
  }

  return (
    <div className="question-type">
      <Grid container direction="row" justify="center" className="card-description">
        Choose question type...
      </Grid>
      <Grid container direction="row">
        {
          typeArray.map((typeName, i) => {
            const type = QuestionType[typeName] as QuestionTypeEnum;
            let className = "";
            if (type === questionType) {
              className = "active";
            }

            return (
              <Grid xs={3} item key={i}>
                <Box className={`question-container ${className}`} onClick={() => setType(type)}>
                  <div className="link-description">
                    {SplitByCapitalLetters(typeName)}
                  </div>
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
