import React from "react";
import { Route, Switch } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";

import "./brick.scss";
import Introduction from "./introduction/Introduction";
import Live from "./live/Live";
import ProvisionalScore from "./provisionalScore/ProvisionalScore";
import Synthesis from "./synthesis/Synthesis";
import Review from "./review/ReviewPage";
import Ending from "./ending/Ending";
import FinalStep from "./finalStep/FinalStep";
import queryString from 'query-string';

import { Brick } from "model/brick";
import { PlayStatus, BrickAttempt } from "./model";
import {
  Question,
  QuestionTypeEnum,
  QuestionComponentTypeEnum,
  HintStatus,
} from "model/question";
import { calcBrickLiveAttempt, calcBrickReviewAttempt } from './services/scoring';
import { setBrillderTitle } from "components/services/titleService";
import { prefillAttempts } from "components/services/PlayService";
import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";
import PlayLeftSidebar from './PlayLeftSidebar';
import { PlayMode } from './model';
import { ReduxCombinedState } from "redux/reducers";
import HomeButton from "components/baseComponents/homeButton/HomeButton";
import { BrickFieldNames } from "components/proposal/model";
import { maximizeZendeskButton, minimizeZendeskButton } from 'components/services/zendesk';


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
  user: any;
  history: any;
  location: any;
}

const BrickRouting: React.FC<BrickRoutingProps> = (props) => {
  const [brick, setBrick] = React.useState(props.brick);
  const initAttempts = prefillAttempts(brick.questions);
  const [status, setStatus] = React.useState(PlayStatus.Live);
  const [brickAttempt, setBrickAttempt] = React.useState({} as BrickAttempt);
  const [attempts, setAttempts] = React.useState(initAttempts);
  const [reviewAttempts, setReviewAttempts] = React.useState(initAttempts);
  const [startTime, setStartTime] = React.useState(undefined);
  const [sidebarRolledUp, toggleSideBar] = React.useState(false);
  const [mode, setMode] = React.useState(PlayMode.Normal);
  const [liveEndTime, setLiveEndTime] = React.useState(null as any);
  const location = useLocation();
  const finalStep = location.pathname.search("/finalStep") >= 0;

  setBrillderTitle(brick.title);

  const updateAttempts = (attempt: any, index: number) => {
    attempts[index] = attempt;
    setAttempts(attempts);
  };

  const updateReviewAttempts = (attempt: any, index: number) => {
    reviewAttempts[index] = attempt;
    setReviewAttempts(reviewAttempts);
  };

  const finishLive = () => {
    var ba = calcBrickLiveAttempt(brick, attempts);
    setStatus(PlayStatus.Review);
    setBrickAttempt(ba);
    setReviewAttempts(Object.assign([], attempts));
    setStatus(PlayStatus.Review);
  };

  const finishReview = () => {
    var ba = calcBrickReviewAttempt(brick, reviewAttempts, brickAttempt);
    setBrickAttempt(ba);
    setStatus(PlayStatus.Ending);
  };

  const saveBrickAttempt = () => {
    brickAttempt.brickId = brick.id;
    brickAttempt.studentId = props.user.id;
    let values = queryString.parse(location.search);
    if (values.assignmentId) {
      brickAttempt.assignmentId = parseInt(values.assignmentId as string);
    }
    return axios.post(
      process.env.REACT_APP_BACKEND_HOST + "/play/attempt",
      brickAttempt,
      { withCredentials: true }
    ).then(() => {
      props.history.push(`/play/brick/${brick.id}/finalStep`);
    }).catch(() => {
      alert("Can`t save your attempt");
    });
  };

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

  const moveToLive = () => {
    let liveLink = `/play/brick/${brick.id}/live`;
    const values = queryString.parse(props.location.search);
    const query = {} as any;
    if (values.resume === 'true') {
      if (values.activeStep) {
        query.activeStep = values.activeStep;
      }
    }
    if (values.assignmentId) {
      query.assignmentId = values.assignmentId;
    }
    props.history.push(liveLink + "?" + queryString.stringify(query));
    setSidebar(true);
  }

  const onHighlight = (name: BrickFieldNames, value: string) => {
    brick[name] = value;
    setBrick(brick);
  }

  const renderHead = () => {
    let isMobileHidden = false;
    const live = location.pathname.search("/live");
    const score = location.pathname.search("/provisionalScore");
    const synthesis = location.pathname.search("/synthesis");
    const review = location.pathname.search("/review");
    const ending = location.pathname.search("/ending");
    if (live > 0 || score > 0 || synthesis > 0 || review > 0 || ending > 0) {
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
  };
  const renderRouter = () => {
    return (
      <Switch>
        <Route exac path="/play/brick/:brickId/intro">
          <Introduction
            location={props.location}
            mode={mode}
            brick={brick}
            startTime={startTime}
            setStartTime={setStartTime}
            moveNext={moveToLive}
            onHighlight={onHighlight}
          />
        </Route>
        <Route exac path="/play/brick/:brickId/live">
          <Live
            mode={mode}
            status={status}
            attempts={attempts}
            questions={brick.questions}
            brick={brick}
            updateAttempts={updateAttempts}
            finishBrick={finishLive}
            endTime={liveEndTime}
            setEndTime={time => {
              if (liveEndTime === null) {
                setLiveEndTime(time);
              }
            }}
          />
        </Route>
        <Route exac path="/play/brick/:brickId/provisionalScore">
          <ProvisionalScore
            history={props.history}
            location={location}
            status={status}
            brick={brick}
            attempts={attempts}
          />
        </Route>
        <Route exac path="/play/brick/:brickId/synthesis">
          <Synthesis mode={mode} status={status} brick={brick} />
        </Route>
        <Route exac path="/play/brick/:brickId/review">
          <Review
            mode={mode}
            status={status}
            questions={brick.questions}
            brickId={brick.id}
            startTime={startTime}
            brickLength={brick.brickLength}
            updateAttempts={updateReviewAttempts}
            attempts={attempts}
            finishBrick={finishReview}
          />
        </Route>
        <Route exac path="/play/brick/:brickId/ending">
          <Ending
            status={status}
            location={location}
            brick={brick}
            history={props.history}
            brickAttempt={brickAttempt}
            saveAttempt={saveBrickAttempt}
          />
        </Route>
        <Route exac path="/play/brick/:brickId/finalStep">
          <FinalStep
            user={props.user}
            brick={brick}
            history={props.history}
          />
        </Route>
      </Switch>
    );
  };

  let className = "sorted-row";
  if (sidebarRolledUp) {
    className += " sorted-row-expanded";
  }

  return (
    <div className="play-preview-pages">
      {renderHead()}
      <div className={className}>
        <PlayLeftSidebar mode={mode} sidebarRolledUp={sidebarRolledUp} empty={finalStep} setMode={setMode} toggleSidebar={setSidebar} />
        <div className="brick-row-container">
          {renderRouter()}
        </div>
      </div>
    </div>
  );
};

const parseAndShuffleQuestions = (brick: Brick): Brick => {
  /* Parsing each Question object from json <contentBlocks> */
  if (!brick) {
    return brick;
  }
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
            components: parsedQuestion.components,
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

  shuffleBrick.questions.forEach((question) => {
    if (
      question.type === QuestionTypeEnum.ChooseOne ||
      question.type === QuestionTypeEnum.ChooseSeveral
    ) {
      question.components.forEach((c) => {
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
    } else if (
      question.type === QuestionTypeEnum.VerticalShuffle ||
      question.type === QuestionTypeEnum.HorizontalShuffle
    ) {
      question.components.forEach((c) => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          for (let [index, item] of c.list.entries()) {
            item.index = index;
            item.hint = question.hint.list[index];
          }
          c.list = shuffle(c.list);
        }
      });
    } else if (question.type === QuestionTypeEnum.PairMatch) {
      question.components.forEach((c) => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          for (let [index, item] of c.list.entries()) {
            item.index = index;
            item.hint = question.hint.list[index];
          }
          const choices = c.list.map((a: any) => ({
            value: a.value,
            index: a.index,
            valueFile: a.valueFile,
            answerType: a.answerType,
          }));
          c.choices = shuffle(choices);
        }
      });
    }
  });
  return shuffleBrick;
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  brick: parseAndShuffleQuestions(state.brick.brick) as Brick,
});

const connector = connect(mapState);

export default connector(BrickRouting);
