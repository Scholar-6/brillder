import React from "react";
import * as Y from "yjs";
import { Route } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core";
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
import { BrickFieldNames, BrickLengthRoutePart, BriefRoutePart, OpenQuestionRoutePart, PlayButtonStatus, PrepRoutePart, ProposalReviewPart, TitleRoutePart } from "./model";
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
import { YJSContext } from "../baseComponents/YJSProvider";

interface ProposalProps {
  history: History;
  match: any;
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
  moving: boolean;
  handleKey(e: any): void;
}

class Proposal extends React.Component<ProposalProps, ProposalState> {
  static contextType = YJSContext;
  context!: React.ContextType<typeof YJSContext>;

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

    this.state = {
      brick: initBrick,
      saved: false,
      saving: false,
      isDialogOpen: false,
      moving: false,
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
    const baseUrl = this.getBaseUrl();

    if (rightKeyPressed(e)) {
      if (pathname === map.ProposalSubject) {
        if (this.state.brick.subjectId) {
          history.push(baseUrl + TitleRoutePart);
        }
      } else if (pathname.slice(-TitleRoutePart.length) === TitleRoutePart) {
        history.push(baseUrl + OpenQuestionRoutePart);
      } else if (pathname.slice(-OpenQuestionRoutePart.length) === OpenQuestionRoutePart) {
        history.push(baseUrl + BrickLengthRoutePart);
      } else if (pathname.slice(-BrickLengthRoutePart.length) === BrickLengthRoutePart) {
        history.push(baseUrl + BriefRoutePart );
      } else if (pathname.slice(-BrickLengthRoutePart.length) === BrickLengthRoutePart) {
        history.push(baseUrl + BriefRoutePart);
      } else if (pathname.slice(-BriefRoutePart.length) === BriefRoutePart) {
        history.push(baseUrl + PrepRoutePart);
      } else if (pathname.slice(-PrepRoutePart.length) === PrepRoutePart) {
        this.saveLocalBrick(this.state.brick);
        await this.saveBrick(this.state.brick);
        history.push(baseUrl + ProposalReviewPart);
      }
    } else if (leftKeyPressed(e)) {
      console.log(pathname, pathname.slice(-BrickLengthRoutePart.length), BrickLengthRoutePart);

      if (pathname.slice(-OpenQuestionRoutePart.length) === OpenQuestionRoutePart) {
        history.push(baseUrl + TitleRoutePart)
      } else if (pathname.slice(-BrickLengthRoutePart.length) === BrickLengthRoutePart) {
        history.push(baseUrl + OpenQuestionRoutePart)
      } else if (pathname.slice(-BriefRoutePart.length) === BriefRoutePart) {
        history.push(baseUrl + BrickLengthRoutePart)
      } else if (pathname.slice(-PrepRoutePart.length) === PrepRoutePart) {
        history.push(baseUrl + BriefRoutePart);
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
    this.setState({ brick });
    setLocalBrick(brick);
  }

  setCore = (isCore: boolean) => {
    this.saveLocalBrick({ ...this.state.brick, isCore });
    this.context?.ydoc.getMap("brick").set("isCore", isCore);
  }
  setSubject = (subjectId: number) => {
    this.saveLocalBrick({ ...this.state.brick, subjectId });
    this.context?.ydoc.getMap("brick").set("subjectId", subjectId);
  }
  setCoreAndSubject = (subjectId: number, isCore: boolean) => {
    this.saveLocalBrick({ ...this.state.brick, subjectId, isCore });
    this.context?.ydoc.getMap("brick").set("isCore", isCore);
    this.context?.ydoc.getMap("brick").set("subjectId", subjectId);
  }
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
    this.context?.ydoc.getMap("brick").set("brickLength", brickLength);
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

  getBaseUrl() {
    const {brickId} = this.props.match.params;
    if (brickId) {
      return '/build/brick/' + brickId;
    }
    return map.ProposalBase;
  }

  render() {
    const baseUrl = this.getBaseUrl();
    const { history } = this.props;
    const canEdit = canEditBrick(this.state.brick, this.props.user);

    setBrillderTitle();

    if (this.state.saved && this.state.moving === false) {
      this.setState({moving: true});

      if (this.props.brick) {
        history.push(
          `/build/brick/${this.props.brick.id}/investigation/question`
        );
      } else if (this.state.brick.id) {
        history.push(
          `/build/brick/${this.state.brick.id}/investigation/question`
        );
      } else {
        history.push(baseUrl + TitleRoutePart);
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
        <div>
          <HomeButton onClick={() => this.openDialog()} />
          <div
            style={{ width: "100%", height: "100%" }}
            className="proposal-router"
          >
            <Route path={[map.ProposalSubject, '/build/brick/:brickId/subject']}>
              <SubjectPage
                location={history.location}
                baseUrl={baseUrl}
                subjects={user.subjects}
                subjectId={this.context?.ydoc.getMap("brick").get("subjectId")}
                history={history}
                saveCore={this.setCore}
                saveSubject={this.setSubject}
                saveData={this.setCoreAndSubject}
              />
            </Route>
            <Route path={[map.ProposalTitle, '/build/brick/:brickId/brick-title']}>
              <BrickTitle
                user={user}
                history={history}
                baseUrl={baseUrl}
                playStatus={playStatus}
                parentState={this.context!.ydoc.getMap("brick")}
                canEdit={canEdit}
                subjects={this.state.subjects}
                saveTitles={this.setTitles}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={[map.ProposalLength, '/build/brick/:brickId/length']}>
              <BrickLength
                baseUrl={baseUrl}
                playStatus={playStatus}
                length={this.context?.ydoc.getMap("brick").get("brickLength")}
                canEdit={canEdit}
                saveLength={this.setLength}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={[map.ProposalOpenQuestion, '/build/brick/:brickId/open-question']}>
              <OpenQuestion
                baseUrl={baseUrl}
                playStatus={playStatus}
                history={history}
                selectedQuestion={this.context?.ydoc.getMap("brick").get("openQuestion")}
                canEdit={canEdit}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={[map.ProposalBrief, '/build/brick/:brickId/brief']}>
              <Brief
                baseUrl={baseUrl}
                playStatus={playStatus}
                parentBrief={this.context?.ydoc.getMap("brick").get("brief")}
                canEdit={canEdit}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={[map.ProposalPrep, '/build/brick/:brickId/prep']}>
              <Prep
                playStatus={playStatus}
                parentPrep={this.context?.ydoc.getMap("brick").get("prep")}
                canEdit={canEdit}
                baseUrl={baseUrl}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            
            <Route path={[map.ProposalReview, '/build/brick/:brickId/plan']}>
              <ProposalReview
                playStatus={playStatus}
                brick={this.context!.ydoc.getMap("brick")}
                baseUrl={baseUrl}
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
