import React, { useContext } from "react";
import { Redirect, RouteComponentProps, Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import queryString from 'query-string';
import * as Y from "yjs";
import _ from "lodash";

import "./investigationBuildPage.scss";
import routes from './routes';
import map from 'components/map';
import PlanPage from './plan/Plan';
import {
  Question,
  QuestionTypeEnum,
} from "model/question";
import actions from "redux/actions/brickActions";
import { socketStartEditing, socketNavigateToQuestion } from "redux/actions/socket";
import { isHighlightInvalid, validateBrick, validateHint, validateQuestions } from "./questionService/ValidateQuestionService";
import {
  getNewQuestion,
  removeQuestionByIndex,
  setQuestionTypeByIndex,
  getFirstInvalidQuestion,
  getUniqueComponent,
} from "./questionService/QuestionService";
import { convertToQuestionType } from "./questionService/ConvertService";
import { User } from "model/user";
import { setBrillderTitle } from "components/services/titleService";
import { canEditBrick, checkAdmin, checkPublisher } from "components/services/brickService";
import { ReduxCombinedState } from "redux/reducers";
import { validateProposal } from 'components/build/proposal/service/validation';
import UndoRedoService from "components/services/UndoRedoService";
import { Brick } from "model/brick";

import QuestionPanelWorkArea from "./buildQuestions/questionPanelWorkArea";
import TutorialWorkArea, { TutorialStep } from './tutorial/TutorialPanelWorkArea';
import QuestionTypePage from "./questionType/questionType";
import SynthesisPage from "./synthesisPage/SynthesisPage";
import LastSave from "components/build/baseComponents/lastSave/LastSave";
import DragableTabs from "./dragTabs/dragableTabs";
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import PhoneQuestionPreview from "components/build/baseComponents/phonePreview/phoneQuestionPreview/PhoneQuestionPreview";
import SynthesisPreviewComponent from "./baseComponents/phonePreview/synthesis/SynthesisPreview";
import QuestionTypePreview from "components/build/baseComponents/QuestionTypePreview";
import TutorialPhonePreview from "./tutorial/TutorialPreview";
import YourProposalLink from './baseComponents/YourProposalLink';
import TutorialLabels from './baseComponents/TutorialLabels';
import PageLoader from "components/baseComponents/loaders/pageLoader";

import QuestionInvalidDialog from './baseComponents/dialogs/QuestionInvalidDialog';
import HighlightInvalidDialog from './baseComponents/dialogs/HighlightInvalidDialog';
import HintInvalidDialog from './baseComponents/dialogs/HintInvalidDialog';
import ProposalInvalidDialog from './baseComponents/dialogs/ProposalInvalidDialog';
import SkipTutorialDialog from "./baseComponents/dialogs/SkipTutorialDialog";
import BuildNavigation from "./baseComponents/BuildNavigation";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import { BrickLengthRoutePart, BriefRoutePart, OpenQuestionRoutePart, PrepRoutePart, ProposalReviewPart, TitleRoutePart } from "./proposal/model";
import { YJSContext } from "./baseComponents/YJSProvider";
import { convertQuestion, toRenderJSON } from "services/SharedTypeService";
import DeleteDialog from "./baseComponents/dialogs/DeleteDialog";
import service, { getPreviewLink, getQuestionType } from "./services/buildService";


export interface InvestigationBuildProps extends RouteComponentProps<any> {
  user: User;
  reduxBrick: Brick;
  startEditing(brickId: number): void;
  changeQuestion(questionId?: number): void;
  forgetBrick(): void;
}

const InvestigationBuildPage: React.FC<InvestigationBuildProps> = props => {
  const { params } = props.match;
  const brickId = parseInt(params.brickId);

  const values = queryString.parse(props.location.search);
  let initSuggestionExpanded = false;
  if (values.suggestionsExpanded) {
    initSuggestionExpanded = true;
  }

  const isCurrentEditor = (props.reduxBrick.editors?.findIndex((e: any) => e.id === props.user.id) ?? -1) >= 0;
  if (isCurrentEditor) {
    initSuggestionExpanded = true;
  }

  const { history } = props;

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  const [lastQuestionDialog, setLastQuestionDialog] = React.useState(false);
  let [locked, setLock] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialog] = React.useState(false);
  const [submitDialogOpen, setSubmitDialog] = React.useState(false);
  const [invalidHint, setInvalidHint] = React.useState({
    isOpen: false,
    questionNumber: -1
  });
  const [highlightInvalid, setInvalidHighlight] = React.useState({
    isOpen: false,
    isLine: false
  });
  const [movingFromSynthesis, setMovingFromSynthesis] = React.useState(false);
  const [proposalInvalidOpen, setProposalInvalidOpen] = React.useState(false);
  const [validationRequired, setValidation] = React.useState(false);
  const [deleteQuestionIndex, setDeleteIndex] = React.useState(-1);
  const [activeQuestionType] = React.useState(QuestionTypeEnum.None);
  const [hoverQuestion, setHoverQuestion] = React.useState(QuestionTypeEnum.None);
  const [skipTutorialOpen, setSkipDialog] = React.useState(false);
  const [tutorialSkipped, skipTutorial] = React.useState(false);
  const [step, setStep] = React.useState(TutorialStep.Proposal);
  const [focusIndex, setFocusIndex] = React.useState(-1);
  const [undoRedoService] = React.useState(UndoRedoService.instance);

  /* Synthesis */
  let isSynthesisPage = false;
  if (history.location.pathname.slice(-10).toLowerCase() === '/synthesis') {
    isSynthesisPage = true;
  }

  /* Proposal */
  const validRoutes = ["/investigation", "/synthesis", "/subject", TitleRoutePart, OpenQuestionRoutePart, BrickLengthRoutePart, BriefRoutePart, PrepRoutePart, ProposalReviewPart];
  const isProposalPage = validRoutes.includes(props.location.pathname.split("/")[4]);

  const { ydoc } = useContext(YJSContext)!;
  const ybrick = ydoc!.getMap("brick")!;

  if (!ybrick) {
    return <PageLoader content="Getting brick..." />
  }

  const questions = ybrick.get("questions") as Y.Array<Y.Doc>;
  let synthesis = ybrick.get("synthesis") as Y.Text;

  const proposalResult = validateProposal(toRenderJSON(ybrick));

  let isAuthor = false;
  try {
    isAuthor = props.reduxBrick.author.id === props.user.id;
  } catch { }

  const openSkipTutorial = () => {
    setSkipDialog(true);
  }

  const undo = () => {
    // TODO: implement undo
  }

  const redo = () => {
    // TODO: implement redo
  }

  let canEdit = canEditBrick(props.reduxBrick, props.user);
  locked = canEdit ? locked : true;

  setBrillderTitle(ybrick.get("title"));

  const getQuestionIndex     = (question: Y.Doc) =>    service.getQuestionIndex(question, questions);
  const getJSONQuestionIndex = (question: Question) => service.getJSONQuestionIndex(question, questions);

  const createQuestion = () => {
    const newQuestion = convertQuestion(getNewQuestion(QuestionTypeEnum.None, false))
    questions.push([newQuestion]);
    setCurrentQuestionIndex(questions.length - 1);
  }

  let activeQuestion: Y.Doc = undefined as any;
  if (currentQuestionIndex !== -1) {
    activeQuestion = questions.get(currentQuestionIndex);
    if (activeQuestion) {
      questions.map((q: Y.Doc) => q.load());
    }
  }
  if (isSynthesisPage || isProposalPage) {
    if (activeQuestion) {
      if (movingFromSynthesis === false) {
        setCurrentQuestionIndex(-1);
      }
      return <PageLoader content="...Loading..." />;
    }
  } else if (_.isEmpty(activeQuestion?.toJSON()) || _.isEmpty(activeQuestion?.getMap()?.toJSON())) {
    if (questions.length <= 0) {
      if (!canEdit || locked) { return <PageLoader content="...Loading..." />; }
      createQuestion();
    }
    return <PageLoader content="...Loading..." />;
  }

  if (activeQuestion) {
    if (movingFromSynthesis) {
      setMovingFromSynthesis(false);
    }
  }

  /* Changing question number by tabs in build */
  const setPrevFromPhone = () => {
    if (currentQuestionIndex >= 1) {
      setCurrentQuestionIndex(index => index - 1);
    }
  }

  const setNextQuestion = () => {
    let lastIndex = questions.length - 1;
    if (currentQuestionIndex < lastIndex) {
      setCurrentQuestionIndex(index => index + 1);
    } else {
      history.push(map.InvestigationSynthesis(brickId));
    }
  };
  /* Changing question in build */

  const createNewQuestion = () => {
    if (!isTutorialPassed()) {
      setSkipDialog(true);
      return;
    }
    if (!canEdit) { return; }
    if (locked) { return; }

    createQuestion();

    const {pathname} = history.location;

    if (
      pathname.slice(-10) === routes.BuildSynthesisLastPrefix ||
      pathname.slice(-5) === routes.BuildPlanLastPrefix
    ) {
      history.push(`/build/brick/${brickId}/investigation/question`);
    }
  };

  const moveToSynthesis = () => {
    history.push(map.InvestigationSynthesis(brickId));
  };

  const setQuestionTypeAndMove = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    setQuestionType(type);
    history.push(map.InvestigationBuild(brickId));
  };

  const componentFocus = (index: number) => {
    setFocusIndex(index);
  };

  const setQuestionType = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    var index = getQuestionIndex(activeQuestion);
    setQuestionTypeByIndex(questions, index, type);
  };

  const convertQuestionTypes = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    convertToQuestionType(questions, activeQuestion, type);
  };

  const deleteQuestionByIndex = (index: number) => {
    removeQuestionByIndex(questions, index);
    setDeleteDialog(false);
    setCurrentQuestionIndex(deleteQuestionIndex <= 0 ? 0 : deleteQuestionIndex - 1);
  };

  const removeQuestion = (index: number) => {
    if (locked) { return; }
    if (questions.length === 1) {
      setLastQuestionDialog(true);
      return;
    }
    if (questions.get(index).get("type")) {
      setDeleteDialog(true);
      setDeleteIndex(index);
      return;
    }
    deleteQuestionByIndex(index);
  };

  const selectQuestion = (index: number) => {
    const {pathname} = history.location;
    if (
      pathname.slice(-10) === routes.BuildSynthesisLastPrefix ||
      pathname.slice(-5) === routes.BuildPlanLastPrefix
    ) {
      setMovingFromSynthesis(true);
    }
    setCurrentQuestionIndex(index);
    if (
      pathname.slice(-10) === routes.BuildSynthesisLastPrefix ||
      pathname.slice(-5) === routes.BuildPlanLastPrefix
    ) {
      history.push(`/build/brick/${brickId}/investigation/question`);
    }
  };

  const toggleLock = () => {
    setLock(!locked);
    ybrick.set("locked", !locked);
  };

  if (ybrick.get("id") !== brickId) {
    return <PageLoader content="...Loading..." />;
  };

  const moveToReview = () => {
    const invalidQuestion = validateQuestions(questions);

    // synthesis invalid
    if ((!synthesis || synthesis.toString().trim()) === "" && !invalidQuestion) {
      setSubmitDialog(true);
      return;
    }

    if (invalidQuestion) {
      const invalidQuestionJson = invalidQuestion.getMap().toJSON() as Question;
      const invalid = isHighlightInvalid(invalidQuestionJson);
      if (invalid === false) {
        let isLine = false;
        if (invalidQuestionJson.type === QuestionTypeEnum.LineHighlighting) {
          isLine = true;
        }
        setInvalidHighlight({ isOpen: true, isLine });
      } else {
        const comp = getUniqueComponent(invalidQuestion).toJSON();

        let answersCount = 1;
        if (comp.list) {
          answersCount = comp.list.length;
        }
        let isHintInvalid = validateHint(invalidQuestionJson.hint, answersCount);
        if (isHintInvalid) {
          let index = getQuestionIndex(invalidQuestion);
          setInvalidHint({ isOpen: true, questionNumber: index + 1 });
        } else {
          setSubmitDialog(true);
        }
      }
    } else {
      if (proposalResult.isValid) {
        const link = getPreviewLink(brickId, isSynthesisPage);
        props.forgetBrick();
        history.push(link);
      } else {
        setProposalInvalidOpen(true);
      }
    }
  }

  const moveToInvalidProposal = () => {
    history.push(proposalResult.url);
  }

  const submitInvalidBrick = () => {
    history.push(`/back-to-work`);
  }

  const moveToRedTab = () => {
    const index = getFirstInvalidQuestion(toRenderJSON(questions));
    setCurrentQuestionIndex(index);
  }

  const hideInvalidBrick = () => {
    setValidation(true);
    setSubmitDialog(false);
    moveToRedTab();
  }

  const exitAndSave = () => {
    history.push('/home');
  }

  const renderQuestionComponent = () => {
    if (!isTutorialPassed()) {
      return (
        <TutorialWorkArea
          brickId={brickId}
          step={step}
          setStep={setStep}
          user={props.user}
          skipTutorial={() => skipTutorial(true)}
        />
      );
    }
    const type = getQuestionType(activeQuestion);
    return (
      <QuestionTypePage
        history={history}
        brickId={brickId}
        setHoverQuestion={setHoverQuestion}
        questionId={activeQuestion.getMap().get("id")}
        setQuestionType={setQuestionTypeAndMove}
        questionType={type}
      />
    );
  };

  const isTutorialPassed = () => {
    return true;
    /*
    const isCurrentEditor = (props.reduxBrick.editors?.findIndex((e: any) => e.id === props.user.id) ?? -1) >= 0;

    if (isCurrentEditor || props.user.tutorialPassed || tutorialSkipped || questions.length > 1) {
      return true;
    }
    if (questions.get(0)?.getMap() && questions.get(0)?.getMap().get("type") !== QuestionTypeEnum.None) {
      return true;
    }
    return false;*/
  }

  const renderPanel = () => {
    return (
      <Switch>
        <Route path={routes.planRoute}>
          <PlanPage
            locked={locked}
            editOnly={!canEdit}
            user={props.user}
            ybrick={ybrick}
            initSuggestionExpanded={initSuggestionExpanded}
            undoRedoService={undoRedoService}
            undo={undo}
            redo={redo}
          />
        </Route>
        <Route path="/build/brick/:brickId/investigation/question-component">
          <QuestionPanelWorkArea
            brickId={brickId}
            history={history}
            synthesis={ybrick.get("synthesis")}
            questionsCount={questions ? questions.length : 0}
            yquestion={activeQuestion}
            canEdit={canEdit}
            locked={locked}
            isAuthor={isAuthor}
            validationRequired={validationRequired}
            initSuggestionExpanded={initSuggestionExpanded}
            componentFocus={componentFocus}
            getQuestionIndex={getQuestionIndex}
            toggleLock={toggleLock}
            setQuestionType={convertQuestionTypes}
            undo={undo}
            redo={redo}
            undoRedoService={undoRedoService}
          />
        </Route>
        <Route path="/build/brick/:brickId/investigation/question">
          {renderQuestionComponent}
        </Route>
        <Route path="/build/brick/:brickId/synthesis">
          <SynthesisPage
            locked={locked}
            editOnly={!canEdit}
            ybrick={ybrick}
            initSuggestionExpanded={initSuggestionExpanded}
            undoRedoService={undoRedoService}
            undo={undo}
            redo={redo}
          />
        </Route>
      </Switch>
    );
  }

  const renderQuestionTypePreview = () => {
    if (isTutorialPassed()) {
      return <QuestionTypePreview
        hoverQuestion={hoverQuestion}
        activeQuestionType={activeQuestionType}
        nextQuestion={setNextQuestion}
        prevQuestion={setPrevFromPhone}
      />;
    }
    return <TutorialPhonePreview step={step} />;
  }

  const isValid = validateBrick(questions, synthesis);

  const isPublisher = checkPublisher(props.user, props.reduxBrick);
  const isAdmin = checkAdmin(props.user.roles);

  return (
    <div className="investigation-build-page">
      <BuildNavigation
        tutorialStep={step}
        user={props.user}
        isTutorialSkipped={isTutorialPassed()}
        isValid={isValid}
        moveToReview={moveToReview}
        isEditor={isCurrentEditor}
        isPublisher={isPublisher}
        isAdmin={isAdmin}
        isAuthor={isAuthor}
        history={history}
        brick={props.reduxBrick}
        exitAndSave={exitAndSave}
      />
      <TutorialLabels isTutorialPassed={isTutorialPassed()} />
      <Grid
        container direction="row"
        className="investigation-build-background"
        alignItems="center"
      >
        <Grid
          container
          item xs={12} sm={12} md={9}
          alignItems="center"
          style={{ height: "100%" }}
          className="question-container"
        >
          <Grid
            container direction="row"
            justify="center" alignItems="center"
            style={{ height: "100%" }}
          >
            <div className="build-brick-title">
              <div>{ybrick.get("title").toString()}</div>
            </div>
            <Grid
              container
              item xs={12} sm={12} md={9}
              style={{ height: "90%", width: "75vw", minWidth: 'none' }}
            >
              <DragableTabs
                history={history}
                brickId={brickId}
                yquestions={questions}
                currentQuestionIndex={currentQuestionIndex}
                synthesis={synthesis.toString()}
                validationRequired={validationRequired}
                tutorialSkipped={isTutorialPassed()}
                openSkipTutorial={openSkipTutorial}
                tutorialStep={isTutorialPassed() ? TutorialStep.None : step}
                isSynthesisPage={isSynthesisPage}
                moveToSynthesis={moveToSynthesis}
                createNewQuestion={createNewQuestion}
                selectQuestion={selectQuestion}
                removeQuestion={removeQuestion}
              />
              {renderPanel()}
            </Grid>
          </Grid>
        </Grid>
        <LastSave updated={new Date(ybrick.get("updated")).toString()} tutorialStep={isTutorialPassed() ? TutorialStep.None : step} isSaving={false} saveError={false} />
        <Route path="/build/brick/:brickId/investigation/" exact>
          <Redirect to={`/build/brick/${ybrick.get("id")}/investigation/question`} />
        </Route>
        <Route path="/build/brick/:brickId/investigation/question-component">
          {activeQuestion &&
            <PhoneQuestionPreview
              question={toRenderJSON(activeQuestion.getMap())}
              focusIndex={focusIndex}
              getQuestionIndex={getJSONQuestionIndex}
              nextQuestion={setNextQuestion}
              prevQuestion={setPrevFromPhone}
            />
          }
        </Route>
        <Route path="/build/brick/:brickId/investigation/question">
          {renderQuestionTypePreview()}
        </Route>
        <Route path="/build/brick/:brickId/synthesis">
          <PhonePreview
            Component={SynthesisPreviewComponent}
            prev={() => selectQuestion(questions.length - 1)}
            next={() => { }}
            nextDisabled={true}
            data={{ synthesis, brickLength: ybrick.get("brickLength") }}
          />
        </Route>
      </Grid>
      <HighlightInvalidDialog
        isOpen={highlightInvalid.isOpen}
        isLines={highlightInvalid.isLine}
        close={() => {
          setValidation(true);
          setInvalidHighlight({ isOpen: false, isLine: false })
        }}
      />
      <HintInvalidDialog
        isOpen={invalidHint.isOpen}
        invalidQuestionNumber={invalidHint.questionNumber}
        close={() => {
          setValidation(true);
          setInvalidHint({ isOpen: false, questionNumber: -1 })
        }}
      />
      <QuestionInvalidDialog
        isOpen={submitDialogOpen}
        close={() => setSubmitDialog(false)}
        submit={() => submitInvalidBrick()}
        hide={() => hideInvalidBrick()}
      />
      <ProposalInvalidDialog
        isOpen={!proposalResult.isValid && proposalInvalidOpen}
        close={() => setProposalInvalidOpen(false)}
        submit={() => submitInvalidBrick()}
        hide={() => moveToInvalidProposal()}
      />
      <DeleteDialog
        isOpen={deleteDialogOpen}
        index={deleteQuestionIndex}
        title="Permanently delete<br />this question?"
        close={setDeleteDialog}
        submit={deleteQuestionByIndex}
      />
      <ValidationFailedDialog
        isOpen={lastQuestionDialog}
        header="You can`t delete last question"
        close={() => setLastQuestionDialog(false)}
      />
      <SkipTutorialDialog
        open={skipTutorialOpen}
        close={() => setSkipDialog(false)}
        skip={() => {
          skipTutorial(true);
          setSkipDialog(false);
        }}
      />
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  reduxBrick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
  startEditing: (brickId: number) => dispatch(socketStartEditing(brickId)),
  changeQuestion: (questionId?: number) => dispatch(socketNavigateToQuestion(questionId)),
  forgetBrick: () => dispatch(actions.forgetBrick()),
});

const connector = connect(mapState, mapDispatch);

export default connector(InvestigationBuildPage);
