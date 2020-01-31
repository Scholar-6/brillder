import React from 'react'

import { Grid } from '@material-ui/core';

import ShortAnswer from './shortAnswer/shortAnswer';

import './buildQuestionComponent.scss'
import { QuestionTypeEnum, QuestionComponentTypeEnum, Question } from '../../model/question';
import DragBox from './components/DragBox';


export interface QuestionProps {
  question: Question,
  history: any,
  setQuestionComponentType: Function,
  swapComponents: Function,
}

const BuildQuestionComponent: React.FC<QuestionProps> = ({ question, history, setQuestionComponentType, swapComponents }) => {
  const {type} = question;
  document.title = QuestionTypeEnum[type];
  const renderQuestion = () => {
    switch (type) {
      case (QuestionTypeEnum.ShortAnswer):
        return <ShortAnswer activeStep={1} question={question} swapComponents={swapComponents} />
      default:
        history.push('/build/investigation/question');
    }
    return "";
  }

  const setDropBoxItem = (dragBoxType:QuestionTypeEnum, dropBoxNumber:number) => {
    setQuestionComponentType(dragBoxType, dropBoxNumber);
  }

  return (
    <div style={{width: '100%'}}>
    <Grid container justify="center" className="build-question-column" item xs={12}>
      <Grid container direction="row">
        <Grid container item xs={4} sm={3} md={2} className="left-sidebar">
          <DragBox onDrop={setDropBoxItem} name="Text" value={QuestionComponentTypeEnum.Text} />
          <DragBox onDrop={setDropBoxItem} name="Hint" value={QuestionComponentTypeEnum.Hint} />
          <DragBox onDrop={setDropBoxItem} name="Quote" value={QuestionComponentTypeEnum.Quote} />  
          <DragBox onDrop={setDropBoxItem} name="Image" value={QuestionComponentTypeEnum.Image} />
          <DragBox onDrop={setDropBoxItem} name="Sound" value={QuestionComponentTypeEnum.Sound} />
          <DragBox onDrop={setDropBoxItem} name="Equation" value={QuestionComponentTypeEnum.Equation} />
        </Grid>
        <Grid container item xs={5} sm={6} md={8}>
          {
            renderQuestion()
          }
        </Grid>
        <Grid container item xs={3} sm={3} md={2} className="right-sidebar">
          <div>
            <button>Come back later</button>
            <button>Submit brick</button>
          </div>
        </Grid>
      </Grid>
    </Grid>
    <div className="build-question-fotter">
        Saved at 5:19pm
        <button>Save Anyway</button>
        Time Spent Building brick: 4hrs
      </div>
    </div>
  );
}

export default BuildQuestionComponent
