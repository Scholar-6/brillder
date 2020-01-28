import React from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend'
import { Grid } from '@material-ui/core';
import update from 'immutability-helper';

import './investigationBuildPage.scss'
import BuildPageHeaderComponent from './header/pageHeader';
import QuestionComponent from './questionComponent';
import QuestionTypePage from './questionType/questionType';
import DragBox from './DragBox';
import BuildFotter from './build-fotter';
import DragableTabs from './dragTabs/dragableTabs';
import { Question } from '../model/question';


interface InvestigationBuildProps extends RouteComponentProps<any> {
  fetchBrick: Function,
  fetchProForma: Function
}

const InvestigationBuildPage: React.FC<InvestigationBuildProps> = ({ history }: any) => {
  const [value, setValue] = React.useState(0);
  const [questions, setQuestions] = React.useState([{ id: 1, type: 0, active: true }] as Question[])
  var questionType = questions[value].type;

  const createNewQuestion = () => {
    const updatedQuestions = questions.slice();
    updatedQuestions.forEach(q => q.active = false);
    updatedQuestions.push({ id: questions.length + 1, type: 0, active: true });

    setQuestions(update(questions, {
      $set: updatedQuestions,
    }));
  }

  const moveQuestions = (dragIndex: number, hoverIndex: number, dragQuestion: any) => {
    setQuestions(
      update(questions, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragQuestion],
        ],
      }),
    )
  }

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      alert("You can`t delete last question");
      return;
    }
    if (index !== 0) {
      setQuestions(
        update(questions, {
          $splice: [
            [index, 1]
          ],
          0: {
            active: {
              $set: true
            }
          }
        }),
      )
    } else {
      setQuestions(
        update(questions, {
          $splice: [
            [index, 1]
          ],
          [questions.length - 1]: {
            active: {
              $set: true
            }
          }
        }),
      )
    }
  }

  const selectQuestion = (index: number) => {
    const updatedQuestions = questions.slice();
    updatedQuestions.forEach(q => q.active = false);

    let selectedQuestion = updatedQuestions[index];
    if (selectedQuestion) {
      selectedQuestion.active = true;

      setQuestions(update(questions, {
        $set: updatedQuestions,
      }));
    }
  }

  /*
  const changeQuestion = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue >= questions.length) {
      createNewQuestion();
    }
    setValue(newValue);
  }
  */

  const activeQuestion = questions.find(q => q.active == true);

  return (
    <DndProvider backend={Backend}>
      <div className="investigation-build-page">
        <BuildPageHeaderComponent />
        <br></br>
        <br></br>
        <Grid container direction="row">
          <Grid container className="left-sidebar sidebar" justify="center" item xs={2} sm={1}>
            <Route exac path='/build/investigation/question-component/:questionId'>
              <div>>></div>
              <DragBox name="T" />
              <DragBox name="P" />
              <DragBox name="R" />
              <DragBox name="S" />
              <DragBox name="V" />
            </Route>
          </Grid>
          <Grid container item xs={8} sm={10}>
            <Grid container direction="row">
              <Grid xs={1} sm={2} item md={3}></Grid>
              <Grid container justify="center" item xs={10} sm={8} md={6}>
                <DragableTabs
                  questions={questions} createNewQuestion={createNewQuestion}
                  moveQuestions={moveQuestions} selectQuestion={selectQuestion}
                  removeQuestion={removeQuestion} />
                <Switch>
                  <Route exac path='/build/investigation/question-component'>
                    <QuestionComponent type={1} />
                  </Route>
                  <Route exac path='/build/investigation/question-component/:questionId'>
                    <QuestionComponent type={1} />
                  </Route>
                  <Route
                    exec path='/build/investigation/question/:questionId'
                    component={() => <QuestionTypePage history={history} questionType={questionType} questionNumber={value + 1} />} >
                  </Route>
                  <Route
                    exec path='/build/investigation/question'
                    component={() => <QuestionTypePage history={history} questionType={questionType} questionNumber={value + 1} />} >
                  </Route>
                </Switch>
              </Grid>
            </Grid>
          </Grid>
          <Grid container className="right-sidebar sidebar" item xs={2} sm={1}>
            <Route exac path='/build/investigation/question-component/:questionId'>
              <div>&lt;&lt;</div>
              <div className="odd">Q</div>
              <div className="even small">MULTIPLE CHOICE</div>
              <div className="odd small">SORT</div>
              <div className="even small">WORD FILL</div>
              <div className="odd small">HIGHLIGHT</div>
              <div className="even small">ALIGN</div>
              <div className="odd small">SHUFFLE</div>
              <div className="even small">PICTURE POINT</div>
              <div className="odd small">JUMBLE</div>
            </Route>
          </Grid>
        </Grid>
        <br></br>
        <BuildFotter />
      </div>
    </DndProvider>
  )
}

export default InvestigationBuildPage