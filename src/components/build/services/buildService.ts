import * as Y from "yjs";

import { GetCashedBuildQuestion } from 'localStorage/buildLocalStorage';
import { Question, QuestionTypeEnum } from "model/question";

export const getPreviewLink = (brickId: number, isSynthesisPage: boolean) => {
  let buildQuestion = GetCashedBuildQuestion();
  if (isSynthesisPage) {
    return `/play-preview/brick/${brickId}/intro`;
  } else if (
    buildQuestion && buildQuestion.questionNumber &&
    buildQuestion.brickId === brickId &&
    buildQuestion.isTwoOrMoreRedirect
  ) {
    return `/play-preview/brick/${brickId}/live`;
  } else {
    return `/play-preview/brick/${brickId}/intro`;
  }
}

export const getQuestionType = (question: Y.Doc) => {
  let type = QuestionTypeEnum.None;
  if (question && question.getMap().get("type")) {
    type = question.getMap().get("type");
  }
  return type;
}

export const getJSONQuestionIndex = (question: Question, questions: Y.Array<Y.Doc>) => {
  let qIndex = -1;
  questions.forEach((q, index) => {
    if (q.getMap().toJSON() === question) {
      qIndex = index;
    }
  });
  return qIndex;
}

export const getQuestionIndex = (question: Y.Doc, questions: Y.Array<Y.Doc>) => {
  let qIndex = -1;
  questions.forEach((q, index) => {
    if (q === question) {
      qIndex = index;
    }
  });
  return qIndex;
}

export default {
  getQuestionIndex,
  getJSONQuestionIndex
}