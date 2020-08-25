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

import { Brick } from "model/brick";
import { ComponentAttempt, PlayStatus } from "./model/model";
import {
  Question,
  QuestionTypeEnum,
  QuestionComponentTypeEnum,
  HintStatus,
} from "model/question";
import { setBrillderTitle } from "components/services/titleService";
import { prefillAttempts } from "components/services/PlayService";
import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";
import PlayLeftSidebar from './PlayLeftSidebar';
import { PlayMode} from './model';
import { ReduxCombinedState } from "redux/reducers";
import HomeButton from "components/baseComponents/homeButton/HomeButton";
import { BrickFieldNames } from "components/build/proposal/model";
import { maximizeZendeskButton, minimizeZendeskButton } from 'components/services/zendesk';

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

  // Commented this in order to allow students to also be builders and vice versa, we may need to add this back in (11/5/2020)
  // let cantPlay = roles.some((role: any) => role.roleId === UserType.Builder || role.roleId === UserType.Editor);
  // if (cantPlay) {
  //   return <div>...Whoa slow down there, we need to give you the student role so you can play all the bricks...</div>
  // }

  setBrillderTitle(brick.title);

  const updateAttempts = (attempt: any, index: number) => {
    attempts[index] = attempt;
    setAttempts(attempts);
  };

  const updateReviewAttempts = (attempt: any, index: number) => {
    reviewAttempts[index] = attempt;
    setReviewAttempts(reviewAttempts);
  };

  /* TODO: extract all of this scoring code into a scoring service 13/6/2020*/
  const finishBrick = () => {
    let score = attempts.reduce((acc, answer) => {
      if (answer && answer.marks >= 0) {
        return acc + answer.marks;
      }
      return acc;
    }, 0);
    /* MaxScore allows the percentage to be worked out at the end. If no answer or no maxMarks for the question
    is provided for a question then add a standard 5 marks to the max score, else add the maxMarks of the question.*/
    let maxScore = attempts.reduce((acc, answer) => {
      if (answer && answer.maxMarks) {
        return acc + answer.maxMarks;
      }
      return acc;
    }, 0);
    var ba: BrickAttempt = {
      brick: brick,
      score: score,
      maxScore: maxScore,
      student: null,  
      answers: attempts,
    };
    setStatus(PlayStatus.Review);
    setBrickAttempt(ba);
    setReviewAttempts(Object.assign([], attempts));
    setStatus(PlayStatus.Review);
  };

  const finishReview = () => {
    let reviewScore = reviewAttempts.reduce((acc, answer) => {
      if (answer && answer.marks >= 0) {
        return acc + answer.marks;
      }
      return acc;
    }, 0);
    let score = reviewScore + brickAttempt.score;
    let maxScore = reviewAttempts.reduce(
      (acc, answer) => {
        if (answer && answer.maxMarks >= 0) {
          return acc + answer.maxMarks
        }
        return acc;
      },
      0
    );
    var ba: BrickAttempt = {
      score,
      maxScore,
      oldScore: brickAttempt.score,
      answers: reviewAttempts,
    };
    setBrickAttempt(ba);
    setStatus(PlayStatus.Ending);
  };

  const saveBrickAttempt = () => {
    brickAttempt.brickId = brick.id;
    brickAttempt.studentId = props.user.id;
    return axios
      .post(
        process.env.REACT_APP_BACKEND_HOST + "/play/attempt",
        brickAttempt,
        { withCredentials: true }
      )
      .then((res) => {
        props.history.push(`/play/dashboard`);
      })
      .catch((error) => {
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
    props.history.push(`/play/brick/${brick.id}/live`);
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
            finishBrick={finishBrick}
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
            status={status}
            startTime={startTime}
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
            brick={brick}
            history={props.history}
            attempts={attempts}
            brickAttempt={brickAttempt}
            saveBrick={saveBrickAttempt}
          />
        </Route>
        <Route exac path="/play/brick/:brickId/finalStep">
          <FinalStep
            status={status}
            brick={brick}
            history={props.history}
            attempts={attempts}
            brickAttempt={brickAttempt}
            saveBrick={saveBrickAttempt}
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
