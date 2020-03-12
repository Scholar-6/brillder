import React from 'react';
import { Route, Switch } from 'react-router-dom';
// @ts-ignore
import { connect } from "react-redux";

import './brick.scss';
import actions from 'redux/actions/brickActions';
import Introduction from './introduction/Introduction';
import Live from './live/Live';
import ProvisionalScore from './provisionalScore/ProvisionalScore';
import Synthesis from './synthesis/Synthesis';
import Review from './review/ReviewPage';

import { Brick } from 'model/brick';
import { ComponentAttempt, PlayStatus } from './model/model';
import { Question, QuestionTypeEnum, QuestionComponentTypeEnum } from 'components/model/question';


export interface BrickAttempt {
  brick: Brick;
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
  fetchBrick(brickId: number):void;
}

const BrickRouting: React.FC<BrickRoutingProps> = (props) => {
  if (!props.brick) {
    let brickId = props.match.params.brickId;
    props.fetchBrick(brickId);
    return <div>...Loading brick...</div>
  }

  const parsedQuestions: Question[] = [];

  /* Parsing each Question object from json <contentBlocks> */
  for (const question of props.brick.questions) {
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

  props.brick.questions = parsedQuestions;

  let initAttempts:any[] = [];
  props.brick.questions.forEach(question => {
    initAttempts.push({});
    if (question.type === QuestionTypeEnum.ChooseOne || question.type === QuestionTypeEnum.ChooseSeveral) {
      question.components.forEach(c => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          c.list = shuffle(c.list);
        }
      });
    }
  });

  const [status, setStatus] = React.useState(PlayStatus.Live);
  const [attempts, setAttempts] = React.useState(initAttempts);
  const [shuffleQuestions] = React.useState(props.brick.questions);

  const updateAttempts = (attempt:any, index:number) => {
    attempts[index] = attempt;
    setAttempts(attempts);
    console.log('attempts', attempts);
  }

  const finishBrick = () => {
    let score = attempts.reduce((acc, answer) => acc + answer.marks, 0);
    let maxScore = attempts.reduce((acc, answer) => acc + answer.maxMarks, 0);
    var ba : BrickAttempt = {
      brick: props.brick,
      score: score,
      maxScore: maxScore,
      student: null,
      answers: attempts
    };
    setStatus(PlayStatus.Review);
  }
  
  return (
    <Switch>
      <Route exac path="/play/brick/:brickId/intro">
        <Introduction brick={props.brick} />
      </Route>
      <Route exac path="/play/brick/:brickId/live">
        <Live questions={shuffleQuestions} brickId={props.brick.id} updateAttempts={updateAttempts} finishBrick={finishBrick} />
      </Route>
      <Route exac path="/play/brick/:brickId/provisionalScore">
        <ProvisionalScore status={status} brick={props.brick} attempts={attempts} />
      </Route>
      <Route exac path="/play/brick/:brickId/synthesis">
        <Synthesis status={status} brick={props.brick} />
      </Route>
      <Route exac path="/play/brick/:brickId/review">
        <Review status={status} questions={shuffleQuestions} brickId={props.brick.id} updateAttempts={updateAttempts} attempts={attempts} finishBrick={finishBrick} />
      </Route>
    </Switch>
  );
}


const mapState = (state: any) => {
  return {
    brick: state.brick.brick as Brick,
  };
};

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (id:number) => dispatch(actions.fetchBrick(id)),
  }
}

const connector = connect(mapState, mapDispatch);

export default connector(BrickRouting);