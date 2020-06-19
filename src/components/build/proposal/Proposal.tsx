import React, { useEffect } from "react";
import { Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// @ts-ignore
import { connect } from 'react-redux';

import actions from '../../../redux/actions/brickActions';
import './Proposal.scss';
import SubjectPage from './questionnaire/subject/Subject';
import BrickTitle from './questionnaire/brickTitle/brickTitle';
import OpenQuestion from './questionnaire/openQuestion/openQuestion';
import BrickLength, { BrickLengthEnum } from './questionnaire/brickLength/brickLength';
import Brief from './questionnaire/brief/brief';
import Prep from './questionnaire/prep/prep';
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import ProposalReview from './questionnaire/proposalReview/ProposalReview';
import { Brick, Author } from "model/brick";
import { User } from "model/user";
import CloseProposalDialog from 'components/build/baseComponents/CloseProposalDialog';
import VersionLabel from "components/baseComponents/VersionLabel";
import { setBrillderTitle } from "components/services/titleService";
import { canEditBrick } from "components/services/brickService";


interface ProposalProps {
  brick: Brick;
  user: User;
  saveBrick(brick: Brick): void;
  createBrick(brick: Brick): void;
  history: any;
}

const Proposal: React.FC<ProposalProps> = ({brick, history, ...props}) => {
  let subjectId = 0;
  if (props.user.subjects.length === 1) {
    subjectId = props.user.subjects[0].id;
  }
  let initState = {
    subjectId,
    brickLength: 0,
    topic: '',
    subTopic: '',
    alternativeTopics: '',
    title: '',
    openQuestion: '',
    brief: '',
    prep: '',
    synthesis: '',
    alternativeSubject: '',
  } as Brick;

  if (props.user) {
    initState.author = (props.user as any) as Author;
  }

  if (brick) {
    initState = brick;
  }

  const [state, setBrick] = React.useState(initState);
  const [saved, setSaved] = React.useState(false);
  const [isDialogOpen, setDialog] = React.useState(false);

  const canEdit = canEditBrick(state, props.user);

  useEffect(() => {
    if (brick) {
      if (!brick.author && state.author) {
        brick.author = state.author;
      }
      setBrick(brick);
    }
  }, [brick, state.author]);

  const setLocalProposal = (data: any) => {
    localStorage.setItem('proposal', JSON.stringify(data));
  }

  const saveLocalState = (data: any) => {
    setBrick(data);
    setLocalProposal(data);  }

  const setSubject = (subjectId: number) => {
    saveLocalState({...state, subjectId});
  }

  const setTitles = (titles: any) => {
    saveLocalState({ ...state, ...titles });
  }

  const setOpenQuestion = (openQuestion: string) => {
    saveLocalState({ ...state, openQuestion } as Brick);
  }

  const setBrief = (brief: string) => {
    saveLocalState({ ...state, brief } as Brick)
  }

  const setPrep = (prep: string) => {
    saveLocalState({ ...state, prep } as Brick)
  }

  const setLength = (brickLength: BrickLengthEnum) => {
    let brick = { ...state, brickLength } as Brick;
    saveLocalState(brick);
    return brick;
  }

  const setLengthAndSave = (brickLength: number) => {
    if (!canEdit) { return; }
    let brick = setLength(brickLength);
    saveBrick(brick);
  }

  const saveBrick = (tempBrick: Brick) => {
    if (tempBrick.id) {
      props.saveBrick(tempBrick);
    } else if (brick && brick.id) {
      tempBrick.id = brick.id;
      props.saveBrick(tempBrick);
    } else {
      props.createBrick(tempBrick);
    }
  }

  setBrillderTitle();

  const saveAndMove = () => {
    saveBrick(state);
    setSaved(true);
  }

  if (saved) {
    history.push(`/build/brick/${brick.id}/build/investigation/question`);
  }

  const openDialog = () => {
    setDialog(true);
  }

  const closeDialog = () => {
    setDialog(false);
  }

  const goHome = () => {
    setDialog(false);
    history.push('/build');
  }

  return (
    <MuiThemeProvider>
      <div>
      <div style={{position: 'absolute'}}>
        <HomeButton onClick={openDialog} />
      </div>
      <div style={{ width: '100%', height: '100%' }} className="proposal-router">
        <Route path='/build/new-brick/subject'>
          <SubjectPage subjects={props.user.subjects} subjectId={''} saveSubject={setSubject} />
        </Route>
        <Route path='/build/new-brick/brick-title'>
          <BrickTitle parentState={state} canEdit={canEdit} saveTitles={setTitles} />
        </Route>
        <Route path='/build/new-brick/open-question'>
          <OpenQuestion selectedQuestion={state.openQuestion} canEdit={canEdit} saveOpenQuestion={setOpenQuestion} />
        </Route>
        <Route path='/build/new-brick/brief'>
          <Brief parentBrief={state.brief} canEdit={canEdit} saveBrief={setBrief} />
        </Route>
        <Route path='/build/new-brick/prep'>
          <Prep parentPrep={state.prep} canEdit={canEdit} savePrep={setPrep} />
        </Route>
        <Route path='/build/new-brick/length'>
          <BrickLength length={state.brickLength} canEdit={canEdit} saveLength={setLength} saveBrick={setLengthAndSave} />
        </Route>
        <Route path="/build/new-brick/proposal">
          <ProposalReview brick={state} user={props.user} saveBrick={saveAndMove} />
        </Route>
        <VersionLabel />
      </div>
      <CloseProposalDialog isOpen={isDialogOpen} close={closeDialog} move={goHome} />
      </div>
    </MuiThemeProvider>
  );
}

const mapState = (state: any) => {
  return {
    user: state.user.user,
    brick: state.brick.brick,
  }
};

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (brickId: number) => dispatch(actions.fetchBrick(brickId)),
    saveBrick: (brick: any) => dispatch(actions.saveBrick(brick)),
    createBrick: (brick: any) => dispatch(actions.createBrick(brick)),
  }
};

const connector = connect(mapState, mapDispatch);

export default connector(Proposal);
