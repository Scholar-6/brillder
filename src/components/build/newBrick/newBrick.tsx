import React from "react";
import { Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// @ts-ignore
import { connect } from 'react-redux';
import actions from '../../../redux/actions/brickActions';
import './newBrick.scss';
import Welcome from './questionnaire/welcome';
import ChooseSubject from './questionnaire/chooseSubject';
import BrickTitle from './questionnaire/brickTitle';
import OpenQuestion from './questionnaire/openQuestion';
import BrickLength from './questionnaire/brickLength';
import BriefPrep from './questionnaire/briefPrep';


function NewBrick(props: any) {
  console.log(props)
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
    links: [],
  });

  const setSubject = (subject: string) => {
    setBrick({ ...state, subject } as any);
  }

  const setTitles = (titles: any) => {
    setBrick({ ...state, ...titles });
  }

  const setOpenQuestion = (openQuestion: string) => {
    setBrick({ ...state, openQuestion } as any);
  }

  const setBrickLength = (brickLength: number) => {
    setBrick({ ...state, brickLength } as any);
  }

  const setBriefPrep = (data: any) => {
    let brick = { ...state, preparationBrief: data.preparationBrief, links: data.links.split(" ") } as any
    setBrick(brick)
    props.saveBrick(brick);
  }

  if (props.brick != null) {
    props.history.push(`/build/brick/${props.brick.id}/build/investigation/question`);
  }

  return (
    <MuiThemeProvider>
      <Route path='/build/new-brick/welcome'><Welcome /></Route>
      <Route path='/build/new-brick/choose-subject'>
        <ChooseSubject saveSubject={setSubject} selectedSubject={state.subject} />
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
      <Route path='/build/new-brick/brief-prep'>
        <BriefPrep parentState={state} saveBriefPrep={setBriefPrep} />
      </Route>
    </MuiThemeProvider>
  );
}

const mapState = (state: any) => {
  return {
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

export default connector(NewBrick)
