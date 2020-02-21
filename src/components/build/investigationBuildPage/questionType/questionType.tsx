import React from 'react'
import { Grid, Box } from '@material-ui/core';

import './questionType.scss';
import { QuestionType, QuestionTypeEnum } from 'components/model/question';


export interface QuestionTypeProps {
  questionType: QuestionTypeEnum,
  history: any,
  setQuestionType: Function
}

function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

function getTextPreview(type: string) {
  return SplitByCapitalLetters(type).toUpperCase();
}

const QuestionTypePage: React.FC<QuestionTypeProps> = ({ questionType, setQuestionType, history }: QuestionTypeProps) => {
  if (questionType != null) {
    // history.push('build/brick/2/build/investigation/question-component/1');
  }
  let typeArray: string[] = Object.keys(QuestionType);

  document.title = "Select First Question Type";

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
              <Grid item xs={6} sm={4} md={4} key={i}>
                <Box className={`question-container ${className}`} onClick={() => setType(type)}>
                  <div className="link-description">
                    {getTextPreview(typeName)}
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
