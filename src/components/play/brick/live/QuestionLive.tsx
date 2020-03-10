import React from 'react';
import { Fab, Grid, FormControlLabel } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import { Question, QuestionComponentTypeEnum } from "components/model/question";
import TextLive from './comp/TextLive';
import './QuestionLive.scss';


interface QuestionProps {
  question: Question;
  isLastOne: boolean;
  next(): void;
}


const QuestionLive: React.FC<QuestionProps> = ({ question, isLastOne, next }) => {

  const renderComponent = (component: any, index: number) => {
    if (component.type === QuestionComponentTypeEnum.Text) {
      return <TextLive component={component} />
    }
    return <div key={index}>Component</div>
  }

  let text = "Next - Don't panic, you can always come back"
  if (isLastOne) {
    text = "Finished - If you are done you are done"
  }

  return (
    <div>
      Question
      {question.components.map((component, index) => renderComponent(component, index))}
      <Grid container direction="row" justify="flex-end">
        <FormControlLabel
          className="next-question-button"
          labelPlacement="start"
          control={
            <Fab style={{ background: '#0076B4' }} color="secondary" aria-label="add" onClick={next}>
              <PlayArrowIcon />
            </Fab>
          }
          label={text}
        />
      </Grid>
    </div>
  )
}

export default QuestionLive;
