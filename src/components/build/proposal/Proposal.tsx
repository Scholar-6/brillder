import React from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { History, Location } from "history";
import queryString from 'query-string';


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
import { getBrillderTitle } from "components/services/titleService";
import { canEditBrick } from "components/services/brickService";
import { ReduxCombinedState } from "redux/reducers";
import { AlternateSubjectRoutePart, BrickFieldNames, BrickLengthRoutePart, BriefRoutePart, OpenQuestionRoutePart, PrepRoutePart, ProposalReviewPart, SubjectRoutePart, TitleRoutePart } from "./model";
import map from "components/map";

import { setLocalBrick, getLocalBrick } from "localStorage/proposal";
import { leftKeyPressed, rightKeyPressed } from "components/services/key";
import { buildQuesitonType } from "../routes";
import { Helmet } from "react-helmet";
import { getSubjects } from "services/axios/subject";

interface ProposalProps {
  history: History;
  match: any;
  location: Location;

  //redux
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
    const { user } = props;
    const { subjects } = user;
    if (subjects.length === 1) {
      subjectId = subjects[0].id;
    }

    const values = queryString.parse(props.location.search);
    const isCore = this.getCore(values);

    let initBrick = {
      subjectId,
      brickLength: BrickLengthEnum.S20min,
      isCore,
      topic: "",
      subTopic: "",
      alternativeTopics: "",
      title: "",
      openQuestion: "",
      brief: "",
      prep: "",
      synthesis: "",
    } as Brick;

    if (props.match.params.brickId) {
      initBrick.id = props.match.params.brickId;
    }


    if (user) {
      initBrick.author = (user as any) as Author;
    }

    // getting brick from local storage
    let localBrick = getLocalBrick();
    if (localBrick) {
      initBrick = localBrick;
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

  getCore(values: queryString.ParsedQuery<string>) {
    if (values.isCore === 'false') {
      return false;
    } else if (values.isCore === 'true') {
      return true;
    }
    return false;
  }

  async handleKey(e: any) {
    if (e.target.tagName === "INPUT") { return; }
    if (e.target.classList.contains("ql-editor")) { return; }

    const { history } = this.props;
    const { pathname } = this.props.location;
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
        history.push(baseUrl + BriefRoutePart);
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
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
    }
  }

  async saveBrick(tempBrick: Brick) {
    let newBrick = null;
    try {
      if (this.state.saving === true) { return; }
      this.setState({ saving: true });
      if (tempBrick.id) {
        newBrick = await this.props.saveBrick(tempBrick);
      } else {
        newBrick = await this.props.createBrick(tempBrick);
      }
      this.setState({ saving: false });
    } catch (e) {
      this.setState({ hasSaveError: true });
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

  setSubject = (subjectId: number) => {
    this.saveLocalBrick({ ...this.state.brick, subject: undefined, subjectId });
  }

  setAlternateSubject = (alternateSubjectId: number) => {
    if (alternateSubjectId === -1) {
      this.saveLocalBrick({ ...this.state.brick, alternateSubject: undefined, alternateSubjectId: null });
    } else {
      this.saveLocalBrick({ ...this.state.brick, alternateSubject: undefined, alternateSubjectId });
    }
  }

  setCore = (isCore: boolean) =>
    this.saveLocalBrick({ ...this.state.brick, isCore });
  setCoreAndSubject = (subjectId: number, isCore: boolean) =>
    this.saveLocalBrick({ ...this.state.brick, subjectId, isCore });
  setTitles = (titles: any) =>
    this.saveLocalBrick({ ...this.state.brick, ...titles });
  setKeywords = (keywords: KeyWord[]) =>
    this.saveLocalBrick({ ...this.state.brick, keywords });
  setAcademicLevel = (academicLevel: AcademicLevel) =>
    this.saveLocalBrick({ ...this.state.brick, academicLevel });
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
    await this.saveBrick(brick);
    this.props.history.push(buildQuesitonType(this.state.brick.id));
  };

  createBrick = async () => {
    console.log('create brick')
    if (this.state.brick.subjectId) {
      const newBrick = await this.saveBrick(this.state.brick);
      if (newBrick) {
        const { isCore } = this.state.brick;
        if (this.state.brick.subjectId) {
          this.props.history.push(map.ProposalTitle(newBrick.id) + '?isCore=' + isCore);
        } else {
          this.props.history.push(map.ProposalSubject(newBrick.id) + '?isCore=' + isCore);
        }
      }
    }
  }

  saveAndMove = async () => {
    if (this.state.saving === true) { return; }
    this.setState({ saving: true });
    await this.saveBrick(this.state.brick);
    this.setState({ saved: true, saving: false });
  };

  getBaseUrl() {
    const { brickId } = this.props.match.params;
    if (brickId) {
      return map.ProposalBase(brickId);
    }
    return map.NewBrick;
  }

  render() {
    let brickId = this.props.match.params.brickId as any;

    if (brickId) {
      brickId = parseInt(brickId);
    }

    if (brickId && !this.state.brick.id) {
      /* eslint-disable-next-line */
      this.state.brick.id = parseInt(brickId);
    }

    const baseUrl = this.getBaseUrl();
    const { history } = this.props;
    const canEdit = canEditBrick(this.state.brick, this.props.user);

    if (this.state.saved && this.state.moving === false) {
      this.setState({ moving: true });

      if (this.state.brick.id) {
        history.push(
          `/build/brick/${this.state.brick.id}/investigation/question`
        );
      } else {
        history.push(baseUrl + TitleRoutePart);
      }
    }

    const localBrick = this.state.brick;
    const { user } = this.props;

    return (
      <div>
        <Helmet>
          <title>{getBrillderTitle()}</title>
        </Helmet>
        <HomeButton history={this.props.history} onClick={() => this.openDialog()} />
        <div
          style={{ width: "100%", height: "100%" }}
          className="proposal-router"
        >
          <Route path={[baseUrl + SubjectRoutePart]}>
            <SubjectPage
              location={history.location}
              baseUrl={baseUrl}
              subjects={user.subjects}
              subjectId={this.state.brick.subjectId ? this.state.brick.subjectId : ""}
              title="Choose Main Subject"
              saveSubject={this.setSubject}
            />
          </Route>
          <Route path={[baseUrl + AlternateSubjectRoutePart]}>
            <SubjectPage
              location={history.location}
              isAlternateSubject={true}
              baseUrl={baseUrl}
              title="Alternate Subject?"
              subjects={user.subjects}
              mainSubjectId={this.state.brick.subjectId}
              subjectId={this.state.brick.alternateSubjectId ? this.state.brick.alternateSubjectId : ""}
              saveSubject={this.setAlternateSubject}
            />
          </Route>
          <Route path={[baseUrl + TitleRoutePart]}>
            <BrickTitle
              user={user}
              brickId={brickId}
              history={history}
              baseUrl={baseUrl}
              parentState={localBrick}
              canEdit={canEdit}
              subjects={this.state.subjects}
              saveTitles={this.setTitles}
              setKeywords={this.setKeywords}
              setAcademicLevel={this.setAcademicLevel}
              createBrick={this.createBrick}
            />
          </Route>
          <Route path={[baseUrl + '/length']}>
            <BrickLength
              updated={localBrick.updated}
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
