import {BuildQuestionCache} from './types';

export enum BuildPlayPage {
  None,
  Build,
  Play
}

export interface BuildPlayRedirect {
  brickId: number;
  questionNumber: number;
  currentPage: BuildPlayPage;
  isTwoOrMoreRedirect: boolean;
}

export function ClearQuestionCash() {
  const question = GetCashedBuildQuestion();
  if (question) {
    question.questionNumber = -1;
    localStorage.setItem(BuildQuestionCache, JSON.stringify(question));
  }
}

export function CasheBuildQuestion(questionObj: BuildPlayRedirect) {
  let question = GetCashedBuildQuestion();
  if (question) {
    question.questionNumber = questionObj.questionNumber;
  } else {
    question = questionObj;
  }
  question.currentPage = BuildPlayPage.Build;
  localStorage.setItem(BuildQuestionCache, JSON.stringify(question));
}

export function GetCashedBuildQuestion() {
  let question = null;
  try {
    let questionString = localStorage.getItem(BuildQuestionCache)
    if (questionString) {
      question = JSON.parse(questionString) as BuildPlayRedirect;
    }
  } catch {}
  return question;
}

export function CashQuestionFromPlay(brickId: number, questionNumber: number) {
  let question = GetCashedBuildQuestion();
  if (question && question.brickId === brickId) {
    question.isTwoOrMoreRedirect = true;
  } else {
    question = {} as BuildPlayRedirect;
    question.brickId = brickId;
    question.isTwoOrMoreRedirect = true;
  }
  question.questionNumber = questionNumber;
  question.currentPage = BuildPlayPage.Play;
  localStorage.setItem(BuildQuestionCache, JSON.stringify(question));
}
