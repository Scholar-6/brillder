import React from 'react'
import { RouteComponentProps } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Route, Switch } from 'react-router-dom';

import './investigationBuildPage.scss'
import BuildPageHeaderComponent from './header/pageHeader';
import QuestionComponent from './questionComponent';
import QuestionTypePage from './questionType/questionType';
import { Grid, Slider } from '@material-ui/core';
import DragBox from './DragBox';


interface InvestigationBuildProps extends RouteComponentProps<any> {
  fetchBrick: Function,
  fetchProForma: Function
}

const InvestigationBuildPage: React.FC<InvestigationBuildProps> = () => {
  return (
    <div className="investigation-build-page">
      <BuildPageHeaderComponent />
      <Grid container direction="row">
        <Grid container className="left-sidebar sidebar" justify="center" item xs={2} sm={1}>
          <Route exac path={`/build/investigation/question/component`}>
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
            <Switch>
              <Route exac path={`/build/investigation/question/component`}>
                <QuestionComponent type={1} />
              </Route>
              <Route
                path={`/build/investigation/question`}
                exac component={QuestionTypePage}>
              </Route>
            </Switch>
          </Grid>
        </Grid>
        <Grid container className="right-sidebar sidebar" item xs={2} sm={1}>
          <Route exac path={`/build/investigation/question/component`}>
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
      <Grid container direction="row" className="page-fotter">
        <Grid container item xs={4} sm={7} md={8} lg={9}></Grid>
        <Grid container item xs={7} sm={4} md={3} lg={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <RemoveIcon className="white" color="inherit" />
            </Grid>
            <Grid item xs>
              <Slider className="white" aria-labelledby="continuous-slider" />
            </Grid>
            <Grid item>
              <AddIcon className="white" color="inherit" />
            </Grid>
            <Grid item className="percentages">
              55 %
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default InvestigationBuildPage