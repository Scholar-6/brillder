import * as Y from "yjs";

import { GetCashedBuildQuestion } from 'localStorage/buildLocalStorage';
import { Question, QuestionTypeEnum } from "model/question";
import routes from "components/playPreview/routes";

export const getPreviewLink = (brickId: number, isSynthesisPage: boolean) => {
  const buildQuestion = GetCashedBuildQuestion();
  if (isSynthesisPage) {
    return routes.previewNewPrep(brickId);
  } else if (
    buildQuestion && buildQuestion.questionNumber &&
    buildQuestion.brickId === brickId &&
    buildQuestion.isTwoOrMoreRedirect
  ) {
    return `/play-preview/brick/${brickId}/live`;
  } else {
    return routes.previewNewPrep(brickId);
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
  try {
    questions.forEach((q, index) => {
      let qJson = q.getMap().toJSON();
      if (qJson === question || qJson.id === question.id) {
        qIndex = index;
      }
    });
  } catch {}
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