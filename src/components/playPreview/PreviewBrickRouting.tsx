import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { isIPad13, isMobile, isTablet } from 'react-device-detect';

import actions from 'redux/actions/brickActions';
import { CashQuestionFromPlay, GetCashedBuildQuestion } from 'localStorage/buildLocalStorage';
import { Brick } from 'model/brick';
import { ComponentAttempt, PlayStatus } from '../play/model';
import {
  Question, QuestionTypeEnum, QuestionComponentTypeEnum, HintStatus
} from 'model/question';
import { getBrillderTitle } from 'components/services/titleService';
import { prefillAttempts } from 'components/services/PlayService';
import { ReduxCombinedState } from 'redux/reducers';
import { maximizeZendeskButton, minimizeZendeskButton } from 'services/zendesk';
import { User } from 'model/user';

import Introduction from 'components/play/introduction/Introduction';
import Live from 'components/play/live/Live';
import ProvisionalScore from 'components/play/provisionalScore/ProvisionalScore';
import Synthesis from 'components/play/synthesis/Synthesis';
import Review from 'components/play/review/ReviewPage';
import Ending from 'components/play/ending/Ending'
import HomeButton from "components/baseComponents/homeButton/HomeButton";
import PageHeadWithMenu, { PageEnum } from 'components/baseComponents/pageHeader/PageHeadWithMenu';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import PlayLeftSidebar from 'components/play/PlayLeftSidebar';
import BuildCompletePage from './buildComplete/BuildCompletePage';
import FinalStep from './finalStep/FinalStep';
import { calcBrickLiveAttempt, calcBrickReviewAttempt } from 'components/play/services/scoring';
import playRoutes from "components/play/routes";
import buildRoutes from 'components/build/routes';
import routes from './routes';
import NewPrep from 'components/play/newPrep/NewPrep';
import map from 'components/map';


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
}

const MobileTheme = React.lazy(() => import('../play/themes/BrickPageMobileTheme'));
const TabletTheme = React.lazy(() => import('../play/themes/BrickPageTabletTheme'));
const DesktopTheme = React.lazy(() => import('../play/themes/BrickPageDesktopTheme'));

const BrickRouting: React.FC<BrickRoutingProps> = (props) => {
  const { history, location, match } = props;
  const parsedBrick = parseAndShuffleQuestions(props.brick);

  let cashedBuildQuestion = GetCashedBuildQuestion();
  console.log(cashedBuildQuestion);

  const [brick] = React.useState(parsedBrick);
  const [status, setStatus] = React.useState(PlayStatus.Live);
  const [brickAttempt, setBrickAttempt] = React.useState({} as BrickAttempt);
  const initAttempts = prefillAttempts(brick.questions);
  const [attempts, setAttempts] = React.useState(initAttempts);
  const [reviewAttempts, setReviewAttempts] = React.useState(initAttempts);
  const [startTime, setStartTime] = React.useState(undefined);
  const [sidebarRolledUp, toggleSideBar] = React.useState(false);
  const [headerHidden, hideMobileHeader] = React.useState(false);
  const [liveEndTime, setLiveEndTime] = React.useState(null as any);
  const [reviewEndTime, setReviewEndTime] = React.useState(null as any);

  useEffect(() => {
    if (props.brick) {
      const parsedBrick = parseAndShuffleQuestions(props.brick);
      const initAttempts = prefillAttempts(parsedBrick.questions);
      setAttempts(initAttempts);
    }
  }, [props.brick]);

  const brickId = parseInt(match.params.brickId);
  if (!brick || brick.id !== brickId || !brick.author) {
    props.fetchBrick(brickId);
    return <PageLoader content="...Loading brick..." />;
  }


  const updateAttempts = (attempt: any, index: number) => {
    attempts[index] = attempt;
    setAttempts(attempts);
  }

  const updateReviewAttempts = (attempt: any, index: number) => {
    reviewAttempts[index] = attempt;
    setReviewAttempts(reviewAttempts);
  }

  const finishBrick = () => {
    const ba = calcBrickLiveAttempt(brick, attempts);
    setStatus(PlayStatus.Review);
    setBrickAttempt(ba);
    setReviewAttempts(Object.assign([], attempts));
    setStatus(PlayStatus.Review);
  }

  const finishReview = () => {
    const ba = calcBrickReviewAttempt(brick, reviewAttempts, brickAttempt);
    setBrickAttempt(ba);
    setStatus(PlayStatus.Ending);
  }

  const saveBrickAttempt = () => {
    const { user } = props;
    brickAttempt.brickId = brick.id;
    brickAttempt.studentId = user.id;

    let isCurrentEditor = (brick.editors?.findIndex(e => e.id === user.id) ?? -1) >= 0;
    if (isCurrentEditor) {
      history.push(`/play-preview/brick/${brickId}/submit`);
    } else {
      history.push(`/play-preview/brick/${brickId}/build-complete`);
    }
  }

  const moveToLive = () => {
    if (isMobile) {
      hideMobileHeader(true);
    }
    history.push(routes.previewLive(brick.id));
    setSidebar(true);
  }

  const moveToReview = () => {
    history.push(routes.previewReview(brick.id));
  }

  const moveToBuild = () => {
    const {pathname} = history.location;
    const isSynthesis = pathname.slice(-playRoutes.PlaySynthesisLastPrefix.length) === playRoutes.PlaySynthesisLastPrefix;
    const isNewPrep = pathname.slice(-playRoutes.PlayNewPrepLastPrefix.length) === playRoutes.PlayNewPrepLastPrefix;

    let link = buildRoutes.buildQuesiton(brickId);
    if (isSynthesis) {
      link = buildRoutes.buildSynthesis(brickId);
      CashQuestionFromPlay(brickId, -1);
    } else if (isNewPrep) {
      link = buildRoutes.buildPlan(brickId);
      CashQuestionFromPlay(brickId, -1);
    } else {
      const data = GetCashedBuildQuestion();
      if (data?.brickId === brickId) {
        try {
          link += '/' + brick.questions[data.questionNumber].id;
        } catch {

        }
      }
    }
    history.push(link);
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
    const live = location.pathname.search(playRoutes.PlayLiveLastPrefix);
    const score = location.pathname.search("/provisionalScore");
    const synthesis = location.pathname.search(playRoutes.PlaySynthesisLastPrefix);
    const review = location.pathname.search(playRoutes.PlayReviewLastPrefix);
    const ending = location.pathname.search("/ending");
    const publish = location.pathname.search("/publish");
    const finish = location.pathname.search("/finish");
    if (live > 0 || score > 0 || synthesis > 0 || review > 0 || ending > 0 || publish > 0 || finish > 0) {
      isMobileHidden = true;
    }
    if (live && !sidebarRolledUp) {
      toggleSideBar(true);
    }

    if (!isMobile && sidebarRolledUp) {
      return <HomeButton link={map.MainPage} />;
    }
    if (isMobile && headerHidden) {
      return <div></div>;
    }
    return (
      <PageHeadWithMenu
        isMobileHidden={isMobileHidden}
        page={PageEnum.Play}
        user={props.user}
        history={history}
        search={() => { }}
        searching={() => { }}
      />
    );
  }

  let className = "sorted-row";
  if (sidebarRolledUp) {
    className += " sorted-row-expanded";
  }

  console.log(history.location.pathname);

  return (
    <React.Suspense fallback={<></>}>
      {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
      <div className="play-preview-pages">
        <Helmet>
          <title>{getBrillderTitle(brick.title)}</title>
        </Helmet>
        {renderHead()}
        <div className={className}>
          <PlayLeftSidebar
            history={history}
            brick={brick}
            sidebarRolledUp={sidebarRolledUp}
            toggleSidebar={setSidebar}
            isPreview={true}
            moveToBuild={moveToBuild}
          />
          <Switch>
            <Route exact path={routes.newPrepRoute}>
              <NewPrep brick={brick} moveNext={moveToLive} briefExpanded={true} />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/intro">
              <Introduction
                location={location}
                history={history}
                brick={brick}
                isPlayPreview={true}
                startTime={startTime}
                setStartTime={setStartTime}
                moveNext={moveToLive}
              />
            </Route>
            <Route exac path={routes.preLiveRoute}>
              <Live
                status={status}
                attempts={attempts}
                previewQuestionIndex={getBuildQuestionNumber()}
                isPlayPreview={true}
                brick={brick}
                questions={brick.questions}
                updateAttempts={updateAttempts}
                finishBrick={finishBrick}
                endTime={liveEndTime}
                setEndTime={time => {
                  if (liveEndTime === null) {
                    setLiveEndTime(time);
                  }
                }}
              />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/provisionalScore">
              <ProvisionalScore
                history={history}
                location={location}
                status={status}
                brick={brick}
                attempts={attempts}
                isPlayPreview={true}
              />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/synthesis">
              <Synthesis status={status} brick={brick} isPlayPreview={true} moveNext={moveToReview} />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/review">
              <Review
                history={history}
                isPlayPreview={true}
                status={status}
                brick={brick}
                startTime={startTime}
                updateAttempts={updateReviewAttempts}
                attempts={attempts}
                finishBrick={finishReview}
                endTime={reviewEndTime}
                setEndTime={time => {
                  if (reviewEndTime === null) {
                    setReviewEndTime(time);
                  }
                }}
              />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/ending">
              <Ending
                location={location}
                status={status}
                history={history}
                brick={brick}
                brickAttempt={brickAttempt}
                move={saveBrickAttempt}
              />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/build-complete">
              <BuildCompletePage brick={brick} history={history} />
            </Route>
            <Route exac path="/play-preview/brick/:brickId/submit">
              <FinalStep user={props.user} status={status} history={history} location={location} />
            </Route>
          </Switch>
        </div>
      </div>
    </React.Suspense>
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
            firstComponent: parsedQuestion.firstComponent ? parsedQuestion.firstComponent : { type: QuestionComponentTypeEnum.Text, value: '' },
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
          c.list.map((c: any, i: number) => c.index = i);
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
          c.list.map((c: any, i: number) => c.index = i);
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
  brick: state.brick.brick,
});

const mapDispatch = (dispatch: any) => ({
  fetchBrick: (id: number) => dispatch(actions.fetchBrick(id))
});

const connector = connect(mapState, mapDispatch);

export default connector(BrickRouting);
