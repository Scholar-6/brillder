import update from "immutability-helper";
import * as Y from "yjs";

import { validateQuestion } from "./ValidateQuestionService";
import { CasheBuildQuestion, BuildPlayRedirect } from 'localStorage/buildLocalStorage';


import {
  HintStatus, QuestionComponentTypeEnum, Question, QuestionTypeEnum
} from "model/question";
import { Brick } from "model/brick";

import { getDefaultChooseOneAnswer } from "../buildQuestions/questionTypes/chooseOneBuild/chooseOneBuild";
import { getDefaultChooseSeveralAnswer } from "../buildQuestions/questionTypes/chooseSeveralBuild/chooseSeveralBuild";
import { getDefaultHorizontalShuffleAnswer } from "../buildQuestions/questionTypes/shuffle/horizontalShuffleBuild/horizontalShuffleBuild";
import { getDefaultShortAnswerAnswer } from "../buildQuestions/questionTypes/shortAnswerBuild/shortAnswerBuild";
import { getDefaultVerticalShuffleAnswer } from "../buildQuestions/questionTypes/shuffle/verticalShuffleBuild/verticalShuffleBuild";
import { getDefaultPairMatchAnswer } from "../buildQuestions/questionTypes/pairMatchBuild/pairMatchBuild";
import { getDefaultCategoriseAnswer } from "../buildQuestions/questionTypes/categoriseBuild/categoriseBuild";
import { getDefaultMissingWordAnswer } from "../buildQuestions/questionTypes/missingWordBuild/MissingWordBuild";
import { getDefaultLineHighlightingAnswer } from "../buildQuestions/questionTypes/highlighting/lineHighlightingBuild/LineHighlightingBuild";
import { getDefaultWordHighlightingAnswer } from "../buildQuestions/questionTypes/highlighting/wordHighlighting/wordHighlighting";


export interface ApiQuestion {
  id?: number;
  contentBlocks: string;
  type: number;
  order: number;
}

export function getNewFirstQuestion(type: number, active: boolean) {
  return {
    type,
    active,
    hint: {
      value: "",
      list: [] as string[],
      status: HintStatus.None
    },
    components: [{ type: QuestionComponentTypeEnum.Component }]
  } as Question;
};

export function getNewQuestion(type: number, active: boolean) {
  return {
    type,
    active,
    hint: {
      value: "",
      list: [] as string[],
      status: HintStatus.None
    },
    components: [{
      type: QuestionComponentTypeEnum.Component
    }]
  } as Question;
};

export function cashBuildQuestion(brickId: number, questionNumber: number) {
  CasheBuildQuestion({ brickId, questionNumber } as BuildPlayRedirect);
}

export function getUniqueComponent(question: Y.Doc) {
  const components = question.getMap().get("components");
  const uniqueComponentIndex = components.toJSON().findIndex((c: any) => c.type === QuestionComponentTypeEnum.Component);
  return components.get(uniqueComponentIndex) as Y.Map<any>;
}

export function getJSONUniqueComponent(question: Question) {
  return question.components.find(c => c.type === QuestionComponentTypeEnum.Component);
}

export function getActiveQuestion(questions: Question[]) {
  return questions.find(q => q.active === true) as Question;
}

export function getApiQuestion(question: Question) {
  const questionObject = {
    components: question.components,
    firstComponent: question.firstComponent ?
      question.firstComponent : { type: QuestionComponentTypeEnum.Text, value: '' },
    hint: question.hint
  };
  const apiQuestion = {
    type: question.type,
    contentBlocks: JSON.stringify(questionObject)
  } as ApiQuestion;
  if (question.id) {
    apiQuestion.id = question.id;
    apiQuestion.type = question.type;
  }
  apiQuestion.order = question.order;
  return apiQuestion;
}

export function removeQuestionByIndex(questions: Y.Array<Y.Doc>, index: number) {
  questions.get(index).destroy();
  questions.delete(index);
}

const defaultFunctions: { [key in QuestionTypeEnum]?: () => any } = {
  [QuestionTypeEnum.ChooseOne]: getDefaultChooseOneAnswer,
  [QuestionTypeEnum.ChooseSeveral]: getDefaultChooseSeveralAnswer,
  [QuestionTypeEnum.ShortAnswer]: getDefaultShortAnswerAnswer,
  [QuestionTypeEnum.HorizontalShuffle]: getDefaultHorizontalShuffleAnswer,
  [QuestionTypeEnum.VerticalShuffle]: getDefaultVerticalShuffleAnswer,
  [QuestionTypeEnum.PairMatch]: getDefaultPairMatchAnswer,
  [QuestionTypeEnum.Sort]: getDefaultCategoriseAnswer,
  [QuestionTypeEnum.MissingWord]: getDefaultMissingWordAnswer,
  [QuestionTypeEnum.LineHighlighting]: getDefaultLineHighlightingAnswer,
  [QuestionTypeEnum.WordHighlighting]: getDefaultWordHighlightingAnswer,
}

export function setQuestionTypeByIndex(questions: Y.Array<Y.Doc>, index: number, type: QuestionTypeEnum) {
  const question = questions.get(index).getMap();
  console.log(question);
  const components = question.get("components");
  const uniqueComponentIndex = components.toJSON().findIndex((c: any) => c.type === QuestionComponentTypeEnum.Component);
  console.log(uniqueComponentIndex);

  const uniqueComponent = components.get(uniqueComponentIndex) as Y.Map<any>;
  const newDefault = defaultFunctions[type]?.();
  Object.entries(newDefault).forEach(([key, value]) => {
    uniqueComponent.set(key, value);
  });

  return questions;
}

export function parseQuestion(question: ApiQuestion, parsedQuestions: Question[]) {
  const parsedQuestion = JSON.parse(question.contentBlocks);
  if (parsedQuestion.components) {
    let q = {
      id: question.id,
      type: question.type,
      hint: parsedQuestion.hint,
      order: question.order,
      firstComponent: parsedQuestion.firstComponent ?
        parsedQuestion.firstComponent : { type: QuestionComponentTypeEnum.Text, value: '' },
      components: parsedQuestion.components
    } as Question;
    const index = parsedQuestions.findIndex(question => question.id === q.id);
    if (index >= 0) {
      parsedQuestions[index] = q; // question was only updated
    } else {
      parsedQuestions.push(q); // question was loaded
    }
  }
}

export function setLastQuestionId(brick: Brick, questions: Question[]) {
  const lastIndex = questions.length - 1;
  questions[lastIndex].id = brick.questions[lastIndex].id;
  return questions;
}

export function getFirstInvalidQuestion(qs: Question[]) {
  return qs.findIndex((q, index) => !validateQuestion(q as any));
}
