import {Brick} from 'model/brick';
import {BrickAttempt, ComponentAttempt} from '../model';

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
  return { brick, score, maxScore, student: null, answers } as BrickAttempt;
}

export const calcBrickReviewAttempt = (brick: Brick, answers: ComponentAttempt<any>[], brickAttempt: BrickAttempt) => {
  let score = getScore(answers);
  let maxScore = getMaxScore(answers);
  score += brickAttempt.score;
  return { brick, score, oldScore: brickAttempt.score, maxScore, student: null, answers } as BrickAttempt;
}
