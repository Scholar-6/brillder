import React from "react";
import { Route } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { connect } from "react-redux";
import { History } from "history";

import actions from "redux/actions/brickActions";
import * as socketActions from "redux/actions/socket";
import "./Proposal.scss";
import SubjectPage from "./questionnaire/subject/Subject";
import BrickTitle from "./questionnaire/brickTitle/brickTitle";
import OpenQuestion from "./questionnaire/openQuestion/openQuestion";
import { BrickLengthEnum, Subject } from "model/brick";
import BrickLength from "./questionnaire/brickLength/brickLength";
import Brief from "./questionnaire/brief/brief";
import Prep from "./questionnaire/prep/prep";
import HomeButton from "components/baseComponents/homeButton/HomeButton";
import ProposalReview from "./questionnaire/proposalReview/ProposalReview";
import { Brick, Author } from "model/brick";
import { User } from "model/user";
import CloseProposalDialog from "components/build/baseComponents/dialogs/CloseProposalDialog";
import VersionLabel from "components/baseComponents/VersionLabel";
import { setBrillderTitle } from "components/services/titleService";
import { canEditBrick } from "components/services/brickService";
import { ReduxCombinedState } from "redux/reducers";
import { BrickFieldNames, PlayButtonStatus } from "./model";
import { validateQuestion } from "components/build/questionService/ValidateQuestionService";
import {
  parseQuestion,
  ApiQuestion,
} from "components/build/questionService/QuestionService";
import map from "components/map";

import { setLocalBrick, getLocalBrick } from "localStorage/proposal";
import { Question } from "model/question";
import { loadSubjects } from "components/services/subject";
import { leftKeyPressed, rightKeyPressed } from "components/services/key";

interface ProposalProps {
  history: History;
  location: any;

  //redux
  brick: Brick;
  user: User;
  saveBrick(brick: Brick): Promise<Brick | null>;
  createBrick(brick: Brick): Promise<Brick | null>;
  socketStartEditing(brickId: number): void;
}

interface ProposalState {
  brick: Brick;
  saving: boolean;
  saved: boolean;
  subjects: Subject[];
  isDialogOpen: boolean;
  handleKey(e: any): void;
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
      topic: "",
      subTopic: "",
      alternativeTopics: "",
      title: "",
      openQuestion: "",
      brief: "",
      prep: "",
      synthesis: "",
      alternativeSubject: "",
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

    if (initBrick.id) {
      this.props.socketStartEditing(initBrick.id); // start editing in socket as well.
    }

    this.state = {
      brick: initBrick,
      saved: false,
      saving: false,
      isDialogOpen: false,
      subjects: [],
      handleKey: this.handleKey.bind(this)
    };

    this.getSubject();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  async handleKey(e: any) {
    if (e.target.tagName === "INPUT") { return; }
    if (e.target.classList.contains("ck-content")) { return; }

    const {history} = this.props;
    const {pathname} = this.props.location;
    if (rightKeyPressed(e)) {
      if (pathname === map.ProposalSubject) {
        if (this.state.brick.subjectId) {
          history.push(map.ProposalTitle);
        }
      } else if (pathname === map.ProposalTitle) {
        history.push(map.ProposalOpenQuestion);
      } else if (pathname === map.ProposalOpenQuestion) {
        history.push(map.ProposalLength);
      } else if (pathname === map.ProposalLength) {
        history.push(map.ProposalBrief);
      } else if (pathname === map.ProposalBrief) {
        history.push(map.ProposalPrep);
      } else if (pathname === map.ProposalPrep) {
        this.saveLocalBrick(this.state.brick);
        await this.saveBrick(this.state.brick);
        history.push(map.ProposalReview);
      }
    } else if (leftKeyPressed(e)) {
      if (pathname === map.ProposalOpenQuestion) {
        history.push(map.ProposalTitle);
      } else if (pathname === map.ProposalLength) {
        history.push(map.ProposalOpenQuestion);
      } else if (pathname === map.ProposalBrief) {
        history.push(map.ProposalLength);
      } else if (pathname === map.ProposalPrep) {
        history.push(map.ProposalBrief);
      }
    }
  }

  async getSubject() {
    const subjects = await loadSubjects();
    if (subjects) {
      this.setState({subjects});
    }
  }

  async saveBrick(tempBrick: Brick) {
    if (this.state.saving === true) { return; }
    this.setState({saving: true});
    const { brick } = this.props;
    if (tempBrick.id) {
      await this.props.saveBrick(tempBrick);
    } else if (brick && brick.id) {
      tempBrick.id = brick.id;
      await this.props.saveBrick(tempBrick);
    } else {
      await this.props.createBrick(tempBrick);
    }
    this.setState({saving: false});
  }

  openDialog = () => this.setState({ isDialogOpen: true });
  closeDialog = () => this.setState({ isDialogOpen: false });

  goHome() {
    this.setState({ isDialogOpen: false });
    this.props.history.push("/home");
  }

  saveLocalBrick(brick: Brick) {
    console.log(brick);
    this.setState({ brick });
    setLocalBrick(brick);
    console.log('saved');
  }

  setCore = (isCore: boolean) =>
    this.saveLocalBrick({ ...this.state.brick, isCore });
  setSubject = (subjectId: number) =>
    this.saveLocalBrick({ ...this.state.brick, subjectId });
  setCoreAndSubject = (subjectId: number, isCore: boolean) => 
    this.saveLocalBrick({ ...this.state.brick, subjectId, isCore });
  setTitles = (titles: any) =>
    this.saveLocalBrick({ ...this.state.brick, ...titles });
  setOpenQuestion = (openQuestion: string) =>
    this.saveLocalBrick({ ...this.state.brick, openQuestion } as Brick);
  setBrief = (brief: string) =>
    this.saveLocalBrick({ ...this.state.brick, brief } as Brick);
  setPrep = (prep: string) =>
    this.saveLocalBrick({ ...this.state.brick, prep } as Brick);

  setBrickField = (name: BrickFieldNames, value: string) => {
    let { brick } = this.state;
    brick[name] = value;
    this.saveLocalBrick({ ...this.state.brick });
    this.setState({ brick });
  };

  setLength = (brickLength: BrickLengthEnum) => {
    let brick = { ...this.state.brick, brickLength } as Brick;
    this.saveLocalBrick(brick);
    return brick;
  };

  setLengthAndSave = (brickLength: BrickLengthEnum) => {
    const canEdit = canEditBrick(this.state.brick, this.props.user);
    if (!canEdit) {
      return;
    }
    let brick = this.setLength(brickLength);
    this.saveBrick(brick);
  };

  setPrepAndSave = (prep: string) => {
    const brick = { ...this.state.brick, prep } as Brick;
    this.saveLocalBrick(brick);
    this.saveBrick(brick);
  };

  saveAndMove = async () => {
    if (this.state.saving === true) { return; }
    this.setState({ saving: true });
    await this.saveBrick(this.state.brick);
    this.setState({ saved: true, saving: false });
  };

  async saveAndPreview(playStatus: PlayButtonStatus) {
    if (this.state.brick.id && playStatus === PlayButtonStatus.Valid) {
      await this.props.saveBrick(this.state.brick);
      this.props.history.push(map.playPreviewIntro(this.state.brick.id));
    }
  }

  render() {
    const { history } = this.props;
    const canEdit = canEditBrick(this.state.brick, this.props.user);

    setBrillderTitle();

    if (this.state.saved) {
      if (this.props.brick) {
        history.push(
          `/build/brick/${this.props.brick.id}/investigation/question`
        );
      } else if (this.state.brick.id) {
        history.push(
          `/build/brick/${this.state.brick.id}/investigation/question`
        );
      } else {
        history.push("/new-brick/brick-title");
      }
    }

    const localBrick = this.state.brick;
    const { user } = this.props;

    let playStatus = PlayButtonStatus.Hidden;
    const { brick } = this.props;
    if (brick && brick.questions && brick.questions.length > 0) {
      playStatus = PlayButtonStatus.Valid;
      const parsedQuestions: Question[] = [];
      for (const question of brick.questions) {
        try {
          parseQuestion(question as ApiQuestion, parsedQuestions);
        } catch (e) { }
      }
      parsedQuestions.forEach((q) => {
        let isQuestionValid = validateQuestion(q as any);
        if (!isQuestionValid) {
          playStatus = PlayButtonStatus.Invalid;
        }
      });
    }

    return (
      <MuiThemeProvider>
        <div>
          <HomeButton onClick={() => this.openDialog()} />
          <div
            style={{ width: "100%", height: "100%" }}
            className="proposal-router"
          >
            <Route path={map.ProposalSubject}>
              <SubjectPage
                location={history.location}
                subjects={user.subjects}
                subjectId={""}
                history={history}
                saveCore={this.setCore}
                saveSubject={this.setSubject}
                saveData={this.setCoreAndSubject}
              />
            </Route>
            <Route path={map.ProposalTitle}>
              <BrickTitle
                history={history}
                playStatus={playStatus}
                parentState={localBrick}
                canEdit={canEdit}
                subjects={this.state.subjects}
                saveTitles={this.setTitles}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={map.ProposalLength}>
              <BrickLength
                playStatus={playStatus}
                length={localBrick.brickLength}
                canEdit={canEdit}
                saveLength={this.setLength}
                saveBrick={this.setLength}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={map.ProposalOpenQuestion}>
              <OpenQuestion
                playStatus={playStatus}
                history={history}
                selectedQuestion={localBrick.openQuestion}
                canEdit={canEdit}
                saveOpenQuestion={this.setOpenQuestion}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={map.ProposalBrief}>
              <Brief
                playStatus={playStatus}
                parentBrief={localBrick.brief}
                canEdit={canEdit}
                saveBrief={this.setBrief}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={map.ProposalPrep}>
              <Prep
                playStatus={playStatus}
                parentPrep={localBrick.prep}
                canEdit={canEdit}
                savePrep={this.setPrep}
                saveBrick={this.setPrepAndSave}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={map.ProposalReview}>
              <ProposalReview
                playStatus={playStatus}
                brick={localBrick}
                history={history}
                canEdit={canEdit}
                user={user}
                setBrickField={this.setBrickField}
                saveBrick={this.saveAndMove}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
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
  socketStartEditing: (brickId: number) => dispatch(socketActions.socketStartEditing(brickId)),
});

const connector = connect(mapState, mapDispatch);

export default connector(Proposal);
