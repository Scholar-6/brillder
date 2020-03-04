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
import BrickLength, { BrickLengthEnum } from './questionnaire/brickLength/brickLength';
import Brief from './questionnaire/brief/brief';
import Prep from './questionnaire/prep/prep';
import ProposalReview from './questionnaire/proposalReview/ProposalReview';


function NewBrick(props: any) {
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

  const [saved, setSaved] = React.useState(false);

  const setTitles = (titles: any) => {
    setBrick({ ...state, ...titles });
  }

  const setOpenQuestion = (openQuestion: string) => {
    setBrick({ ...state, openQuestion } as any);
  }

  const setBrickLength = (brickLength: number) => {
    let length = 20;
    if (brickLength === BrickLengthEnum.S20min) {
      length = 20;
    } else if (brickLength === BrickLengthEnum.S40min) {
      length = 40;
    } else if (brickLength === BrickLengthEnum.S60min) {
      length = 60;
    }
    setBrick({ ...state, brickLength } as any);
  }

  const setBrief = (data:any) => {
    let brick = { ...state, preparationBrief: data.preparationBrief } as any
    setBrick(brick)
  }

  const saveBrick = (data: any) => {
    let brick = { ...state, brickLength: data } as any
    setBrick(brick);
    setSaved(true);
    props.saveBrick(brick);
  }

  const setPrep = (data: any) => { }

  if (props.brick != null) {
    if (props.location.pathname.indexOf('/build/new-brick/proposal/') === -1 && saved === true) {
      props.history.push(`/build/new-brick/proposal/${props.brick.id}`);
    }
  }

  return (
    <MuiThemeProvider>
      <div style={{width: '100%', height: '100%'}}>
        <Route path='/build/new-brick/welcome'><Welcome /></Route>
        <Route path='/build/new-brick/brick-title'>
          <BrickTitle parentState={state} saveTitles={setTitles} />
        </Route>
        <Route path='/build/new-brick/open-question'>
          <OpenQuestion selectedQuestion={state.openQuestion} saveOpenQuestion={setOpenQuestion} />
        </Route>
        <Route path='/build/new-brick/brief'>
          <Brief parentState={state} setBrief={setBrief} />
        </Route>
        <Route path='/build/new-brick/prep'>
          <Prep parentState={state} setPrep={setPrep} />
        </Route>
        <Route path='/build/new-brick/length'>
          <BrickLength length={state.brickLength} saveBrick={saveBrick} />
        </Route>
        <Route path="/build/new-brick/proposal/:brickId" component={ProposalReview}></Route>
      </div>
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
