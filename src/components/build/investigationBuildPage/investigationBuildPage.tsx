import React from 'react'
import { RouteComponentProps, Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend'
import { Grid } from '@material-ui/core';
import update from 'immutability-helper';
// @ts-ignore
import { connect } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
// @ts-ignore
import Device from "react-device-frame";

import './investigationBuildPage.scss'
import BuildQuestionComponent from './buildQuestions/buildQuestionComponent';
import QuestionTypePage from './questionType/questionType';
import DragableTabs from './dragTabs/dragableTabs';
import { Question, QuestionTypeEnum, QuestionComponentTypeEnum, HintStatus } from 'components/model/question';
import actions from '../../../redux/actions/brickActions';


interface ApiQuestion {
  id?: number
  contentBlocks: string
  type: number
}

interface InvestigationBuildProps extends RouteComponentProps<any> {
  brick: any
  fetchBrick(brickId: number): void
  saveBrick(brick: any): void
}

const InvestigationBuildPage: React.FC<InvestigationBuildProps> = (props) => {
  var { brickId } = props.match.params;

  if (!props.brick || props.brick.id != brickId) {
    props.fetchBrick(brickId);
  }

  const { history } = props;
  const getNewQuestion = (type: number, active: boolean) => {
    return {
      type,
      active,
      hint: {
        value: '',
        status: HintStatus.None
      },
      components: [
        { type: 0 },
        { type: QuestionComponentTypeEnum.Component },
        { type: 0 }
      ]
    } as Question;
  }

  const [questions, setQuestions] = React.useState([getNewQuestion(QuestionTypeEnum.None, true)] as Question[]);
  const [loaded, setStatus] = React.useState(false as boolean);
  const [locked, setLock] = React.useState(false as boolean);

  if (!props.brick) {
    return <div>...Loading...</div>
  }

  const getQuestionIndex = (question: Question) => {
    return questions.indexOf(question);
  }

  let activeQuestion = questions.find(q => q.active === true) as Question;
  if (!activeQuestion) {
    console.log('Can`t find active question');
    activeQuestion = {} as Question;
  }

  const createNewQuestion = () => {
    const updatedQuestions = questions.slice();
    updatedQuestions.forEach(q => q.active = false);
    updatedQuestions.push(getNewQuestion(QuestionTypeEnum.None, true));

    setQuestions(update(questions, { $set: updatedQuestions }));
  }

  const moveQuestions = (dragIndex: number, hoverIndex: number, dragQuestion: any) => {
    if (locked) { return; }
    setQuestions(update(questions, { $splice: [[dragIndex, 1], [hoverIndex, 0, dragQuestion]] }))
  }

  const setQuestionType = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    if (!activeQuestion) {
      alert('Can`t set question type');
      return;
    }
    justSetQuestionType(type);
    history.push(`/build/brick/${brickId}/build/investigation/question-component`);
  }

  const justSetQuestionType = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    if (!activeQuestion) {
      alert('Can`t set question type');
      return;
    }
    var index = getQuestionIndex(activeQuestion);
    setQuestions(
      update(questions, {
        [index]: { type: { $set: type } }
      }),
    );
  }

  const removeQuestion = (index: number) => {
    if (locked) { return; }
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

  const toggleLock = () => {
    setLock(!locked);
  }

  const setQuestion = (index:number, question: Question) => {
    if (locked) { return; }
    setQuestions(update(questions, { [index]: { $set: question } }));
  }

  const setComponents = (index:number, components: any[]) => {
    if (locked) { return; }
    setQuestions(
      update(questions, {[index]: { components: { $set: components } } })
    );
  }

  const { brick } = props;

  if (brick.id != brickId) {
    return <div>...Loading...</div>
  }

  if (brick.questions && loaded === false) {
    const parsedQuestions: Question[] = [];
    for (const question of brick.questions) {
      try {
        const parsedQuestion = JSON.parse(question.contentBlocks);
        if (parsedQuestion.components) {
          let q = {
            id: question.id,
            type: question.type,
            hint: parsedQuestion.hint,
            components: parsedQuestion.components
          } as Question;
          parsedQuestions.push(q);
        }
      }
      catch (e) {
      }
    }
    console.log(brickId, brick.id, parsedQuestions);
    if (parsedQuestions.length > 0) {
      parsedQuestions[0].active = true;
      setQuestions(update(questions, { $set: parsedQuestions }));
      setStatus(update(loaded, { $set: true }))
    }
  }

  const saveBrick = () => {
    brick.questions = [];
    for (let question of questions) {
      let questionObject = {
        components: question.components,
        hint: question.hint
      }
      let apiQuestion = { type: question.type, contentBlocks: JSON.stringify(questionObject), } as ApiQuestion;
      if (question.id) {
        apiQuestion.id = question.id;
        apiQuestion.type = question.type;
      }
      brick.questions.push(apiQuestion);
    }
    props.saveBrick(brick);
  }

  const updateComponent = (component: any, number: number) => {
    if (locked) { return; }
    const index = getQuestionIndex(activeQuestion);
    let newComponent = Object.assign({}, component)

    setQuestions(
      update(questions, {
        [index]: {
          components: { [number]: { $set: newComponent } }
        }
      })
    )
  }

  const renderBuildQuestion = () => {
    return (
      <BuildQuestionComponent
        brickId={brickId}
        history={history}
        question={activeQuestion}
        updateComponent={updateComponent}
        getQuestionIndex={getQuestionIndex}
        setQuestionComponents={setComponents}
        setQuestion={setQuestion}
        toggleLock={toggleLock}
        locked={locked}
        setQuestionType={justSetQuestionType}
        createNewQuestion={createNewQuestion}
        saveBrick={saveBrick} />
    );
  }

  return (
    <DndProvider backend={Backend}>
      <div className="investigation-build-page">
        <Grid container direction="row" alignItems="center" style={{height: '100%'}}>
          <Grid container item xs={12} sm={12} md={7} lg={8} className="question-container">
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid container item xs={12} sm={12} md={12} lg={9} style={{margin: '10px 0 10px 0'}}>
                <DragableTabs
                  questions={questions} createNewQuestion={createNewQuestion}
                  moveQuestions={moveQuestions} selectQuestion={selectQuestion}
                  removeQuestion={removeQuestion} />
                <Switch>
                  <Route exac path='/build/brick/:brickId/build/investigation/question-component'>
                    {renderBuildQuestion}
                  </Route>
                  <Route exac path='/build/brick/:brickId/build/investigation/question-component/:questionId'>
                    {renderBuildQuestion}
                  </Route>
                  <Route
                    exec path='/build/brick/:brickId/build/investigation/question/:questionId'
                    component={() => <QuestionTypePage history={history} brickId={brickId} questionId={activeQuestion.id} setQuestionType={setQuestionType} questionType={activeQuestion.type} />} >
                  </Route>
                  <Route
                    exec path='/build/brick/:brickId/build/investigation/question'
                    component={() => <QuestionTypePage history={history} brickId={brickId} questionId={activeQuestion.id} setQuestionType={setQuestionType} questionType={activeQuestion.type} />} >
                  </Route>
                </Switch>
              </Grid>
            </Grid>
          </Grid>
            <Hidden only={['xs', 'sm']}>
              <Grid container justify="center" item md={5} lg={4}>
                <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin + '/logo-page'} />
              </Grid>
            </Hidden>
        </Grid>
      </div>
    </DndProvider>
  )
}

const mapState = (state: any) => {
  return {
    bricks: state.bricks.bricks,
    brick: state.brick.brick,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (brickId: number) => dispatch(actions.fetchBrick(brickId)),
    saveBrick: (brick: any) => dispatch(actions.saveBrick(brick)),
  }
}

const connector = connect(
  mapState,
  mapDispatch
)

export default connector(InvestigationBuildPage)
