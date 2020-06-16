import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
// @ts-ignore
import { connect } from "react-redux";

import '../play/brick/brick.scss';
import './PreviewBrickRouting.scss';
import actions from 'redux/actions/brickActions';
import Introduction from '../play/brick/introduction/Introduction';
import Live from '../play/brick/live/Live';
import ProvisionalScore from '../play/brick/provisionalScore/ProvisionalScore';
import Synthesis from '../play/brick/synthesis/Synthesis';
import Review from '../play/brick/review/ReviewPage';
import Ending from '../play/brick/ending/Ending';

import { GetCashedBuildQuestion } from '../localStorage/buildLocalStorage';

import { Brick } from 'model/brick';
import { ComponentAttempt, PlayStatus } from '../play/brick/model/model';
import {
  Question, QuestionTypeEnum, QuestionComponentTypeEnum, HintStatus
} from 'model/question';
import { Grid } from '@material-ui/core';
import { setBrillderTitle } from 'components/services/titleService';
import PublishPage from './investigationBuildPage/publish/PublishPage';
import {prefillAttempts} from 'components/services/PlayService';
import PageHeader from 'components/baseComponents/pageHeader/PageHeader';

import {Moment} from 'moment';
let moment = require('moment');


export interface BrickAttempt {
  brickId?: number;
  studentId?: number;
  brick?: Brick;
  score: number;
  oldScore?: number;
  maxScore: number;
  student?: any;
  answers: ComponentAttempt[];
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
  fetchBrick(brickId: number):void;
}

const BrickRouting: React.FC<BrickRoutingProps> = (props) => {
  let initAttempts:any[] = [];
  if (props.brick) {
    initAttempts = prefillAttempts(props.brick.questions);
  }

  let cashedBuildQuestion = GetCashedBuildQuestion();
  
  const [status, setStatus] = React.useState(PlayStatus.Live);
  const [brickAttempt, setBrickAttempt] = React.useState({} as BrickAttempt);
  const [attempts, setAttempts] = React.useState(initAttempts);
  const [reviewAttempts, setReviewAttempts] = React.useState(initAttempts);
  const [startTime, setStartTime] = React.useState(moment() as Moment);

  useEffect(() => {
    if (props.brick) {
      let initAttempts = prefillAttempts(props.brick.questions);
      setAttempts(initAttempts);
    }
  }, [props.brick]);

  const brickId = parseInt(props.match.params.brickId);
  if (!props.brick || props.brick.id !== brickId || !props.brick.author) {
    props.fetchBrick(brickId);
    return <div>...Loading brick...</div>
  }

  setBrillderTitle(props.brick.title);

  const updateAttempts = (attempt:any, index:number) => {
    attempts[index] = attempt;
    setAttempts(attempts);
  }

  const updateReviewAttempts = (attempt:any, index:number) => {
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
    var ba : BrickAttempt = {
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
    var ba : BrickAttempt = {
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
    props.history.push(`/play-preview/brick/${brickId}/publish`);
  }

  const moveToBuild = () => {
    props.history.push(`/build/brick/${brickId}/build/investigation/question`);
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

  return (
    <div className="play-preview-pages">
      <PageHeader 
        searchPlaceholder="Search Subjects, Topics, Titles & more"
        search={() => {}}
        searching={() => {}}
        showDropdown={() => {}}
      />
      <Grid container direction="row">
      <Grid xs={2} className="back-to-build">
        <div className="back-hover-area" onClick={() => moveToBuild()}>
          <div className="create-icon"></div>
          <div>BACK</div>
          <div>TO</div>
          <div>BUILD</div>
        </div>
      </Grid>
      <Grid item xs={10}>
        <Switch>
          <Route exac path="/play-preview/brick/:brickId/intro">
            <Introduction brick={props.brick} isPlayPreview={true} startTime={startTime} />
          </Route>
          <Route exac path="/play-preview/brick/:brickId/live">
            <Live
              status={status}
              startTime={startTime}
              brick={props.brick}
              previewQuestionIndex={getBuildQuestionNumber()}
              isPlayPreview={true}
              questions={props.brick.questions}
              updateAttempts={updateAttempts}
              finishBrick={finishBrick}
            />
          </Route>
        <Route exac path="/play-preview/brick/:brickId/provisionalScore">
          <ProvisionalScore status={status} brick={props.brick} attempts={attempts} isPlayPreview={true} />
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
            updateAttempts={updateReviewAttempts}
            attempts={attempts}
            finishBrick={finishReview} />
        </Route>
        <Route exac path="/play-preview/brick/:brickId/ending">
          <Ending status={status} brick={props.brick} brickAttempt={brickAttempt} saveBrick={saveBrickAttempt} />
        </Route>
        <Route exac path="/play-preview/brick/:brickId/publish">
          <PublishPage {...props} />
        </Route>
      </Switch>
      </Grid>
      </Grid>
    </div>
  );
}

const parseAndShuffleQuestions = (brick:Brick):Brick => {
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
      } catch (e) {}
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
          const {hint} = question;
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
          const choices = c.list.map((a:any) => ({
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

const mapState = (state: any) => {
  return {
    user: state.user.user,
    brick: parseAndShuffleQuestions(state.brick.brick) as Brick,
  };
};

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (id:number) => dispatch(actions.fetchBrick(id)),
  }
}

const connector = connect(mapState, mapDispatch);

export default connector(BrickRouting);
