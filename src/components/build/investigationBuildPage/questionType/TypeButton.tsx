import React from 'react'
import { Grid, Box } from '@material-ui/core';
import { QuestionTypeEnum } from 'model/question';


export interface TypeButtonProps {
  labels: string[],
  isActive: boolean,
  activeType: QuestionTypeEnum,
  questionType: QuestionTypeEnum,
  onMouseEnter(type: QuestionTypeEnum): void
  onMouseLeave(): void
  setType(e: any): void,
}

const QuestionTypePage: React.FC<TypeButtonProps> = ({
  labels, activeType, questionType, setType, onMouseEnter, onMouseLeave
}) => {
  const renderLabel = (label: string, i:number) => {
    return (
      <Grid
        container
        justify="center"
        direction="row"
        className="link-description"
        key={i}
        onMouseEnter={() => onMouseEnter(questionType)}
        onMouseLeave={onMouseLeave}
      >
        {label}
      </Grid>
    )
  };

  let className = "";
  if (activeType === questionType) {
    className = "active";
  }
  return (
    <Box className={`question-container ${className}`} onClick={() => setType(questionType) }>
      <Grid container justify="center" style={{height: '100%'}} alignContent="center">
        {
          labels.map((label:string, i:number) => renderLabel(label, i + 1))
        }
      </Grid>
    </Box>
  );
}

export default QuestionTypePage
