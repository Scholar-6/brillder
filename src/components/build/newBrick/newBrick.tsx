import React from "react";
import { Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// @ts-ignore
import { connect } from 'react-redux';

import actions from '../../../redux/actions/brickActions';
import './newBrick.scss';
import Welcome from './questionnaire/welcome/welcome';
import BrickTitle from './questionnaire/brickTitle/brickTitle';
import OpenQuestion from './questionnaire/openQuestion/openQuestion';
import BrickLength from './questionnaire/brickLength/brickLength';
import Brief from './questionnaire/brief/brief';
import Prep from './questionnaire/prep/prep';
import ProposalReview from './questionnaire/proposalReview/ProposalReview';
import { Brick } from "model/brick";

interface NewBrickProps {
  brick: Brick;
  saveBrick(brick: Brick): void;
  history: any;
}

const NewBrick: React.FC<NewBrickProps> = ({brick, history, ...props}) => {
  let initState = {
    subject: '0',
    brickLength: 0,
    topic: '',
    subTopic: '',
    alternativeTopics: '',
    title: '',
    prep: '',
    brief: '',
    openQuestion: '',
    alternativeSubject: '',
  } as Brick;
  
  if (brick) {
    initState = brick;
  }
  
  const [state, setBrick] = React.useState(initState);
  const [saved, setSaved] = React.useState(false);

  const setTitles = (titles: any) => {
    setBrick({ ...state, ...titles });
  }

  const setOpenQuestion = (openQuestion: string) => {
    setBrick({ ...state, openQuestion } as any);
  }

  const setBrief = (brief: string) => {
    let brick = { ...state, brief } as any
    setBrick(brick)
  }

  const setPrep = (prep: string) => {
    let brick = { ...state, prep } as any
    setBrick(brick)
  }

  const setLength = (brickLength: number) => {
    let brick = { ...state, brickLength } as any
    setBrick(brick)
  }

  const saveBrick = () => {
    let brick = { ...state } as Brick;
    setBrick(brick);
    if (brick) {
      brick.id = brick.id;
    }
    props.saveBrick(brick);
    setSaved(true);
  }

  if (saved && brick && brick.id) {
    history.push(`/build/brick/${brick.id}/build/investigation/question`);
  }

  return (
    <MuiThemeProvider>
      <div style={{ width: '100%', height: '100%' }}>
        <Route path='/build/new-brick/welcome'><Welcome /></Route>
        <Route path='/build/new-brick/brick-title'>
          <BrickTitle parentState={state} saveTitles={setTitles} />
        </Route>
        <Route path='/build/new-brick/open-question'>
          <OpenQuestion selectedQuestion={state.openQuestion} saveOpenQuestion={setOpenQuestion} />
        </Route>
        <Route path='/build/new-brick/brief'>
          <Brief parentBrief={state.brief} saveBrief={setBrief} />
        </Route>
        <Route path='/build/new-brick/prep'>
          <Prep parentPrep={state.prep} savePrep={setPrep} />
        </Route>
        <Route path='/build/new-brick/length'>
          <BrickLength length={state.brickLength} saveBrick={setLength} />
        </Route>
        <Route path="/build/new-brick/proposal">
          <ProposalReview brick={state} saveBrick={saveBrick} />
        </Route>
      </div>
    </MuiThemeProvider>
  );
}

const mapState = (state: any) => {
  return {
    brick: state.brick.brick,
  }
};

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (brickId: number) => dispatch(actions.fetchBrick(brickId)),
    saveBrick: (brick: any) => dispatch(actions.saveBrick(brick)),
  }
};

const connector = connect(mapState, mapDispatch);

export default connector(NewBrick);
