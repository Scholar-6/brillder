import React, { useEffect } from "react";
import { Redirect, RouteComponentProps, Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { Grid, Hidden } from "@material-ui/core";
import update from "immutability-helper";
import { connect } from "react-redux";
import queryString from 'query-string';

import "./investigationBuildPage.scss";
import map from 'components/map';
import {
  Question,
  QuestionTypeEnum,
} from "model/question";
import actions from "redux/actions/brickActions";
import { socketUpdateBrick, socketStartEditing, socketNavigateToQuestion } from "redux/actions/socket";
import { isHighlightInvalid, validateHint, validateQuestion } from "./questionService/ValidateQuestionService";
import {
  getNewQuestion,
  getNewFirstQuestion,
  activeQuestionByIndex,
  deactiveQuestions,
  getActiveQuestion,
  cashBuildQuestion,
  prepareBrickToSave,
  removeQuestionByIndex,
  setQuestionTypeByIndex,
  setLastQuestionId,
  activateFirstInvalidQuestion,
  parseQuestion,
  getUniqueComponent,
} from "./questionService/QuestionService";
import { convertToQuestionType } from "./questionService/ConvertService";
import { User } from "model/user";
import { GetCashedBuildQuestion } from 'localStorage/buildLocalStorage';
import { setBrillderTitle } from "components/services/titleService";
import { canEditBrick, checkAdmin, checkPublisher } from "components/services/brickService";
import { ReduxCombinedState } from "redux/reducers";
import { validateProposal } from 'components/proposal/service/validation';
import { TextComponentObj } from "./buildQuestions/components/Text/interface";
import { useSocket } from "socket/socket";
import { applyBrickDiff, getBrickDiff } from "components/services/diff";
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

import DeleteQuestionDialog from "./baseComponents/dialogs/DeleteQuestionDialog";
import DesktopVersionDialog from 'components/build/baseComponents/dialogs/DesktopVersionDialog';
import QuestionInvalidDialog from './baseComponents/dialogs/QuestionInvalidDialog';
import HighlightInvalidDialog from './baseComponents/dialogs/HighlightInvalidDialog';
import HintInvalidDialog from './baseComponents/dialogs/HintInvalidDialog';
import ProposalInvalidDialog from './baseComponents/dialogs/ProposalInvalidDialog';
import SkipTutorialDialog from "./baseComponents/dialogs/SkipTutorialDialog";
import BuildNavigation from "./baseComponents/BuildNavigation";


interface InvestigationBuildProps extends RouteComponentProps<any> {
  brick: any;
  user: User;
  startEditing(brickId: number): void;
  changeQuestion(questionId?: number): void;
  saveBrick(brick: any): any;
  updateBrick(brick: any): any;
}

const InvestigationBuildPage: React.FC<InvestigationBuildProps> = props => {
  const { params } = props.match;
  const brickId = parseInt(params.brickId);

  const values = queryString.parse(props.location.search);
  let initSuggestionExpanded = false;
  if (values.suggestionsExpanded) {
    initSuggestionExpanded = true;
  }

  let initQuestionId = -1;
  if (params.questionId) {
    try {
      let questionId = parseInt(params.questionId);
      if (questionId >= 1) {
        initQuestionId = questionId;
      }
    } catch {
      console.log('can`t parse question id');
    }
  }

  const { history } = props;

  let proposalRes = validateProposal(props.brick);

  const [questions, setQuestions] = React.useState([
    getNewFirstQuestion(QuestionTypeEnum.None, true)
  ] as Question[]);
  const [loaded, setStatus] = React.useState(false);
  let [locked, setLock] = React.useState(props.brick ? props.brick.locked : false);
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
  const [proposalResult, setProposalResult] = React.useState({ isOpen: false, isValid: proposalRes.isValid, url: proposalRes.url });
  const [validationRequired, setValidation] = React.useState(false);
  const [deleteQuestionIndex, setDeleteIndex] = React.useState(-1);
  const [activeQuestionType] = React.useState(QuestionTypeEnum.None);
  const [hoverQuestion, setHoverQuestion] = React.useState(QuestionTypeEnum.None);
  const [isSaving, setSavingStatus] = React.useState(false);
  const [hasSaveError, setSaveError] = React.useState(false);
  const [skipTutorialOpen, setSkipDialog] = React.useState(false);
  const [tutorialSkipped, skipTutorial] = React.useState(false);
  const [step, setStep] = React.useState(TutorialStep.Proposal);
  const [tooltipsOn, setTooltips] = React.useState(true);
  // time of last autosave
  let [lastAutoSave, setLastAutoSave] = React.useState(Date.now());

  const [undoRedoService] = React.useState(UndoRedoService.instance);

  /* Synthesis */
  let isSynthesisPage = false;
  if (history.location.pathname.slice(-10).toLowerCase() === '/synthesis') {
    isSynthesisPage = true;
  }

  let initSynthesis = props.brick ? props.brick.synthesis as string : "";
  let [synthesis, setSynthesis] = React.useState(initSynthesis);
  /* Synthesis */

  const { startEditing, updateBrick } = props;

  let isAuthor = false;
  try {
    isAuthor = props.brick.author.id === props.user.id;
  } catch { }

  // start editing on socket on load.
  useEffect(() => {
    startEditing(brickId)
  }, [brickId, startEditing]);


  const [currentBrick, setCurrentBrick] = React.useState({ ...props.brick });

  const openSkipTutorial = () => {
    setSkipDialog(true);
  }

  // update on socket when things change.
  useEffect(() => {
    if (props.brick && !locked) {
      let brick = props.brick;
      prepareBrickToSave(brick, questions, synthesis);
    }
  }, [questions, synthesis, locked, updateBrick, props.brick]);

  // parse questions on socket update
  useSocket('brick_update', (diff: any) => {
    console.log(diff);
    if (!diff) return;
    if (currentBrick && locked) {
      console.log(diff);
      applyDiff(diff);
    }
  })

  const applyDiff = (diff: any) => {
    const brick = applyBrickDiff(currentBrick, diff);
    console.log(currentBrick, diff, brick);
    let parsedQuestions: Question[] = questions;


    if (diff.questions) {
      for (const questionKey of Object.keys(diff.questions)) {
        try {
          parseQuestion(brick.questions[questionKey as any], parsedQuestions as Question[]);
        } catch (e) {
          parsedQuestions[questionKey as any] = null as any;
          console.log(e);
        }
      }
      parsedQuestions = parsedQuestions.filter(q => q !== null)
        .sort((qa, qb) => qa.order - qb.order);
      if (parsedQuestions.length > 0) {
        let buildQuestion = GetCashedBuildQuestion();
        if (buildQuestion && buildQuestion.questionNumber && parsedQuestions[buildQuestion.questionNumber]) {
          parsedQuestions.forEach(q => q.active = false);
          parsedQuestions[buildQuestion.questionNumber].active = true;
        } else {
          parsedQuestions[0].active = true;
        }
        setQuestions(q => update(q, { $set: parsedQuestions }));
      }
    }

    console.log(parsedQuestions);

    if (diff.synthesis) {
      setSynthesis(brick.synthesis);
    }

    setCurrentBrick(brick);
  }

  const pushDiff = (brick: any) => {
    const diff = getBrickDiff(currentBrick, brick);
    if(diff) {
      const backwardDiff = getBrickDiff(brick, currentBrick);
      if(Object.keys(diff).filter((k: any) => k !== "updated" && k !== "type").length === 0) {
        return;
      }
      undoRedoService.push({
        forward: diff,
        backward: backwardDiff
      });
      updateBrick(diff);
    }
  }

  const undo = () => {
    const diff = undoRedoService.undo();
    if(diff) {
      console.log(diff);
      applyDiff(diff);
      updateBrick(diff);
      prepareBrickToSave(brick, questions, synthesis);
      props.saveBrick(brick);
    }
  }

  const redo = () => {
    const diff = undoRedoService.redo();
    if(diff) {
      console.log(diff);
      applyDiff(diff);
      updateBrick(diff);
      prepareBrickToSave(brick, questions, synthesis);
      props.saveBrick(brick);
    }
  }

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
      history.push(map.ProposalReview);
    }
  };

  const setPrevFromPhone = () => {
    const index = getQuestionIndex(activeQuestion);
    if (index >= 1) {
      const updatedQuestions = activateQuestionByIndex(index - 1);
      setQuestions(update(questions, { $set: updatedQuestions }));
    }
  }

  const saveSynthesis = (text: string) => {
    synthesis = text;
    setSynthesis(synthesis);
    saveBrick();
  }

  const setNextQuestion = () => {
    const index = getQuestionIndex(activeQuestion);
    let lastIndex = questions.length - 1;
    if (index < lastIndex) {
      const updatedQuestions = activateQuestionByIndex(index + 1);
      setQuestions(update(questions, { $set: updatedQuestions }));
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
    const updatedQuestions = questions.slice();
    updatedQuestions.push(getNewQuestion(QuestionTypeEnum.None, false));
    saveBrickQuestions(updatedQuestions, (brick2: any) => {
      const postUpdatedQuestions = setLastQuestionId(brick, updatedQuestions);
      setQuestions(update(questions, { $set: postUpdatedQuestions }));
      cashBuildQuestion(brickId, postUpdatedQuestions.length - 1);
    });

    if (history.location.pathname.slice(-10) === '/synthesis') {
      history.push(`/build/brick/${brickId}/investigation/question`);
    }
  };

  const moveToSynthesis = () => {
    history.push(`/build/brick/${brickId}/investigation/synthesis`);
  }

  const setQuestionTypeAndMove = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    setQuestionType(type);
    history.push(`/build/brick/${brickId}/investigation/question-component`);
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
      history.push(`/build/brick/${brickId}/investigation/question`);
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
        let initQuestionSet = false;
        if (initQuestionId) {
          for (const question of parsedQuestions) {
            if (question.id === initQuestionId) {
              question.active = true;
              initQuestionSet = true;
            }
          }
        }
        if (initQuestionSet === false) {
          let buildQuestion = GetCashedBuildQuestion();
          if (buildQuestion && buildQuestion.questionNumber && parsedQuestions[buildQuestion.questionNumber]) {
            parsedQuestions[buildQuestion.questionNumber].active = true;
          } else {
            parsedQuestions[0].active = true;
          }
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

    // synthesis invalid
    if (!synthesis && !invalidQuestion) {
      setSubmitDialog(true);
      return;
    }

    if (invalidQuestion) {
      let invalid = isHighlightInvalid(invalidQuestion);
      if (invalid === false) {
        let isLine = false;
        if (invalidQuestion.type === QuestionTypeEnum.LineHighlighting) {
          isLine = true;
        }
        setInvalidHighlight({ isOpen: true, isLine });
      } else {
        const comp = getUniqueComponent(invalidQuestion);

        let answersCount = 1;
        if (comp.list) {
          answersCount = comp.list.length;
        }
        let isHintInvalid = validateHint(invalidQuestion.hint, answersCount);
        if (isHintInvalid) {
          let index = getQuestionIndex(invalidQuestion);
          setInvalidHint({ isOpen: true, questionNumber: index + 1});
        } else {
          setSubmitDialog(true);
        }
      }
    } else {
      if (proposalRes.isValid) {
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
      } else {
        setProposalResult({ ...proposalRes, isOpen: true });
      }
    }
  }

  const moveToInvalidProposal = () => {
    history.push(proposalResult.url);
  }

  const submitInvalidBrick = () => {
    saveBrick();
    history.push(`/back-to-work`);
  }

  const moveToRedTab = () => {
    const updatedQuestions = deactiveQuestions(questions);
    activateFirstInvalidQuestion(updatedQuestions);
    setQuestions(update(questions, { $set: updatedQuestions }));
  }

  const hideInvalidBrick = () => {
    setValidation(true);
    setSubmitDialog(false);
    moveToRedTab();
  }

  const setAutoSaveTime = () => {
    let time = Date.now();
    lastAutoSave = time;
    setLastAutoSave(time);
  }

  const saveBrickQuestions = (updatedQuestions: Question[], callback?: Function) => {
    if (canEdit === true) {
      setAutoSaveTime();
      setSavingStatus(true);
      prepareBrickToSave(brick, updatedQuestions, synthesis);

      console.log('save brick questions', brick);
      const diffBrick = {
        ...brick,
        questions: brick.questions.filter((q: Question) => q.id)
      } as Brick;
      pushDiff(diffBrick);
      setCurrentBrick(diffBrick);
      props.saveBrick(brick).then((res: Brick) => {
        console.log(res.questions.length)
        const time = Date.now();
        console.log(`${new Date(time)} -> ${res.updated}`);
        const timeDifference = Math.abs(time - new Date(res.updated).valueOf());
        if(timeDifference > 10000) {
          console.log("Not updated properly!!");
          setSaveError(true);
        } else {
          setSavingStatus(false);
          setSaveError(false);
        }
        console.log(res.questions.length)
        if (callback) {
          callback(res);
        }
      }).catch((err: any) => {
        console.log(err)
        console.log("Error saving brick.");
        setSaveError(true);
      });
    }
  }

  const saveBrick = () => {
    setSavingStatus(true);
    prepareBrickToSave(brick, questions, synthesis);
    if (canEdit === true) {
      console.log('save brick')
      //const diff = getBrickDiff(currentBrick, brick);
      pushDiff(brick);
      setCurrentBrick(brick);
      props.saveBrick(brick).then((res: Brick) => {
        const time = Date.now();
        console.log(`${new Date(time)} -> ${res.updated}`);
        const timeDifference = Math.abs(time - new Date(res.updated).valueOf());
        if(timeDifference > 10000) {
          console.log("Not updated properly!!");
          setSaveError(true);
        } else {
          setSavingStatus(false);
          setSaveError(false);
        }
      }).catch((err: any) => {
        console.log("Error saving brick.");
        setSaveError(true);
      });
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
        console.log('auto save brick');
        pushDiff(brick);
        setCurrentBrick(brick);
        setLastAutoSave(time);
        props.saveBrick(brick).then((res: Brick) => {
          console.log(`${new Date(time)} -> ${res.updated}`);
          const timeDifference = Math.abs(time - new Date(res.updated).valueOf());
          if(timeDifference > 10000) {
            console.log("Not updated properly!!");
            setSaveError(true);
          } else {
            setSavingStatus(false);
            setSaveError(false);
          }
        }).catch((err: any) => {
          console.log("Error saving brick!");
          setSaveError(true);
        });
      } else {
        setSavingStatus(false);
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

  const updateFirstComponent = (component: TextComponentObj) => {
    if (locked) { return; }
    const index = getQuestionIndex(activeQuestion);
    const updatedQuestions = questions.slice();
    updatedQuestions[index].firstComponent = component;
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
        isAuthor={isAuthor}
        validationRequired={validationRequired}
        initSuggestionExpanded={initSuggestionExpanded}
        updateFirstComponent={updateFirstComponent}
        getQuestionIndex={getQuestionIndex}
        setQuestion={setQuestion}
        toggleLock={toggleLock}
        updateComponents={updateComponents}
        setQuestionType={convertQuestionTypes}
        setPreviousQuestion={setPreviousQuestion}
        nextOrNewQuestion={setNextQuestion}
        saveBrick={autoSaveBrick}
        undo={undo}
        redo={redo}
        undoRedoService={undoRedoService}
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
    let type = QuestionTypeEnum.None;
    if (activeQuestion && activeQuestion.type) {
      type = activeQuestion.type;
    }
    return (
      <QuestionTypePage
        history={history}
        brickId={brickId}
        setHoverQuestion={setHoverQuestion}
        questionId={activeQuestion.id}
        setQuestionType={setQuestionTypeAndMove}
        questionType={type}
      />
    );
  };

  const isTutorialPassed = () => {
    const isCurrentEditor = (props.brick.editors?.findIndex((e:any) => e.id === props.user.id) ?? -1) >= 0;
    if (isCurrentEditor) {
      return true;
    }
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
        <Route path="/build/brick/:brickId/investigation/question-component">
          {renderBuildQuestion}
        </Route>
        <Route path="/build/brick/:brickId/investigation/question">
          {renderQuestionComponent}
        </Route>
        <Route path="/build/brick/:brickId/investigation/synthesis">
          <SynthesisPage
            locked={locked}
            editOnly={!canEdit}
            synthesis={synthesis}
            initSuggestionExpanded={initSuggestionExpanded}
            onSynthesisChange={saveSynthesis}
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

  let isValid = true;
  questions.forEach(q => {
    let isQuestionValid = validateQuestion(q as any);
    if (!isQuestionValid) {
      isValid = false;
    }
  });

  const switchQuestions = (questions: Question[]) => {
    if (canEdit === true) {
      setQuestions(questions);
      setAutoSaveTime();
      setSavingStatus(true);
      questions.map((question, index) => question.order = index);
      prepareBrickToSave(brick, questions, synthesis);
      pushDiff(brick);
      props.saveBrick(brick);
    }
  }

  if (!synthesis) {
    isValid = false;
  }

  const isCurrentEditor = (props.brick.editors?.findIndex((e:any) => e.id === props.user.id) ?? -1) >= 0;
  const isPublisher = checkPublisher(props.user, props.brick);
  const isAdmin = checkAdmin(props.user.roles);

  return (
    <div className="investigation-build-page">
      <BuildNavigation
        tutorialStep={step}
        isTutorialSkipped={isTutorialPassed()}
        isValid={isValid}
        moveToReview={moveToReview}
        isEditor={isCurrentEditor}
        isPublisher={isPublisher}
        isAdmin={isAdmin}
        history={history}
        brick={props.brick}
        exitAndSave={exitAndSave}
      />
      <Hidden only={['xs', 'sm']}>
        <TutorialLabels isTutorialPassed={isTutorialPassed()} tooltipsOn={tooltipsOn} />
        <YourProposalLink
          tutorialStep={step}
          tooltipsOn={tooltipsOn}
          invalid={validationRequired && !proposalResult.isValid}
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
              <div className="build-brick-title">
                <div>{brick.title}</div>
              </div>
              <Grid
                container
                item xs={12} sm={12} md={9}
                style={{ height: "90%", width: "75vw", minWidth: 'none' }}
              >
                <DragableTabs
                  location={history.location}
                  setQuestions={switchQuestions}
                  questions={questions}
                  synthesis={synthesis}
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
          <LastSave updated={brick.updated} tutorialStep={isTutorialPassed() ? TutorialStep.None : step} isSaving={isSaving} saveError={hasSaveError} />
          <Route path="/build/brick/:brickId/investigation/" exact>
            <Redirect to={`/build/brick/${brick.id}/investigation/question`} />
          </Route>
          <Route path="/build/brick/:brickId/investigation/question-component">
            <PhoneQuestionPreview
              question={activeQuestion}
              getQuestionIndex={getQuestionIndex}
              nextQuestion={setNextQuestion}
              prevQuestion={setPrevFromPhone}
            />
          </Route>
          <Route path="/build/brick/:brickId/investigation/question">
            {renderQuestionTypePreview()}
          </Route>
          <Route path="/build/brick/:brickId/investigation/synthesis">
            <PhonePreview
              Component={SynthesisPreviewComponent}
              prev={() => selectQuestion(questions.length - 1)}
              next={()=>{}}
              nextDisabled={true}
              data={{synthesis: synthesis, brickLength: brick.brickLength}}
            />
          </Route>
        </Grid>
        <HighlightInvalidDialog
          isOpen={highlightInvalid.isOpen}
          isLines={highlightInvalid.isLine}
          close={() => {
            setValidation(true);
            setInvalidHighlight({ isOpen: false, isLine: false})
          }}
        />
        <HintInvalidDialog
          isOpen={invalidHint.isOpen}
          invalidQuestionNumber={invalidHint.questionNumber}
          close={() => {
            setValidation(true);
            setInvalidHint({isOpen: false, questionNumber: -1})
          }}
        />
        <QuestionInvalidDialog
          isOpen={submitDialogOpen}
          close={() => setSubmitDialog(false)}
          submit={() => submitInvalidBrick()}
          hide={() => hideInvalidBrick()}
        />
        <ProposalInvalidDialog
          isOpen={proposalResult.isOpen}
          close={() => setProposalResult({ ...proposalResult, isOpen: false })}
          submit={() => submitInvalidBrick()}
          hide={() => moveToInvalidProposal()}
        />
        <DeleteQuestionDialog
          open={deleteDialogOpen}
          index={deleteQuestionIndex}
          setDialog={setDeleteDialog}
          deleteQuestion={deleteQuestionByIndex}
        />
        <SkipTutorialDialog
          open={skipTutorialOpen}
          close={() => setSkipDialog(false)}
          skip={() => {
            skipTutorial(true);
            setSkipDialog(false);
          }}
        />
      </Hidden>
      <Hidden only={['md', 'lg', 'xl']}>
        <div className="blue-page">
          <DesktopVersionDialog history={history} />
        </div>
      </Hidden>
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  brick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
  startEditing: (brickId: number) => dispatch(socketStartEditing(brickId)),
  changeQuestion: (questionId?: number) => dispatch(socketNavigateToQuestion(questionId)),
  saveBrick: (brick: any) => dispatch(actions.saveBrick(brick)),
  updateBrick: (brick: any) => dispatch(socketUpdateBrick(brick))
});

const connector = connect(mapState, mapDispatch);

export default connector(InvestigationBuildPage);
