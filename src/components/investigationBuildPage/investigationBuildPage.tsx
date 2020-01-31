import React from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend'
import { Grid } from '@material-ui/core';
import update from 'immutability-helper';

import './investigationBuildPage.scss'
import BuildPageHeaderComponent from './header/pageHeader';
import BuildQuestionComponent from './buildQuestions/buildQuestionComponent';
import QuestionTypePage from './questionType/questionType';
import DragableTabs from './dragTabs/dragableTabs';
import { Question, QuestionTypeEnum, QuestionComponentTypeEnum } from '../model/question';


interface InvestigationBuildProps extends RouteComponentProps<any> {
  fetchBrick: Function,
  fetchProForma: Function
}

const InvestigationBuildPage: React.FC<InvestigationBuildProps> = ({ history }: any) => {
  const getNewQuestion = (type: number, active: boolean) => {
    return {
      type,
      active,
      components: [
        {type: 0}, {type: QuestionComponentTypeEnum.Component}, {type: 0}
      ]
    } as Question;
  }

  const [questions, setQuestions] = React.useState([getNewQuestion(QuestionTypeEnum.None, true)] as Question[])

  const getQuestionIndex = (question: Question) => {
    return questions.indexOf(question);
  }

  let activeQuestion = questions.find(q => q.active == true) as Question;
  if (!activeQuestion) {
    console.log('Can`t find active question');
    activeQuestion = {} as Question;
  }

  const createNewQuestion = () => {
    const updatedQuestions = questions.slice();
    updatedQuestions.forEach(q => q.active = false);
    updatedQuestions.push(getNewQuestion(QuestionTypeEnum.None, true));

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

  const setQuestionType = (type: QuestionTypeEnum) => {
    if (!activeQuestion) {
      alert('Can`t set question type');
      return;
    }
    var index = getQuestionIndex(activeQuestion);

    setQuestions(
      update(questions, {
        [index]: {  type: { $set: type } }
      }),
    )

    history.push(`/build/investigation/question-component/${index + 1}`);
  }

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      alert("You can`t delete last question");
      return;
    }
    if (index !== 0) {
      setQuestions(
        update(questions, {
          $splice: [[index, 1]],
          0: { active: { $set: true } }
        }),
      )
    } else {
      setQuestions(
        update(questions, {
          $splice: [[index, 1]],
          [questions.length - 1]: {
            active: { $set: true }
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

  const setQuestionComponentType = (type: any, dropBox: any) => {
    if (dropBox.value == QuestionComponentTypeEnum.Component) {
      return;
    }
    const index = getQuestionIndex(activeQuestion);
    const question = Object.assign({}, activeQuestion) as Question;
    question.components[dropBox.index].type = type;

    setQuestions(
      update(questions, { [index]: { $set: question } }),
    )
  }

  const swapComponents = (drag: any, drop: any) => {
    const index = getQuestionIndex(activeQuestion);
    const components  = Object.assign([], activeQuestion.components) as any[];
    const tempComp = components[drag.index];
    components[drag.index] = components[drop.index];
    components[drop.index] = tempComp;
    
    setQuestions(
      update(questions, {
        [index]: {
          components: { $set: components}
        }
      }),
    )
  }

  return (
    <DndProvider backend={Backend}>
      <div className="investigation-build-page">
        <BuildPageHeaderComponent />
        <br></br>
        <br></br>
        <Grid container direction="row">
          <Grid xs={1} item></Grid>
          <Grid container justify="center" item xs={10}>
            <DragableTabs
              questions={questions} createNewQuestion={createNewQuestion}
              moveQuestions={moveQuestions} selectQuestion={selectQuestion}
              removeQuestion={removeQuestion} />
            <Switch>
              <Route exac path='/build/investigation/question-component'>
                <BuildQuestionComponent
                  history={history}
                  question={activeQuestion}
                  setQuestionComponentType={setQuestionComponentType}
                  swapComponents={swapComponents} />
              </Route>
              <Route exac path='/build/investigation/question-component/:questionId'>
                <BuildQuestionComponent
                  history={history}
                  question={activeQuestion}
                  setQuestionComponentType={setQuestionComponentType}
                  swapComponents={swapComponents} />
              </Route>
              <Route
                exec path='/build/investigation/question/:questionId'
                component={() => <QuestionTypePage history={history} setQuestionType={setQuestionType} questionType={activeQuestion.type} />} >
              </Route>
              <Route
                exec path='/build/investigation/question'
                component={() => <QuestionTypePage history={history} setQuestionType={setQuestionType} questionType={activeQuestion.type} />} >
              </Route>
            </Switch>
          </Grid>
        </Grid>
      </div>
    </DndProvider>
  )
}

export default InvestigationBuildPage