import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { isMobile } from "react-device-detect";

import { connect } from "react-redux";

import 'components/play/brick.scss';
import './PreviewBrickRouting.scss';
import actions from 'redux/actions/brickActions';
import { GetCashedBuildQuestion } from 'localStorage/buildLocalStorage';
import { Brick } from 'model/brick';
import { ComponentAttempt, PlayStatus } from '../play/model';
import {
  Question, QuestionTypeEnum, QuestionComponentTypeEnum, HintStatus
} from 'model/question';
import { setBrillderTitle } from 'components/services/titleService';
import { prefillAttempts } from 'components/services/PlayService';
import { canEditBrick, checkEditor } from 'components/services/brickService';
import { ReduxCombinedState } from 'redux/reducers';
import { maximizeZendeskButton, minimizeZendeskButton } from 'components/services/zendesk';
import { User } from 'model/user';

import Introduction from 'components/play/introduction/Introduction';
import Live from 'components/play/live/Live';
import ProvisionalScore from 'components/play/provisionalScore/ProvisionalScore';
import Synthesis from 'components/play/synthesis/Synthesis';
import Review from 'components/play/review/ReviewPage';
import Ending from 'components/play/ending/Ending'
import HomeButton from "components/baseComponents/homeButton/HomeButton";
import PublishPage from './publish/PublishPage';
import EditorPage from './editor/EditorPage';
import FinishPage from './finish/FinishPage';
import PageHeadWithMenu, { PageEnum } from 'components/baseComponents/pageHeader/PageHeadWithMenu';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import PlayLeftSidebar from 'components/play/PlayLeftSidebar';


export interface BrickAttempt {
  brickId?: number;
  studentId?: number;
  brick?: Brick;
  score: number;
  oldScore?: number;
  maxScore: number;
  student?: any;
  answers: ComponentAttempt<any>[];
}

function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface BrickRoutingProps {
  brick: Brick;
  match: any;
  user: User;
  history: any;
  location: any;
  fetchBrick(brickId: number): void;
  assignEditor(brick: any): void;
}

const BrickRouting: React.FC<BrickRoutingProps> = (props) => {
  let initAttempts: any[] = [];
  if (props.brick) {
    initAttempts = prefillAttempts(props.brick.questions);
  }

  let cashedBuildQuestion = GetCashedBuildQuestion();

  const [status, setStatus] = React.useState(PlayStatus.Live);
  const [brickAttempt, setBrickAttempt] = React.useState({} as BrickAttempt);
  const [attempts, setAttempts] = React.useState(initAttempts);
  const [reviewAttempts, setReviewAttempts] = React.useState(initAttempts);
  const [startTime, setStartTime] = React.useState(undefined);
  const [sidebarRolledUp, toggleSideBar] = React.useState(false);
  const location = useLocation();

  useEffect(() => {
    if (props.brick) {
      let initAttempts = prefillAttempts(props.brick.questions);
      setAttempts(initAttempts);
    }
  }, [props.brick]);

  const brickId = parseInt(props.match.params.brickId);
  if (!props.brick || props.brick.id !== brickId || !props.brick.author) {
    props.fetchBrick(brickId);
    return <PageLoader content="...Loading brick..." />;
  }

  setBrillderTitle(props.brick.title);

  const updateAttempts = (attempt: any, index: number) => {
    attempts[index] = attempt;
    setAttempts(attempts);
  }

  const updateReviewAttempts = (attempt: any, index: number) => {
    reviewAttempts[index] = attempt;
    setReviewAttempts(reviewAttempts);
  }

  const finishBrick = () => {
    /* If no answer given or no mark provided for question then return acc accumulated score +0 so
    it still has an integer value, else return acc + additional mark */
    let score = attempts.reduce((acc, answer) => acc + answer.marks, 0);
    /* MaxScore allows the percentage to be worked out at the end. If no answer or no maxMarks for the question
    is provided for a question then add a standard 5 marks to the max score, else add the maxMarks of the question.*/
    let maxScore = attempts.reduce((acc, answer) => acc + answer.maxMarks, 0);
    var ba: BrickAttempt = {
      brick: props.brick,
      score: score,
      maxScore: maxScore,
      student: null,
      answers: attempts
    };
    setStatus(PlayStatus.Review);
    setBrickAttempt(ba);
    setReviewAttempts(Object.assign([], attempts));
    setStatus(PlayStatus.Review);
  }

  const finishReview = () => {
    let score = reviewAttempts.reduce((acc, answer) => acc + answer.marks, 0) + brickAttempt.score;
    let maxScore = reviewAttempts.reduce((acc, answer) => acc + answer.maxMarks, 0);
    var ba: BrickAttempt = {
      score,
      maxScore,
      oldScore: brickAttempt.score,
      answers: reviewAttempts
    };
    setBrickAttempt(ba);
    setStatus(PlayStatus.Ending);
  }

  const saveBrickAttempt = () => {
    brickAttempt.brickId = props.brick.id;
    brickAttempt.studentId = props.user.id;
    let canEdit = canEditBrick(props.brick, props.user);
    if (canEdit) {
      let editor = checkEditor(props.user.roles);
      if (editor && props.user.id === props.brick.author.id) {
        props.history.push(`/play-preview/brick/${brickId}/editor`);
      } else {
        props.history.push(`/play-preview/brick/${brickId}/publish`);
      }
    } else {
      props.history.push(`/play-preview/brick/${brickId}/finish`);
    }
  }

  const saveEditor = (editorId: number) => {
    props.assignEditor({ ...props.brick, editor: { id: editorId } });
    props.history.push(`/play-preview/brick/${props.brick.id}/finish`);
  }

  const moveToBuild = () => {
    props.history.push(`/build/brick/${brickId}/build/investigation/question`);
  }

  const setSidebar = (state?: boolean) => {
    if (typeof state === "boolean") {
      toggleSideBar(state);
      if (!state) {
        maximizeZendeskButton();
      } else {
        minimizeZendeskButton();
      }
    } else {
      toggleSideBar(!sidebarRolledUp);
      if (sidebarRolledUp) {
        maximizeZendeskButton();
      } else {
        minimizeZendeskButton();
      }
    }
  }

  const getBuildQuestionNumber = () => {
    if (
      cashedBuildQuestion &&
      cashedBuildQuestion.questionNumber &&
      cashedBuildQuestion.isTwoOrMoreRedirect
    ) {
      return cashedBuildQuestion.questionNumber;
    }
    return 0;
  }

  const renderHead = () => {
    let isMobileHidden = false;
    const live = location.pathname.search("/live");
    const score = location.pathname.search("/provisionalScore");
    const synthesis = location.pathname.search("/synthesis");
    const review = location.pathname.search("/review");
    const ending = location.pathname.search("/ending");
    const publish = location.pathname.search("/publish");
    const finish = location.pathname.search("/finish");
    if (live > 0 || score > 0 || synthesis > 0 || review > 0 || ending > 0 || publish > 0 || finish > 0) {
      isMobileHidden = true;
    }

    if (!isMobile && sidebarRolledUp) {
      return <HomeButton link="/home" />;
    }
    return (
      <PageHeadWithMenu
        isMobileHidden={isMobileHidden}
        page={PageEnum.Play}
        user={props.user}
        history={props.history}
        search={() => { }}
        searching={() => { }}
      />
    );
  }

  let className = "sorted-row";
  if (sidebarRolledUp) {
    className += " sorted-row-expanded";
  }

  return (
    <div className="play-preview-pages">
      {renderHead()}
      <div className={className}>
        <PlayLeftSidebar
          sidebarRolledUp={sidebarRolledUp}
          toggleSidebar={setSidebar}
          isPreview={true}
          moveToBuild={moveToBuild}
        />
        <div className="brick-row-container">
          <Switch>
            <Route exac path="/play-preview/brick/:brickId/intro">
              <Introduction
                location={props.location}
                brick={props.brick}
                isPlayPreview={true}
                startTime={startTime}
                setStartTime={setStartTime}
              />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/live">
              <Live
                status={status}
                attempts={attempts}
                previewQuestionIndex={getBuildQuestionNumber()}
                isPlayPreview={true}
                brick={props.brick}
                questions={props.brick.questions}
                endTime={null}
                updateAttempts={updateAttempts}
                finishBrick={finishBrick}
                setEndTime={() => { }}
              />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/provisionalScore">
              <ProvisionalScore status={status} brick={props.brick} startTime={startTime} attempts={attempts} isPlayPreview={true} />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/synthesis">
              <Synthesis status={status} brick={props.brick} isPlayPreview={true} />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/review">
              <Review
                isPlayPreview={true}
                status={status}
                questions={props.brick.questions}
                brickId={props.brick.id}
                startTime={startTime}
                brickLength={props.brick.brickLength}
                updateAttempts={updateReviewAttempts}
                attempts={attempts}
                finishBrick={finishReview}
              />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/ending">
              <Ending
                location={location}
                status={status}
                history={props.history}
                brick={props.brick}
                brickAttempt={brickAttempt}
                saveAttempt={saveBrickAttempt}
              />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/publish">
              <PublishPage history={props.history} match={props.match} />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/editor">
              <EditorPage
                brick={props.brick}
                canEdit={true}
                saveEditor={saveEditor}
                history={props.history}
              />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/finish">
              <FinishPage history={props.history} match={props.match} />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

const parseAndShuffleQuestions = (brick: Brick): Brick => {
  /* Parsing each Question object from json <contentBlocks> */
  if (!brick) { return brick; }
  const parsedQuestions: Question[] = [];
  for (const question of brick.questions) {
    if (!question.components) {
      try {
        const parsedQuestion = JSON.parse(question.contentBlocks as string);
        if (parsedQuestion.components) {
          let q = {
            id: question.id,
            type: question.type,
            hint: parsedQuestion.hint,
            components: parsedQuestion.components
          } as Question;
          parsedQuestions.push(q);
        }
      } catch (e) { }
    } else {
      parsedQuestions.push(question);
    }
  }

  let shuffleBrick = Object.assign({}, brick);

  shuffleBrick.questions = parsedQuestions;

  shuffleBrick.questions.forEach(question => {
    if (question.type === QuestionTypeEnum.ChooseOne || question.type === QuestionTypeEnum.ChooseSeveral) {
      question.components.forEach(c => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          const { hint } = question;
          if (hint.status === HintStatus.Each) {
            for (let [index, item] of c.list.entries()) {
              item.hint = question.hint.list[index];
            }
          }
          c.list = shuffle(c.list);
        }
      });
    } else if (question.type === QuestionTypeEnum.VerticalShuffle || question.type === QuestionTypeEnum.HorizontalShuffle) {
      question.components.forEach(c => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          for (let [index, item] of c.list.entries()) {
            item.index = index;
            item.hint = question.hint.list[index];
          }
          c.list = shuffle(c.list);
        }
      });
    } else if (question.type === QuestionTypeEnum.PairMatch) {
      question.components.forEach(c => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          for (let [index, item] of c.list.entries()) {
            item.index = index;
            item.hint = question.hint.list[index];
          }
          const choices = c.list.map((a: any) => ({
            value: a.value,
            index: a.index,
            valueFile: a.valueFile,
            answerType: a.answerType
          }));
          c.choices = shuffle(choices);
        }
      });
    }
  });
  return shuffleBrick;
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  brick: parseAndShuffleQuestions(state.brick.brick) as Brick,
});

const mapDispatch = (dispatch: any) => ({
  fetchBrick: (id: number) => dispatch(actions.fetchBrick(id)),
  assignEditor: (brick: any) => dispatch(actions.assignEditor(brick))
})

const connector = connect(mapState, mapDispatch);

export default connector(BrickRouting);
