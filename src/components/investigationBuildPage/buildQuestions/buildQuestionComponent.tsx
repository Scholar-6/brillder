import React from 'react'
import { Grid } from '@material-ui/core';

import QuestionComponents from './questionComponents/questionComponents';
import './buildQuestionComponent.scss'
import { QuestionTypeEnum, QuestionComponentTypeEnum, Question } from '../../model/question';
import DragBox from './drag/dragBox';


export interface QuestionProps {
  brickId: number
  question: Question
  history: any
  setQuestionComponentType: Function
  addComponent: Function
  swapComponents: Function
  saveBrick(): void
  updateComponent(component: any, index:number): void
}

const BuildQuestionComponent: React.FC<QuestionProps> = (
  { brickId, question, history, setQuestionComponentType, swapComponents, saveBrick, updateComponent, addComponent }
) => {
  const { type } = question;
  document.title = QuestionTypeEnum[type];

  const setDropBoxItem = (dragBoxType: QuestionTypeEnum, dropBoxNumber: number) => {
    setQuestionComponentType(dragBoxType, dropBoxNumber);
  }

  const submitBrick = () => {
    saveBrick();
    history.push("/");
  }

  const move = () => {
    history.push("/");
  }

  return (
    <div style={{ width: '100%' }}>
      <Grid container justify="center" className="build-question-column" item xs={12}>
        <Grid container direction="row" className="first-row">
          <Grid container item xs={5} sm={6}></Grid>
          <Grid container item xs={4} sm={3}>Build Time: 0hrs15mins.</Grid>
          <Grid container item xs={3} sm={3}>Saved at 17:51</Grid>
        </Grid>
        <Grid container direction="row">
          <Grid container item xs={4} sm={3} md={3} className="left-sidebar">
            <DragBox onDrop={setDropBoxItem} name="Text" value={QuestionComponentTypeEnum.Text} />
            <DragBox onDrop={setDropBoxItem} name="Quote" value={QuestionComponentTypeEnum.Quote} />
            <DragBox onDrop={setDropBoxItem} name="Image" value={QuestionComponentTypeEnum.Image} />
            <DragBox onDrop={setDropBoxItem} name="Sound" value={QuestionComponentTypeEnum.Sound} />
            <DragBox onDrop={setDropBoxItem} name="Equation" value={QuestionComponentTypeEnum.Equation} />
          </Grid>
          <Grid container item xs={5} sm={6} md={6} className="question-components-list">
            <QuestionComponents brickId={brickId} history={history} question={question} swapComponents={swapComponents} updateComponent={updateComponent} addComponent={addComponent} />
          </Grid>
          <Grid container item xs={3} sm={3} md={3} className="right-sidebar">
            <div>
              <button onClick={submitBrick}>Review and Submit</button>
            </div>
            <Grid justify="center" container direction="row">
              <Grid container item sm={6}>
                <p>Is the Order in the brick sequence of this Question important?</p>
              </Grid>
            </Grid>
            <div>
              <p>Lock changes to this question?</p>
            </div>
            <div>
              <p>Add New Question</p>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <div className="build-question-fotter">
        Saved at 5:19pm
      <button onClick={saveBrick}>Save Anyway</button>
        Time Spent Building brick: 4hrs
      </div>
    </div>
  );
}

export default BuildQuestionComponent
