import React from "react";
import { Route, Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import './newBrick.scss';
import Welcome from './questionnaire/welcome';
import ChooseSubject from './questionnaire/chooseSubject';
import BrickTitle from './questionnaire/brickTitle';
import OpenQuestion from './questionnaire/openQuestion';
import BrickLength from './questionnaire/brickLength';
import BriefPrep from './questionnaire/briefPrep';


function NewBrick() {
  const [state, setBrick] = React.useState({
    subject: '0',
    brickLength: 0,
    topic: '',
    subTopic: '',
    alternativeTopics: '',
    title: '',
    investigationBrief: '',
    preparationBrief: '',
    openQuestion: '',
    alternativeSubject: '',
  });

  const setSubject = (subject: string) => {
    setBrick({...state, subject } as any);
  }

  const setTitles = (titles: any) => {
    setBrick({...state, ...titles});
  }

  const setOpenQuestion = (openQuestion: string) => {
    setBrick({...state, openQuestion } as any);
  }

  const setBrickLength = (brickLength: number) => {
    setBrick({...state, brickLength} as any);
  }

  return (
    <MuiThemeProvider>
      <Switch>
        <Route path='/build/new-brick/welcome'><Welcome/></Route>
        <Route path='/build/new-brick/choose-subject'>
          <ChooseSubject saveSubject={setSubject} selectedSubject={state.subject}/>
        </Route>
        <Route path='/build/new-brick/brick-title'>
          <BrickTitle parentState={state} saveTitles={setTitles} />
          </Route>
        <Route path='/build/new-brick/open-question'>
          <OpenQuestion selectedQuestion={state.openQuestion} saveOpenQuestion={setOpenQuestion} />
        </Route>
        <Route path='/build/new-brick/length'>
          <BrickLength length={state.brickLength} saveBrickLength={setBrickLength} />
        </Route>
        <Route path='/build/new-brick/brief-prep' component={BriefPrep}></Route>
      </Switch>
    </MuiThemeProvider>
  );
}

export default NewBrick
