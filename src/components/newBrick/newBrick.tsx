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
  return (
    <MuiThemeProvider>
      <Switch>
        <Route path='/build/new-brick/welcome' component={Welcome}></Route>
        <Route path='/build/new-brick/choose-subject' component={ChooseSubject}></Route>
        <Route path='/build/new-brick/brick-title' component={BrickTitle}></Route>
        <Route path='/build/new-brick/open-question' component={OpenQuestion}></Route>
        <Route path='/build/new-brick/length' component={BrickLength}></Route>
        <Route path='/build/new-brick/brief-prep' component={BriefPrep}></Route>
      </Switch>
    </MuiThemeProvider>
  );
}

export default NewBrick
