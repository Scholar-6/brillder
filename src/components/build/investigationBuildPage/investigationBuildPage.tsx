import React, { useEffect } from "react";
import { RouteComponentProps, Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { Grid, Button, Hidden } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import update from "immutability-helper";
// @ts-ignore
import { connect } from "react-redux";

import "./investigationBuildPage.scss";
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import PlayButton from 'components/build/investigationBuildPage/components/PlayButton';
import QuestionPanelWorkArea from "./buildQuestions/questionPanelWorkArea";
import TutorialWorkArea, { TutorialStep } from './tutorial/TutorialPanelWorkArea';
import QuestionTypePage from "./questionType/questionType";
import SynthesisPage from "./synthesisPage/SynthesisPage";
import LastSave from "components/build/baseComponents/lastSave/LastSave";
import DragableTabs from "./dragTabs/dragableTabs";
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import PhoneQuestionPreview from "components/build/baseComponents/phonePreview/phoneQuestionPreview/PhoneQuestionPreview";
import SynthesisPreviewComponent from "components/build/baseComponents/phonePreview/synthesis/SynthesisPreview";
import DeleteQuestionDialog from "components/build/baseComponents/deleteQuestionDialog/DeleteQuestionDialog";
import QuestionTypePreview from "components/build/baseComponents/QuestionTypePreview";
import TutorialPhonePreview from "./tutorial/TutorialPreview";
import YourProposalLink from './components/YourProposalLink';

import {
  Question,
  QuestionTypeEnum,
} from "model/question";
import actions from "../../../redux/actions/brickActions";
import { socketUpdateBrick, socketStartEditing } from "redux/actions/socket";
import { validateQuestion } from "./questionService/ValidateQuestionService";
import {
  getNewQuestion,
  activeQuestionByIndex,
  deactiveQuestions,
  getActiveQuestion,
  cashBuildQuestion,
  prepareBrickToSave,
  removeQuestionByIndex,
  setQuestionTypeByIndex,
  setLastQuestionId,
  parseQuestion,
} from "./questionService/QuestionService";
import { convertToQuestionType } from "./questionService/ConvertService";
import { User } from "model/user";
import { GetCashedBuildQuestion } from '../../localStorage/buildLocalStorage';
import { setBrillderTitle } from "components/services/titleService";
import { canEditBrick } from "components/services/brickService";
import { ReduxCombinedState } from "redux/reducers";
import PageLoader from "components/baseComponents/loaders/pageLoader";


interface InvestigationBuildProps extends RouteComponentProps<any> {
  brick: any;
  user: User;
  fetchBrick(brickId: number): void;
  startEditing(brickId: number): void;
  saveBrick(brick: any): any;
  updateBrick(brick: any): any;
}

const InvestigationBuildPage: React.FC<InvestigationBuildProps> = props => {
  const brickId = parseInt(props.match.params.brickId);

  if (!props.brick || props.brick.id !== brickId) {
    props.fetchBrick(brickId);
  }

  const { history } = props;

  const [questions, setQuestions] = React.useState([
    getNewQuestion(QuestionTypeEnum.None, true)
  ] as Question[]);
  const [loaded, setStatus] = React.useState(false);
  let [locked, setLock] = React.useState(props.brick ? props.brick.locked : false);
  const [deleteDialogOpen, setDeleteDialog] = React.useState(false);
  const [submitDialogOpen, setSubmitDialog] = React.useState(false);
  const [validationRequired, setValidation] = React.useState(false);
  const [deleteQuestionIndex, setDeleteIndex] = React.useState(-1);
  const [activeQuestionType, setActiveType] = React.useState(QuestionTypeEnum.None);
  const [hoverQuestion, setHoverQuestion] = React.useState(QuestionTypeEnum.None);
  const [isSaving, setSavingStatus] = React.useState(false);
  const [tutorialSkipped, skipTutorial] = React.useState(false);
  const [step, setStep] = React.useState(TutorialStep.Proposal);
  const [tooltipsOn, setTooltips] = React.useState(true);
  // time of last autosave
  const [lastAutoSave, setLastAutoSave] = React.useState(Date.now());

  /* Synthesis */
  let isSynthesisPage = false;
  if (history.location.pathname.slice(-10) === '/synthesis') {
    isSynthesisPage = true;
  }

  let initSynthesis = props.brick ? props.brick.synthesis as string : "";
  const [synthesis, setSynthesis] = React.useState(initSynthesis);
  useEffect(() => {
    if (props.brick) {
      if (props.brick.id === brickId) {
        if (props.brick.synthesis || props.brick.synthesis === '') {
          setSynthesis(props.brick.synthesis)
        }
        if (props.brick.locked) {
          setLock(true);
        }
      }
    }
  }, [props.brick, brickId]);
  /* Synthesis */

  // start editing on socket on load.
  useEffect(() => {
    props.startEditing(brickId);
  }, [brickId])

  // update on socket when things change.
  useEffect(() => {
    if(props.brick && !locked) {
      let { brick } = props;
      prepareBrickToSave(brick, questions, synthesis);
      props.updateBrick(brick);
    }
  }, [questions, synthesis]);

  // parse questions on socket update
  useEffect(() => {
    if (props.brick && props.brick.questions && locked) {
      const parsedQuestions: Question[] = [];
      for (const question of props.brick.questions) {
        try {
          parseQuestion(question, parsedQuestions);
        } catch (e) { }
      }
      if (parsedQuestions.length > 0) {
        let buildQuestion = GetCashedBuildQuestion();
        if (buildQuestion && buildQuestion.questionNumber && parsedQuestions[buildQuestion.questionNumber]) {
          parsedQuestions[buildQuestion.questionNumber].active = true;
        } else {
          parsedQuestions[0].active = true;
        }
        setQuestions(update(questions, { $set: parsedQuestions }));
        setStatus(update(loaded, { $set: true }));
      }
      setSynthesis(props.brick.synthesis);
    }
  }, [props.brick])

  if (!props.brick) {
    return <PageLoader content="...Loading..." />;
  }

  let canEdit = canEditBrick(props.brick, props.user);
  locked = canEdit ? locked : true;

  setBrillderTitle(props.brick.title);

  const getQuestionIndex = (question: Question) => {
    return questions.indexOf(question);
  };

  const unselectQuestions = () => {
    const updatedQuestions = deactiveQuestions(questions);
    setQuestions(update(questions, { $set: updatedQuestions }));
  }

  let activeQuestion = getActiveQuestion(questions);
  if (isSynthesisPage === true) {
    if (activeQuestion) {
      unselectQuestions();
      return <PageLoader content="...Loading..." />;
    }
  } else if (!activeQuestion) {
    console.log("Can`t find active question");
    activeQuestion = {} as Question;
  }

  /* Changing question number by tabs in build */
  const activateQuestionByIndex = (index: number) => {
    return activeQuestionByIndex(brickId, questions, index);
  }

  const setPreviousQuestion = () => {
    const index = getQuestionIndex(activeQuestion);
    if (index >= 1) {
      const updatedQuestions = activateQuestionByIndex(index - 1);
      setQuestions(update(questions, { $set: updatedQuestions }));
    } else {
      saveBrick();
      history.push('/build/new-brick/proposal');
    }
  };

  const saveSynthesis = (text: string) => {
    setSynthesis(text);
    autoSaveBrick();
  }

  const setNextQuestion = () => {
    const index = getQuestionIndex(activeQuestion);
    let lastIndex = questions.length - 1;
    if (index < lastIndex) {
      const updatedQuestions = activateQuestionByIndex(index + 1);
      setQuestions(update(questions, { $set: updatedQuestions }));
    } else {
      createNewQuestion();
    }
  };
  /* Changing question in build */

  const createNewQuestion = () => {
    if (!canEdit) { return; }
    const updatedQuestions = questions.slice();
    updatedQuestions.push(getNewQuestion(QuestionTypeEnum.None, false));

    saveBrickQuestions(updatedQuestions, (brick: any) => {
      const postUpdatedQuestions = setLastQuestionId(brick, updatedQuestions);
      setQuestions(update(questions, { $set: postUpdatedQuestions }));
      cashBuildQuestion(brickId, postUpdatedQuestions.length - 1);
    });

    if (history.location.pathname.slice(-10) === '/synthesis') {
      history.push(`/build/brick/${brickId}/build/investigation/question`);
    }
  };

  const moveToSynthesis = () => {
    history.push(`/build/brick/${brickId}/build/investigation/synthesis`);
  }

  const setQuestionTypeAndMove = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    setQuestionType(type);
    history.push(`/build/brick/${brickId}/build/investigation/question-component`);
  };

  const setQuestionType = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    var index = getQuestionIndex(activeQuestion);
    const updatedQuestions = setQuestionTypeByIndex(questions, index, type);
    setQuestions(updatedQuestions);
    saveBrickQuestions(updatedQuestions);
  };

  const convertQuestionTypes = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    convertToQuestionType(questions, activeQuestion, type, setQuestionAndSave);
  };

  const deleteQuestionByIndex = (index: number) => {
    let updatedQuestions = removeQuestionByIndex(questions, index);
    setQuestions(updatedQuestions);
    setDeleteDialog(false);
    saveBrickQuestions(updatedQuestions);
  }

  const removeQuestion = (index: number) => {
    if (locked) { return; }
    if (questions.length === 1) {
      alert("You can`t delete last question");
      return;
    }
    if (questions[index].type) {
      setDeleteDialog(true);
      setDeleteIndex(index);
      return;
    }
    deleteQuestionByIndex(index);
  };

  const selectQuestion = (index: number) => {
    const updatedQuestions = activateQuestionByIndex(index);
    setQuestions(update(questions, { $set: updatedQuestions }));
    if (history.location.pathname.slice(-10) === '/synthesis') {
      history.push(`/build/brick/${brickId}/build/investigation/question`)
    }
  };

  const toggleLock = () => {
    setLock(!locked);
    brick.locked = !locked;
    saveBrick();
  }

  const setQuestion = (index: number, question: Question) => {
    if (locked) { return; }
    setQuestions(update(questions, { [index]: { $set: question } }));
  };

  const setQuestionAndSave = (index: number, question: Question) => {
    let updatedQuestions = update(questions, { [index]: { $set: question } });
    setQuestions(updatedQuestions);
    saveBrickQuestions(updatedQuestions);
  }

  const { brick } = props;

  if (brick.id !== brickId) {
    return <PageLoader content="...Loading..." />;
  }

  const parseQuestions = () => {
    if (brick.questions && loaded === false) {
      const parsedQuestions: Question[] = [];
      for (const question of brick.questions) {
        try {
          parseQuestion(question, parsedQuestions);
        } catch (e) { }
      }
      if (parsedQuestions.length > 0) {
        let buildQuestion = GetCashedBuildQuestion();
        if (buildQuestion && buildQuestion.questionNumber && parsedQuestions[buildQuestion.questionNumber]) {
          parsedQuestions[buildQuestion.questionNumber].active = true;
        } else {
          parsedQuestions[0].active = true;
        }
        setQuestions(update(questions, { $set: parsedQuestions }));
        setStatus(update(loaded, { $set: true }));
      }
    }
  }

  parseQuestions();

  const moveToReview = () => {
    let invalidQuestion = questions.find(question => {
      return !validateQuestion(question);
    });

    if (!synthesis) {
      invalidQuestion = {} as Question;
    }

    if (invalidQuestion) {
      setSubmitDialog(true);
    } else {
      saveBrick();
      let buildQuestion = GetCashedBuildQuestion();

      if (isSynthesisPage) {
        history.push(`/play-preview/brick/${brickId}/intro`);
      } else if (
        buildQuestion && buildQuestion.questionNumber &&
        buildQuestion.brickId === brickId &&
        buildQuestion.isTwoOrMoreRedirect
      ) {
        history.push(`/play-preview/brick/${brickId}/live`);
      } else {
        history.push(`/play-preview/brick/${brickId}/intro`);
      }
    }
  }

  const submitInvalidBrick = () => {
    saveBrick();
    history.push(`/back-to-work`);
  }

  const hideInvalidBrick = () => {
    setValidation(true);
    setSubmitDialog(false);
  }

  const saveBrickQuestions = (updatedQuestions: Question[], callback?: Function) => {
    if (canEdit === true) {
      setSavingStatus(true);
      prepareBrickToSave(brick, updatedQuestions, synthesis);

      props.saveBrick(brick).then((res: any) => {
        if (callback) {
          callback(res);
        }
      });
    }
  }

  const saveSwitchedBrickQuestions = (updatedQuestions: Question[]) => {
    if (canEdit === true) {
      setSavingStatus(true);
      prepareBrickToSave(brick, updatedQuestions, synthesis);
      for (let [index, question] of brick.questions.entries()) {
        question.order = index;
      }
      props.saveBrick(brick);
    }
  }

  const saveBrick = () => {
    setSavingStatus(true);
    prepareBrickToSave(brick, questions, synthesis);
    if (canEdit === true) {
      props.saveBrick(brick);
    }
  };

  const autoSaveBrick = () => {
    setSavingStatus(true);
    prepareBrickToSave(brick, questions, synthesis);
    if (canEdit === true) {
      let time = Date.now();
      let delay = 500;

      try {
        if (process.env.REACT_APP_BUILD_AUTO_SAVE_DELAY) {
          delay = parseInt(process.env.REACT_APP_BUILD_AUTO_SAVE_DELAY);
        }
      } catch { }

      if (time - lastAutoSave >= delay) {
        setLastAutoSave(time);
        props.saveBrick(brick);
      }
    }
  }

  const updateComponents = (components: any[]) => {
    if (locked) { return; }
    const index = getQuestionIndex(activeQuestion);
    const updatedQuestions = questions.slice();
    updatedQuestions[index].components = components;
    setQuestions(update(questions, { $set: updatedQuestions }));
  }

  const exitAndSave = () => {
    saveBrick();
    history.push('/home');
  }

  const renderBuildQuestion = () => {
    return (
      <QuestionPanelWorkArea
        brickId={brickId}
        history={history}
        synthesis={brick.synthesis}
        questionsCount={questions ? questions.length : 0}
        question={activeQuestion}
        canEdit={canEdit}
        locked={locked}
        validationRequired={validationRequired}
        getQuestionIndex={getQuestionIndex}
        setQuestion={setQuestion}
        toggleLock={toggleLock}
        updateComponents={updateComponents}
        setQuestionType={convertQuestionTypes}
        setPreviousQuestion={setPreviousQuestion}
        nextOrNewQuestion={setNextQuestion}
        saveBrick={autoSaveBrick}
      />
    );
  };

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
    return (
      <QuestionTypePage
        synthesis={brick.synthesis}
        history={history}
        brickId={brickId}
        setHoverQuestion={setHoverQuestion}
        questionId={activeQuestion.id}
        activeQuestionType={activeQuestionType}
        setActiveQuestionType={setActiveType}
        setQuestionType={setQuestionTypeAndMove}
        questionType={activeQuestion.type}
      />
    );
  };

  const isTutorialPassed = () => {
    if (props.user.tutorialPassed) {
      return true;
    }
    if (tutorialSkipped) {
      return true;
    }
    if (questions.length > 1) {
      return true;
    }
    if (questions[0] && questions[0].type !== QuestionTypeEnum.None) {
      return true;
    }
    return false;
  }

  const renderPanel = () => {
    return (
      <Switch>
        <Route path="/build/brick/:brickId/build/investigation/question-component">
          {renderBuildQuestion}
        </Route>
        <Route path="/build/brick/:brickId/build/investigation/question">
          {renderQuestionComponent}
        </Route>
        <Route path="/build/brick/:brickId/build/investigation/synthesis">
          <SynthesisPage locked={locked} synthesis={synthesis} onSynthesisChange={saveSynthesis} />
        </Route>
      </Switch>
    );
  }

  const renderQuestionTypePreview = () => {
    if (isTutorialPassed()) {
      return (
        <QuestionTypePreview
          hoverQuestion={hoverQuestion}
          activeQuestionType={activeQuestionType}
        />
      );
    }
    return <TutorialPhonePreview step={step} />;
  }

  const renderTutorialLabels = () => {
    if (!isTutorialPassed() && tooltipsOn) {
      return (
        <div className="tutorial-top-labels">
          <div className="exit-arrow">
            <img alt="" src="/images/exit-arrow.png" />
          </div>
          <Grid container direction="row" style={{ height: '100%' }}>
            <Grid container item xs={9} justify="center" style={{ height: '100%' }}>
              <Grid container item xs={9} style={{ height: '100%' }}>
                <div className="tutorial-exit-label" style={{ height: '100%' }}>
                  <Grid container alignContent="center" style={{ height: '100%' }}>
                    Click the red icon to Exit & Save
                  </Grid>
                </div>
                <div className="tutorial-add-label" style={{ height: '100%' }}>
                  <Grid container alignContent="center" justify="center" style={{ height: '100%' }}>
                    Add Question Panel
                  </Grid>
                </div>
                <div className="tutorial-synthesis-label" style={{ height: '100%' }}>
                  <Grid container alignContent="center" justify="center" style={{ height: '100%' }}>
                    Synthesis
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    }
    return "";
  }

  let isValid = true;
  questions.forEach(q => {
    let isQuestionValid = validateQuestion(q as any);
    if (!isQuestionValid) {
      isValid = false;
    }
  });

  const switchQuestions = (questions: Question[]) => {
    setQuestions(questions);
    saveSwitchedBrickQuestions(questions);
  }

  if (!synthesis) {
    isValid = false;
  }

  return (
    <div className="investigation-build-page">
      <HomeButton onClick={exitAndSave} />
      <PlayButton
        tutorialStep={step}
        isTutorialSkipped={isTutorialPassed()}
        isValid={isValid}
        onClick={moveToReview}
      />
      <Hidden only={['xs', 'sm']}>
        {renderTutorialLabels()}
        <YourProposalLink
          tutorialStep={step}
          tooltipsOn={tooltipsOn}
          saveBrick={saveBrick}
          isTutorialPassed={isTutorialPassed}
          setTooltips={setTooltips}
        />
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
              <Grid
                container
                item xs={12} sm={12} md={9}
                style={{ height: "90%", width: "75vw", minWidth: 'none' }}
              >
                <DragableTabs
                  setQuestions={switchQuestions}
                  questions={questions}
                  synthesis={synthesis}
                  validationRequired={validationRequired}
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
          <LastSave updated={brick.updated} tutorialStep={isTutorialPassed() ? TutorialStep.None : step} isSaving={isSaving} />
          <Route path="/build/brick/:brickId/build/investigation/question-component">
            <PhoneQuestionPreview question={activeQuestion} />
          </Route>
          <Route path="/build/brick/:brickId/build/investigation/question">
            {renderQuestionTypePreview()}
          </Route>
          <Route path="/build/brick/:brickId/build/investigation/synthesis">
            <PhonePreview Component={SynthesisPreviewComponent} data={synthesis} />
          </Route>
        </Grid>
        <Dialog
          open={submitDialogOpen}
          onClose={() => setSubmitDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="dialog-box">
          <div className="dialog-header">
            <div>Some questions are incomplete.</div>
            <div>These are marked in red. Keep working?</div>
          </div>
          <div className="dialog-footer">
            <button className="btn btn-md bg-theme-orange yes-button"
              onClick={() => hideInvalidBrick()}>
              <span>Yes</span>
            </button>
            <button className="btn btn-md bg-gray no-button"
              onClick={() => submitInvalidBrick()}>
              <span>No, Save & Exit</span>
            </button>
          </div>
        </Dialog>
        <DeleteQuestionDialog
          open={deleteDialogOpen}
          index={deleteQuestionIndex}
          setDialog={setDeleteDialog}
          deleteQuestion={deleteQuestionByIndex}
        />
      </Hidden>
      <Hidden only={['md', 'lg', 'xl']}>
        <Dialog
          open={true}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="dialog-box">
          <div className="dialog-header">
            <div>You need desktop browser to use this page</div>
          </div>
          <Grid container direction="row" className="dialog-footer" justify="center">
            <Button className="yes-button" onClick={() => history.push('/home')}>
              Move
            </Button>
          </Grid>
        </Dialog>
      </Hidden>
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  brick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
  fetchBrick: (brickId: number) => dispatch(actions.fetchBrick(brickId)),
  startEditing: (brickId: number) => dispatch(socketStartEditing(brickId)),
  saveBrick: (brick: any) => dispatch(actions.saveBrick(brick)),
  updateBrick: (brick: any) => dispatch(socketUpdateBrick(brick))
});

const connector = connect(mapState, mapDispatch);

export default connector(InvestigationBuildPage);
