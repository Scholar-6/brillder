import React from 'react'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Grid, Slider, Box, Paper } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import './questionType.scss';
import { QuestionType } from '../../model/question';
import TabPanel from './tabPanel';

export interface QuestionTypeProps { }

function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

function CircleIcon({ number, customClass }: any) {
  return (
    <span className={customClass + " icon-filled-circle-blue-" + number}>
      <span className="path1"></span><span className="path2"></span>
      <span className="path3"></span><span className="path4"></span>
      <span className="path5"></span><span className="path6"></span>
    </span>
  );
}

function QuestionTypeList({questionNumber, history}: any) {
  let typeArray: string[] = Object.keys(QuestionType);
  typeArray = typeArray.map(SplitByCapitalLetters)

  function addQuestion() {
    history.push(`/build/investigation/question/component`);
  }

  return (
  <div className="question">
    <Grid container direction="row" justify="center" className="card-description">
      Choose question type...
    </Grid>
    <Grid container direction="row">
      {
        typeArray.map((item, i) => {
          return (
            <Grid xs={3} item key={i}>
              <Box className="question-container" onClick={addQuestion}>
                <div className="link-description">{item}</div>
              </Box>
            </Grid>
          );
        })
      }
    </Grid>
  </div>
  );
}

const QuestionTypePage: React.FC<QuestionTypeProps> = (props: any) => {
  const [value, setValue] = React.useState(0);

  function addQuestion() {
    props.history.push("/build/investigation/question/component");
  }

  const changeQuestion = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  }

  var questions = [1, 2, 3, 4, "New Question"]

  return (
    <div className="question-type-sub-page">
      <span className="icon-filled-circle-blue-1"></span>
      <Grid container direction="row">
        <Grid container className="left-sidebar sidebar" justify="center" item xs={2} sm={1}>
        </Grid>
        <Grid container item xs={8} sm={10}>
          <Grid container direction="row">
            <Grid xs={1} sm={2} item md={3}></Grid>
            <Grid container justify="center" item xs={10} sm={8} md={6}>
              <AppBar position="static" color="default">
                <Tabs
                  variant="fullWidth"
                  indicatorColor="primary"
                  value={value}
                  onChange={changeQuestion}
                  textColor="primary"
                  aria-label="icon tabs example"
                >
                  {
                    questions.map((question, i) => {
                      return (
                        <Tab key={i} icon={<CircleIcon number={question} customClass="tab-icon" />} />
                      );
                    })
                  }
                </Tabs>
              </AppBar>
              {
                questions.map((question, i) => {
                  return (
                    <TabPanel key={i} value={value} index={i}>
                      <QuestionTypeList questionNumber={i + 1} history={props.history} />
                    </TabPanel>
                  );
                })
              }
            </Grid>
          </Grid>
          <br />
        </Grid>
        <Grid container className="right-sidebar sidebar" item xs={2} sm={1}>
        </Grid>
      </Grid>
    </div>
  );
}

export default QuestionTypePage
