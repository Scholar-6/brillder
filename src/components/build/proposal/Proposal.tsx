import React from "react";
import { Route } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { connect } from "react-redux";
import { History, Location } from "history";

import "./Proposal.scss";
import actions from "redux/actions/brickActions";
import * as socketActions from "redux/actions/socket";
import SubjectPage from "./questionnaire/subject/Subject";
import BrickTitle from "./questionnaire/brickTitle/brickTitle";
import OpenQuestion from "./questionnaire/openQuestion/openQuestion";
import { AcademicLevel, BrickLengthEnum, KeyWord, Subject } from "model/brick";
import BrickLength from "./questionnaire/brickLength/brickLength";
import Brief from "./questionnaire/brief/brief";
import Prep from "./questionnaire/prep/prep";
import HomeButton from "components/baseComponents/homeButton/HomeButton";
import { Brick, Author } from "model/brick";
import { User } from "model/user";
import CloseProposalDialog from "components/build/baseComponents/dialogs/CloseProposalDialog";
import VersionLabel from "components/baseComponents/VersionLabel";
import { setBrillderTitle } from "components/services/titleService";
import { canEditBrick } from "components/services/brickService";
import { ReduxCombinedState } from "redux/reducers";
import { BrickFieldNames, BrickLengthRoutePart, BriefRoutePart, OpenQuestionRoutePart, PrepRoutePart, ProposalReviewPart, SubjectRoutePart, TitleRoutePart } from "./model";
import {
  parseQuestion,
  ApiQuestion,
} from "components/build/questionService/QuestionService";
import map from "components/map";

import { setLocalBrick, getLocalBrick } from "localStorage/proposal";
import { Question } from "model/question";
import { loadSubjects } from "components/services/subject";
import { leftKeyPressed, rightKeyPressed } from "components/services/key";
import { buildQuesitonType } from "../routes";
import StartBuildingPage from "./questionnaire/StartBuilding/StartBuilding";

interface ProposalProps {
  history: History;
  match: any;
  location: Location;

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
  hasSaveError: boolean;
  saved: boolean;
  subjects: Subject[];
  isDialogOpen: boolean;
  moving: boolean;
  handleKey(e: any): void;
}

class Proposal extends React.Component<ProposalProps, ProposalState> {
  constructor(props: ProposalProps) {
    super(props);
    let subjectId = undefined;
    const { user, brick } = props;
    const { subjects } = user;
    if (subjects.length === 1) {
      subjectId = subjects[0].id;
    }
    let initBrick = {
      subjectId,
      brickLength: BrickLengthEnum.S20min,
      topic: "",
      subTopic: "",
      alternativeTopics: "",
      title: "",
      openQuestion: "",
      brief: "",
      prep: "",
      synthesis: "",
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
      hasSaveError: false,
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
    if (e.target.classList.contains("ql-editor")) { return; }

    const {history} = this.props;
    const {pathname} = this.props.location;
    const baseUrl = this.getBaseUrl();

    if (rightKeyPressed(e)) {
      if (pathname.slice(-SubjectRoutePart.length) === SubjectRoutePart) {
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
    let newBrick = null;
    try {
      if (this.state.saving === true) { return; }
      this.setState({saving: true});
      const { brick } = this.props;
      if (tempBrick.id) {
        await this.props.saveBrick(tempBrick);
      } else if (brick && brick.id) {
        tempBrick.id = brick.id;
        newBrick = await this.props.saveBrick(tempBrick);
      } else {
        newBrick = await this.props.createBrick(tempBrick);
      }
      this.setState({saving: false});
    } catch {
      this.setState({hasSaveError: true});
    }
    return newBrick;
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

  setCore = (isCore: boolean) =>
    this.saveLocalBrick({ ...this.state.brick, isCore });
  setSubject = (subjectId: number) =>
    this.saveLocalBrick({ ...this.state.brick, subject: undefined, subjectId });
  setCoreAndSubject = (subjectId: number, isCore: boolean) => 
    this.saveLocalBrick({ ...this.state.brick, subjectId, isCore });
  setTitles = (titles: any) =>
    this.saveLocalBrick({ ...this.state.brick, ...titles });
  setKeywords = (keywords: KeyWord[]) =>
    this.saveLocalBrick({ ...this.state.brick, keywords});
  setAcademicLevel = (academicLevel: AcademicLevel) =>
    this.saveLocalBrick({ ...this.state.brick, academicLevel});
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

  setPrepAndSave = async (prep: string) => {
    const brick = { ...this.state.brick, prep } as Brick;
    this.saveLocalBrick(brick);
    const newBrick = await this.saveBrick(brick);
    console.log(newBrick);
    this.props.history.push(buildQuesitonType(brick.id));
  };

  saveAndMove = async () => {
    if (this.state.saving === true) { return; }
    this.setState({ saving: true });
    await this.saveBrick(this.state.brick);
    this.setState({ saved: true, saving: false });
  };

  getBaseUrl() {
    const {brickId} = this.props.match.params;
    if (brickId) {
      return map.ProposalBase(brickId);
    }
    return map.NewBrick;
  }

  render() {
    const {brickId} = this.props.match.params;
    console.log(this.state.brick.subjectId);
    if(!brickId && this.state.brick.subjectId) {
      const callback = async () => {
        const newBrick = await this.saveBrick(this.state.brick);
        if(newBrick) {
          history.push(map.ProposalSubject(newBrick.id));
        }
      }
      callback();
    }

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

    const { brick } = this.props;
    if (brick && brick.questions && brick.questions.length > 0) {
      const parsedQuestions: Question[] = [];
      for (const question of brick.questions) {
        try {
          parseQuestion(question as ApiQuestion, parsedQuestions);
        } catch (e) { }
      }
    }

    return (
      <MuiThemeProvider>
        <div>
          <HomeButton onClick={() => this.openDialog()} />
          <div
            style={{ width: "100%", height: "100%" }}
            className="proposal-router"
          >
            <Route path={map.ProposalStart}>
              <StartBuildingPage />
            </Route>
            <Route path={[baseUrl + '/subject']}>
              <SubjectPage
                location={history.location}
                baseUrl={baseUrl}
                subjects={user.subjects}
                subjectId={this.state.brick.subjectId ? this.state.brick.subjectId : ""}
                history={history}
                saveCore={this.setCore}
                saveSubject={this.setSubject}
                saveData={this.setCoreAndSubject}
              />
            </Route>
            <Route path={[baseUrl + '/brick-title']}>
              <BrickTitle
                user={user}
                history={history}
                baseUrl={baseUrl}
                parentState={localBrick}
                canEdit={canEdit}
                subjects={this.state.subjects}
                saveTitles={this.setTitles}
                setKeywords={this.setKeywords}
                setAcademicLevel={this.setAcademicLevel}
              />
            </Route>
            <Route path={[baseUrl + '/length']}>
              <BrickLength
                updated={brick ? brick.updated : localBrick.updated}
                baseUrl={baseUrl}
                length={localBrick.brickLength}
                canEdit={canEdit}
                saveLength={this.setLength}
                saveBrick={this.setLength}
              />
            </Route>
            <Route path={[baseUrl + '/open-question']}>
              <OpenQuestion
                updated={localBrick.updated}
                baseUrl={baseUrl}
                history={history}
                selectedQuestion={localBrick.openQuestion}
                canEdit={canEdit}
                saveOpenQuestion={this.setOpenQuestion}
              />
            </Route>
            <Route path={[baseUrl + '/brief']}>
              <Brief
                baseUrl={baseUrl}
                parentBrief={localBrick.brief}
                updated={localBrick.updated}
                canEdit={canEdit}
                saveBrief={this.setBrief}
              />
            </Route>
            <Route path={[baseUrl + '/prep']}>
              <Prep
                updated={localBrick.updated}
                parentPrep={localBrick.prep}
                canEdit={canEdit}
                baseUrl={baseUrl}
                savePrep={this.setPrep}
                brickLength={localBrick.brickLength}
                saveBrick={this.setPrepAndSave}
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
