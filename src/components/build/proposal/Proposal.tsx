import React from "react";
import { Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// @ts-ignore
import { connect } from 'react-redux';
import { History } from 'history';

import actions from '../../../redux/actions/brickActions';
import './Proposal.scss';
import SubjectPage from './questionnaire/subject/Subject';
import BrickTitle from './questionnaire/brickTitle/brickTitle';
import OpenQuestion from './questionnaire/openQuestion/openQuestion';
import { BrickLengthEnum } from 'model/brick';
import BrickLength from './questionnaire/brickLength/brickLength';
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
import { ReduxCombinedState } from "redux/reducers";
import { BrickFieldNames } from './model';

import { setLocalBrick, getLocalBrick } from 'components/localStorage/proposal';


interface ProposalProps {
  brick: Brick;
  user: User;
  saveBrick(brick: Brick): void;
  createBrick(brick: Brick): void;
  history: History;
}

interface ProposalState {
  brick: Brick;
  saved: boolean;
  isDialogOpen: boolean;
}

class Proposal extends React.Component<ProposalProps, ProposalState> {
  constructor(props: ProposalProps) {
    super(props);
    let subjectId = 0;
    const { user, brick } = props;
    const { subjects } = user;
    if (subjects.length === 1) {
      subjectId = subjects[0].id;
    }
    let initBrick = {
      subjectId,
      brickLength: BrickLengthEnum.None,
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


    if (user) {
      initBrick.author = (user as any) as Author;
    }

    // getting brick from local storage
    let localBrick = getLocalBrick();
    if (localBrick) {
      initBrick = localBrick;
    }

    // if brick is fetched then set this brick and save in local storage
    if (brick) {
      initBrick = brick;
      setLocalBrick(brick);
    }

    this.state = {
      brick: initBrick,
      saved: false,
      isDialogOpen: false
    }
  }

  shouldComponentUpdate() {
    const {brick} = this.props;
    if (brick) {
      if (!brick.author && this.state.brick.author) {
        brick.author = this.state.brick.author;
      }
      this.setState({brick});
    }
    return false;
  }

  saveBrick(tempBrick: Brick) {
    const {brick} = this.props;
    if (tempBrick.id) {
      this.props.saveBrick(tempBrick);
    } else if (brick && brick.id) {
      tempBrick.id = brick.id;
      this.props.saveBrick(tempBrick);
    } else {
      this.props.createBrick(tempBrick);
    }
  }

  openDialog = () => this.setState({ isDialogOpen: true });
  closeDialog = () => this.setState({ isDialogOpen: false });

  goHome() {
    this.setState({ isDialogOpen: false });
    this.props.history.push('/home');
  }

  saveLocalBrick(brick: Brick) {
    this.setState({ brick })
    setLocalBrick(brick);
  }

  setSubject = (subjectId: number) => this.saveLocalBrick({ ...this.state.brick, subjectId });
  setTitles = (titles: any) => this.saveLocalBrick({ ...this.state.brick, ...titles });
  setOpenQuestion = (openQuestion: string) => this.saveLocalBrick({ ...this.state.brick, openQuestion } as Brick);
  setBrief = (brief: string) => this.saveLocalBrick({ ...this.state.brick, brief } as Brick);
  setPrep = (prep: string) => this.saveLocalBrick({ ...this.state.brick, prep } as Brick);
 
  setBrickField = (name: BrickFieldNames, value: string) => {
    let {brick} = this.state;
    brick[name] = value;
    this.saveLocalBrick({ ...this.state.brick });
    this.setState({brick});
  }

  setLength = (brickLength: BrickLengthEnum) => {
    let brick = { ...this.state.brick, brickLength } as Brick;
    this.saveLocalBrick(brick);
    return brick;
  }
  
  setLengthAndSave = (brickLength: BrickLengthEnum) => {
    const canEdit = canEditBrick(this.state.brick, this.props.user);
    if (!canEdit) { return; }
    let brick = this.setLength(brickLength);
    this.saveBrick(brick);
  }

  saveAndMove = () => {
    this.saveBrick(this.state.brick);
    this.setState({ saved: true });
  }

  render() {
    const canEdit = canEditBrick(this.state.brick, this.props.user);

    setBrillderTitle();

    if (this.state.saved) {
      this.props.history.push(`/build/brick/${this.props.brick.id}/build/investigation/question`);
    }

    const localBrick = this.state.brick;
    const {user} = this.props;

    return (
      <MuiThemeProvider>
        <div>
          <HomeButton onClick={() => this.openDialog()} />
          <div style={{ width: '100%', height: '100%' }} className="proposal-router">
            <Route path='/build/new-brick/subject'>
              <SubjectPage subjects={user.subjects} subjectId={''} saveSubject={this.setSubject} />
            </Route>
            <Route path='/build/new-brick/brick-title'>
              <BrickTitle parentState={localBrick} canEdit={canEdit} saveTitles={this.setTitles} />
            </Route>
            <Route path='/build/new-brick/open-question'>
              <OpenQuestion selectedQuestion={localBrick.openQuestion} canEdit={canEdit} saveOpenQuestion={this.setOpenQuestion} />
            </Route>
            <Route path='/build/new-brick/brief'>
              <Brief parentBrief={localBrick.brief} canEdit={canEdit} saveBrief={this.setBrief} />
            </Route>
            <Route path='/build/new-brick/prep'>
              <Prep parentPrep={localBrick.prep} canEdit={canEdit} savePrep={this.setPrep} />
            </Route>
            <Route path='/build/new-brick/length'>
              <BrickLength length={localBrick.brickLength} canEdit={canEdit} saveLength={this.setLength} saveBrick={this.setLengthAndSave} />
            </Route>
            <Route path="/build/new-brick/proposal">
              <ProposalReview
                brick={localBrick}
                history={this.props.history}
                canEdit={canEdit}
                user={user}
                setBrickField={this.setBrickField}
                saveBrick={this.saveAndMove}
              />
            </Route>
            <VersionLabel />
          </div>
          <CloseProposalDialog
            isOpen={this.state.isDialogOpen}
            close={() => this.closeDialog()}
            move={() => this.goHome()}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  brick: state.brick.brick,
});

const mapDispatch = (dispatch: any) => ({
  saveBrick: (brick: any) => dispatch(actions.saveBrick(brick)),
  createBrick: (brick: any) => dispatch(actions.createBrick(brick)),
});

const connector = connect(mapState, mapDispatch);

export default connector(Proposal);
