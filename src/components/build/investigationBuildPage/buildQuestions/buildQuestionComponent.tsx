import React from 'react'
import { Grid, Select, FormControl, Button } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { IconButton, MenuItem } from "material-ui";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import QuestionComponents from './questionComponents/questionComponents';
import './buildQuestionComponent.scss'
import { QuestionTypeEnum, QuestionComponentTypeEnum, Question, QuestionType } from '../../../model/question';
import DragBox from './drag/dragBox';
import { HintState } from 'components/build/baseComponents/Hint/Hint';
import LockComponent from './lock/Lock';


function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

export interface QuestionProps {
  brickId: number
  question: Question
  history: any
  saveBrick(): void
  setQuestion(index:number, question: Question): void
  updateComponent(component: any, index: number): void
  setQuestionType(type: QuestionTypeEnum): void
  createNewQuestion(): void
  getQuestionIndex(question: Question): number
  setQuestionComponents(index:number, components: any[]): void
  toggleLock(): void
  locked: boolean
}

const BuildQuestionComponent: React.FC<QuestionProps> = (
  {
    brickId, question, history, setQuestionType, getQuestionIndex, toggleLock, locked,
    saveBrick, updateComponent, createNewQuestion, setQuestion, setQuestionComponents,
  }
) => {
  const { type } = question;
  document.title = QuestionTypeEnum[type];

  const setDropBoxItem = (dragBoxType: QuestionTypeEnum, dropBoxNumber: number) => {
    setQuestionComponentType(dragBoxType, dropBoxNumber);
  }

  const setQuestionComponentType = (type: any, dropBox: any) => {
    if (dropBox.value === QuestionComponentTypeEnum.Component) {
      return;
    }
    const index = getQuestionIndex(question);
    const updatedQuestion = Object.assign({}, question) as Question;
    updatedQuestion.components[dropBox.index].type = type;

    setQuestion(index, updatedQuestion);
  }

  const swapComponents = (drag: any, drop: any) => {
    const index = getQuestionIndex(question);
    const components = Object.assign([], question.components) as any[];
    const tempComp = components[drag.index];
    components[drag.index] = components[drop.index];
    components[drop.index] = tempComp;

    setQuestionComponents(index, components);
  }

  const addComponent = () => {
    const index = getQuestionIndex(question);
    const components = Object.assign([], question.components) as any[];
    components.push({ type: 0 });

    setQuestionComponents(index, components);
  }

  const setQuestionHint = (hintState: HintState) => {
    const index = getQuestionIndex(question);
    const updatedQuestion = Object.assign({}, question) as Question;
    updatedQuestion.hint.value = hintState.value;
    updatedQuestion.hint.status = hintState.status;

    setQuestion(index, updatedQuestion);
  }

  const submitBrick = () => {
    saveBrick();
    history.push("/build");
  }

  let typeArray: string[] = Object.keys(QuestionType);

  return (
    <MuiThemeProvider >
      <div style={{ width: '100%' }}>
        <Grid container justify="center" className="build-question-column" item xs={12}>
          <Grid container direction="row">
            <Grid container item xs={4} sm={3} md={3} alignItems="center" style={{height: "100%", paddingBottom: "25px"}}>
              <Grid container item xs={12} className="left-sidebar" alignItems="center">
              <DragBox onDrop={setDropBoxItem} name="T" fontSize="2.4vw" value={QuestionComponentTypeEnum.Text} />
              <DragBox onDrop={setDropBoxItem} name="“ ”" fontSize="2.8vw" value={QuestionComponentTypeEnum.Quote} />
              <DragBox onDrop={setDropBoxItem} name="jpg." fontSize="1.7vw" value={QuestionComponentTypeEnum.Image} />
              <DragBox onDrop={setDropBoxItem} name="Sound" isImage={true} src="/images/soundicon.png" value={QuestionComponentTypeEnum.Sound} />
              <DragBox onDrop={setDropBoxItem} name="E Q N" fontSize="1.6vw" value={QuestionComponentTypeEnum.Equation} />
              </Grid>
            </Grid>
            <Grid container item xs={5} sm={6} md={6} className="question-components-list">
              <QuestionComponents
                brickId={brickId}
                history={history}
                question={question}
                swapComponents={swapComponents}
                updateComponent={updateComponent}
                addComponent={addComponent}
                setQuestionHint={setQuestionHint} />
            </Grid>
            <Grid container item xs={3} sm={3} md={3} className="right-sidebar">
              <Grid container direction="row" justify="center">
              <Grid container item xs={10} className="question-button-container">
                <Button onClick={submitBrick}>
                  <div>R E V I E W</div>
                  <div>&</div>
                  <div>S U B M I T</div>
                </Button>
              </Grid>
              </Grid>
              <Grid container direction="row" alignItems="flex-end">
                <Grid container justify="center" item sm={12}>
                  <FormControl variant="outlined">
                    <Select
                      value={type}
                      inputProps={{
                        name: 'age',
                        id: 'age-native-simple',
                      }}
                      onChange={(e) => {
                        setQuestionType(parseInt(e.target.value as string) as QuestionTypeEnum);
                      }}
                    >
                      {
                        typeArray.map((typeName, i) => {
                          const type = QuestionType[typeName] as QuestionTypeEnum;
                          return <MenuItem key={i} value={type}>{SplitByCapitalLetters(typeName)}</MenuItem>
                        })
                      }
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <LockComponent locked={locked} onChange={toggleLock} />
              <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="flex-end"
              >
                <div className="round-button-container right-button-container">
                  <IconButton className="new-question-button" aria-label="next" onClick={createNewQuestion}>
                    <ArrowForwardIosIcon className="new-question-icon" />
                  </IconButton>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </MuiThemeProvider>
  );
}

export default BuildQuestionComponent
