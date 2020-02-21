import React from 'react'
import { Grid, Box } from '@material-ui/core';
import { QuestionTypeEnum } from 'components/model/question';


export interface TypeButtonProps {
  labels: string[],
  isActive: boolean,
  activeType: QuestionTypeEnum,
  questionType: QuestionTypeEnum,
}

const QuestionTypePage: React.FC<TypeButtonProps> = ({ labels, activeType, questionType }) => {
  const renderLabel = (label: string, i:number) => {
    return (
      <Grid container justify="center" direction="row" key={i} className="link-description">
        {label}
      </Grid>
    )
  };

  let className = "";
  if (activeType === questionType) {
    className = "active";
  }
  return (
    <Box className={`question-container ${className}`}>
      <Grid container justify="center" style={{height: '100%'}} alignContent="center">
        {
          labels.map((label:string, i:number) => renderLabel(label, i + 1))
        }
      </Grid>
    </Box>
  );
}

export default QuestionTypePage
