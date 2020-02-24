import React from 'react'
import { Grid, Select, FormControl } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { IconButton, MenuItem } from "material-ui";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FormControlLabel from '@material-ui/core/FormControlLabel';

import QuestionComponents from './questionComponents/questionComponents';
import './buildQuestionComponent.scss'
import { QuestionTypeEnum, QuestionComponentTypeEnum, Question, QuestionType } from '../../../model/question';
import DragBox from './drag/dragBox';
import IOSSwitch from 'components/build/baseComponents/IOSSwitch/IOSSwitch';
import { HintState } from 'components/build/baseComponents/Hint/Hint';


function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

export interface QuestionProps {
  brickId: number
  question: Question
  history: any
  setQuestionComponentType: Function
  addComponent: Function
  swapComponents: Function
  saveBrick(): void
  updateComponent(component: any, index: number): void
  setQuestionHint(hintState: HintState): void
  setQuestionType(type: QuestionTypeEnum):void
  createNewQuestion():void
}

const BuildQuestionComponent: React.FC<QuestionProps> = (
  { brickId, question, history, setQuestionComponentType,
    swapComponents, setQuestionType, setQuestionHint,
    saveBrick, updateComponent, addComponent, createNewQuestion
  }
) => {
  const { type } = question;
  document.title = QuestionTypeEnum[type];

  const setDropBoxItem = (dragBoxType: QuestionTypeEnum, dropBoxNumber: number) => {
    setQuestionComponentType(dragBoxType, dropBoxNumber);
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
          <Grid container direction="row" className="first-row">
            <Grid container item xs={5} sm={6}></Grid>
            <Grid container item xs={4} sm={3}>Build Time: 0hrs15mins.</Grid>
            <Grid container item xs={3} sm={3} justify="center">Saved at 17:51</Grid>
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
              <QuestionComponents
                brickId={brickId}
                history={history}
                question={question}
                swapComponents={swapComponents}
                updateComponent={updateComponent}
                addComponent={addComponent}
                setQuestionHint={setQuestionHint}/>
            </Grid>
            <Grid container item xs={3} sm={3} md={3} className="right-sidebar">
              <div className="question-button-container">
                <button onClick={submitBrick}>Review and Submit</button>
              </div>
              <div className="no-margin">
                <Grid container justify="center" direction="row">
                  <Grid item sm={10} md={10} lg={9} className="important-text-container">
                    <p>Is the Order in the brick sequence of this Question important?</p>
                  </Grid>
                </Grid>
                <Grid justify="center" container direction="row">
                  <Grid container justify="center" item sm={12}>
                    <IOSSwitch />
                  </Grid>
                </Grid>
                <Grid justify="center" container direction="row">
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
              </div>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="flex-end"
              >
                <div>
                  <FormControlLabel
                    value="start"
                    control={
                      <div className="round-button-container right-button-container">
                        <IconButton className="round-button" aria-label="next">
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </div>
                    }
                    onClick={createNewQuestion}
                    label="Add New Question"
                    labelPlacement="start"
                  />
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
