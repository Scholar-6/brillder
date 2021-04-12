import React, { useContext, useEffect } from "react";
import { Redirect, RouteComponentProps, Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import * as Y from "yjs";
import _ from "lodash";

import "./investigationBuildPage.scss";
import routes from './routes';
import PlanPage from './plan/Plan';
import {
  Question,
  QuestionTypeEnum,
} from "model/question";
import actions from "redux/actions/brickActions";
import { socketStartEditing } from "redux/actions/socket";
import { isHighlightInvalid, validateBrick, validateHint, validateQuestions } from "./questionService/ValidateQuestionService";
import {
  getNewQuestion,
  removeQuestionByIndex,
  setQuestionTypeByIndex,
  getFirstInvalidQuestion,
  getUniqueComponent,
  cashBuildQuestion,
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
import TutorialLabels from './baseComponents/TutorialLabels';
import PageLoader from "components/baseComponents/loaders/pageLoader";

import QuestionInvalidDialog from './baseComponents/dialogs/QuestionInvalidDialog';
import HighlightInvalidDialog from './baseComponents/dialogs/HighlightInvalidDialog';
import HintInvalidDialog from './baseComponents/dialogs/HintInvalidDialog';
import ProposalInvalidDialog from './baseComponents/dialogs/ProposalInvalidDialog';
import SkipTutorialDialog from "./baseComponents/dialogs/SkipTutorialDialog";
import BuildNavigation from "./baseComponents/BuildNavigation";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import { YJSContext } from "./baseComponents/YJSProvider";
import { convertQuestion, toRenderJSON } from "services/SharedTypeService";
import DeleteDialog from "./baseComponents/dialogs/DeleteDialog";
import service, { getPreviewLink, getQuestionType } from "./services/buildService";
import QuestionTypePreview from "./baseComponents/QuestionTypePreview";
import EmptyWorkArea from "./buildQuestions/EmptyWorkArea";
import { GetCashedBuildQuestion } from "localStorage/buildLocalStorage";


export interface InvestigationBuildProps extends RouteComponentProps<any> {
  user: User;
  reduxBrick: Brick;
  initSuggestionExpanded: boolean;
  isCurrentEditor: boolean;
  startEditing(brickId: number): void;
  forgetBrick(): void;
}

const InvestigationBuildPage: React.FC<InvestigationBuildProps> = props => {
  const { params } = props.match;
  const brickId = parseInt(params.brickId);

  const { history } = props;

  const [currentQuestionIndex, setQuestionIndex] = React.useState(0);

  // when user go back from play set cashed question
  useEffect(() => {
    const cashedData = GetCashedBuildQuestion();
    // check if brick is the same
    if (cashedData && cashedData.brickId === brickId && cashedData.questionNumber >= 0) {
      setQuestionIndex(cashedData.questionNumber);
    }
  }, [brickId]);

  const setCurrentQuestionIndex = (index: number) => {
    setQuestionIndex(-2);
    setTimeout(() => {
      setQuestionIndex(index)
    }, 200);
  }

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
  const [skipTutorialOpen, setSkipDialog] = React.useState(false);
  // eslint-disable-next-line
  const [tutorialSkipped, skipTutorial] = React.useState(false);
  const [step, setStep] = React.useState(TutorialStep.Proposal);

  const {pathname} = history.location;
  const {BuildSynthesisLastPrefix, BuildPlanLastPrefix} = routes;
  let isSynthesisPage = false;

  if (pathname.slice(-BuildSynthesisLastPrefix.length).toLowerCase() === BuildSynthesisLastPrefix) {
    isSynthesisPage = true;
  }

  let isProposalPage = false;
  if (pathname.slice(-BuildPlanLastPrefix.length).toLocaleLowerCase() === BuildPlanLastPrefix) {
    isProposalPage = true;
  }

  const { ydoc, undoManager } = useContext(YJSContext)!;
  const ybrick = ydoc!.getMap("brick")!;
  props.startEditing(brickId);

  const canUndo = React.useMemo(() => (undoManager?.undoStack.length ?? 0) > 0, [undoManager]);
  const undo = () => {
    // TODO: implement undo
    undoManager?.undo();
  }

  const canRedo = React.useMemo(() => (undoManager?.redoStack.length ?? 0) > 0, [undoManager]);
  const redo = () => {
    // TODO: implement redo
    undoManager?.redo();
  }

  if (!ybrick) {
    return <PageLoader content="Getting brick..." />
  }

  const questions = ybrick.get("questions") as Y.Array<Y.Doc>;
  let synthesis = ybrick.get("synthesis") as Y.Text;

  const proposalResult = validateProposal(toRenderJSON(ybrick, ["questions"]));

  let isAuthor = false;
  try {
    isAuthor = props.reduxBrick.author.id === props.user.id;
  } catch { }

  const openSkipTutorial = () => {
    setSkipDialog(true);
  }

  let canEdit = canEditBrick(props.reduxBrick, props.user);
  locked = canEdit ? locked : true;

  setBrillderTitle(ybrick.get("title"));

  const getQuestionIndex = (question: Y.Doc) => service.getQuestionIndex(question, questions);

  const createQuestion = () => {
    const newQuestion = convertQuestion(getNewQuestion(QuestionTypeEnum.None, false))
    questions.doc!.transact(() => {
      questions.push([newQuestion]);
    }, "no-undo");
    setCurrentQuestionIndex(questions.length - 1);
  }

  let activeQuestion: Y.Doc = undefined as any;
  if (currentQuestionIndex !== -1) {
    activeQuestion = questions.get(currentQuestionIndex);
    if (activeQuestion) {
      questions.forEach((q: Y.Doc) => {
        q.clientID = ydoc.clientID;
        q.load();
      });
    }
  }
  if (isSynthesisPage || isProposalPage) {
    if (activeQuestion) {
      if (movingFromSynthesis === false) {
        setCurrentQuestionIndex(-1);
      }
      return <PageLoader content="...Loading 1..." />;
    }
  } else if (_.isEmpty(activeQuestion?.toJSON()) || _.isEmpty(activeQuestion?.getMap()?.toJSON())) {
    if (questions.length <= 0) {
      if (!canEdit || locked) { return <PageLoader content="...Loading 2..." />; }
      createQuestion();
    } else if (currentQuestionIndex >= questions.length) {
      setCurrentQuestionIndex(questions.length - 1);
    }
    //return <PageLoader content="...Loading 3..." />;
  }

  const isQuestionLoading = () => {
    if (_.isEmpty(activeQuestion?.toJSON()) || _.isEmpty(activeQuestion?.getMap()?.toJSON())) {
      if (questions.length <= 0) {
        if (!canEdit || locked) { return true; }
        createQuestion();
      } else if (currentQuestionIndex >= questions.length) {
        setCurrentQuestionIndex(questions.length - 1);
      }
      return true;
    }
    return false;
  }

  if (activeQuestion) {
    if (movingFromSynthesis) {
      setMovingFromSynthesis(false);
    }
  }

  /* Changing question number by tabs in build */
  const setPrevFromPhone = () => {
    if (currentQuestionIndex >= 1) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      history.push(routes.buildPlan(brickId));
    }
  }

  const setNextQuestion = () => {
    let lastIndex = questions.length - 1;
    if (currentQuestionIndex < lastIndex) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      history.push(routes.buildSynthesis(brickId));
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

    const { pathname } = history.location;

    if (
      pathname.slice(-10) === routes.BuildSynthesisLastPrefix ||
      pathname.slice(-5) === routes.BuildPlanLastPrefix
    ) {
      history.push(routes.buildQuesitonType(brickId));
    }
  };

  const moveToSynthesis = () => {
    history.push(routes.buildSynthesis(brickId));
  };

  const setQuestionTypeAndMove = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    setQuestionType(type);
    history.push(routes.buildQuesiton(brickId));
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
    const { pathname } = history.location;
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
      history.push(routes.buildQuesitonType(brickId));
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
        cashBuildQuestion(brickId, currentQuestionIndex);
        history.push(link);
      } else {
        setProposalInvalidOpen(true);
      }
    }
  }

  const moveToInvalidProposal = () => {
    history.push(routes.buildPlan(brickId));
    setProposalInvalidOpen(false);
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
    if (!activeQuestion) {
      return (
        <div className="question-type">
          <div className="inner-question-type">
          </div>
          <div className="fixed-build-phone">
          <QuestionTypePreview
            hoverQuestion={QuestionTypeEnum.None}
            nextQuestion={setNextQuestion}
            prevQuestion={setPrevFromPhone}
          />
          </div>
        </div>
      );
    }
    const type = getQuestionType(activeQuestion);
    return (
      <QuestionTypePage
        history={history}
        brickId={brickId}
        setNextQuestion={setNextQuestion}
        setPrevFromPhone={setPrevFromPhone}
        questionId={activeQuestion.getMap().get("id")}
        setQuestionType={setQuestionTypeAndMove}
        questionType={type}
      />
    );
  };

  const isTutorialPassed = () => {
    return true;
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
            undoManager={undoManager}
            initSuggestionExpanded={props.initSuggestionExpanded}
            selectFirstQuestion={() => selectQuestion(0)}
          />
        </Route>
        <Route path={routes.questionRoute}>
          {!isQuestionLoading() ?
          <QuestionPanelWorkArea
            brickId={brickId}
            history={history}
            yquestion={activeQuestion}
            canEdit={canEdit}
            locked={locked}
            isAuthor={isAuthor}
            validationRequired={validationRequired}
            initSuggestionExpanded={props.initSuggestionExpanded}
            getQuestionIndex={getQuestionIndex}
            toggleLock={toggleLock}
            setQuestionType={convertQuestionTypes}
            setNextQuestion={setNextQuestion}
            setPrevFromPhone={setPrevFromPhone}
            canUndo={canUndo}
            undo={undo}
            canRedo={canRedo}
            redo={redo}
          /> : <EmptyWorkArea
            setNextQuestion={setNextQuestion}
            setPrevFromPhone={setPrevFromPhone}
          />}
        </Route>
        <Route path="/build/brick/:brickId/investigation/question">
          {renderQuestionComponent()}
        </Route>
        <Route path={routes.synthesisRoute}>
          <SynthesisPage
            locked={locked}
            editOnly={!canEdit}
            ybrick={ybrick}
            undoManager={undoManager}
            moveToLastQuestion={() => selectQuestion(questions.length - 1)}
            initSuggestionExpanded={props.initSuggestionExpanded}
          />
        </Route>
      </Switch>
    );
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
        isEditor={props.isCurrentEditor}
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
                locked={!canEdit || locked}
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
        <LastSave ybrick={ybrick} tutorialStep={isTutorialPassed() ? TutorialStep.None : step} isSaving={false} saveError={false} />
        <Route path="/build/brick/:brickId/investigation/" exact>
          <Redirect to={`/build/brick/${ybrick.get("id")}/investigation/question`} />
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
  forgetBrick: () => dispatch(actions.forgetBrick()),
});

const connector = connect(mapState, mapDispatch);

export default connector(InvestigationBuildPage);
