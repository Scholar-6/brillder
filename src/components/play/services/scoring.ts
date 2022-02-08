import {Brick} from 'model/brick';
import { QuestionTypeEnum } from 'model/question';
import {BrickAttempt, ComponentAttempt} from '../model';

import ChooseOneMark from './scoring/ChooseOneScoring';
import ChooseSeveralMark from './scoring/ChooseSeveralScoring';
import ShortAnswerMark from './scoring/ShortAnswerScoring';
import ShuffleMark from './scoring/ShuffleScoring';
import PairMatchMark from './scoring/PairMatchScoring';
import SortMark from './scoring/SortScoring';
import MissingWordMark from './scoring/MissingWordScoring';
import LineHighlightingMark from './scoring/LineHighlightingScoring';
import WordHighlightingMark from './scoring/WordHighlightingScoring';


export type ScoreFunction<C extends QuestionComponent, A> = (component: C, attempt: ComponentAttempt<A>) => ComponentAttempt<A>;
export type QuestionComponent = { type: QuestionTypeEnum };

export type ScoreFunctionMap = { [key in QuestionTypeEnum]?: ScoreFunction<any, any> }
export const scoreFunctions: ScoreFunctionMap = {
  [QuestionTypeEnum.ChooseOne]: ChooseOneMark,
  [QuestionTypeEnum.ChooseSeveral]: ChooseSeveralMark,
  [QuestionTypeEnum.ShortAnswer]: ShortAnswerMark,
  [QuestionTypeEnum.HorizontalShuffle]: ShuffleMark,
  [QuestionTypeEnum.VerticalShuffle]: ShuffleMark,
  [QuestionTypeEnum.PairMatch]: PairMatchMark,
  [QuestionTypeEnum.Sort]: SortMark,
  [QuestionTypeEnum.MissingWord]: MissingWordMark,
  [QuestionTypeEnum.LineHighlighting]: LineHighlightingMark,
  [QuestionTypeEnum.WordHighlighting]: WordHighlightingMark,
}

export const mark = <C extends QuestionComponent, A>(questionType: QuestionTypeEnum, component: C, attempt: ComponentAttempt<A>) => {
  const scoreFunction = scoreFunctions[questionType];

  if(scoreFunction) {
    return scoreFunction(component, attempt);
  } else {
    return attempt;
  }
}

const getScore = (attempts: ComponentAttempt<any>[]) => {
  return attempts.reduce((acc, answer) => {
    return (answer && answer.marks >= 0) ? (acc + answer.marks) : acc;
  }, 0);
}

const getMaxScore = (attempts: ComponentAttempt<any>[]) => {
  return attempts.reduce((acc, answer) => {
    return (answer && answer.maxMarks) ? (acc + answer.maxMarks) : acc;
  }, 0);
}

export const calcBrickLiveAttempt = (brick: Brick, answers: ComponentAttempt<any>[]) => {
  const score = getScore(answers);
  const maxScore = getMaxScore(answers);
  return {
    brick, score, maxScore, student: null, answers, liveAnswers: JSON.parse(JSON.stringify(answers))
  } as BrickAttempt;
}

export const calcBrickReviewAttempt = (brick: Brick, answers: ComponentAttempt<any>[], brickAttempt: BrickAttempt) => {
  let score = getScore(answers);
  let maxScore = getMaxScore(answers);
  const reviewAnswers = answers.map((attempt, index) => ({
    ...attempt,
    liveCorrect: brickAttempt.liveAnswers![index] ? brickAttempt.liveAnswers![index].correct : false
  }));

  for (let i = 0; i < reviewAnswers.length; i++) {
    const reviewAnswer = reviewAnswers[i];
    const liveAnswer = brickAttempt.liveAnswers![i];
    if (liveAnswer && liveAnswer.correct && liveAnswer.liveCorrect) {
      //#3439 pair match fix
      if (reviewAnswer.marks === reviewAnswer.maxMarks) {
        reviewAnswer.reviewCorrect = true;
      }
    }
  }

  return {
    brick, score, oldScore: brickAttempt.score, maxScore, student: null, answers: reviewAnswers, liveAnswers: brickAttempt.liveAnswers
  } as BrickAttempt;
}
