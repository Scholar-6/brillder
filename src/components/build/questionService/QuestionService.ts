import update from "immutability-helper";

import { validateQuestion } from "./ValidateQuestionService";
import { CasheBuildQuestion, ClearQuestionCash, BuildPlayRedirect } from 'localStorage/buildLocalStorage';


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

export interface BaseApiQuestion {
  contentBlocks: string;
  type: number;
}

export interface ApiQuestion extends BaseApiQuestion {
  id?: number;
  brickQuestionId?: number;
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

export function deactiveQuestions(questions: Question[]) {
  const updatedQuestions = questions.slice();
  updatedQuestions.forEach(q => q.active = false);
  return updatedQuestions;
}

export function clearCashQuestion() {
  ClearQuestionCash();
}

export function cashBuildQuestion(brickId: number, questionNumber: number) {
  CasheBuildQuestion({ brickId, questionNumber } as BuildPlayRedirect);
}

export function getUniqueComponent(question: Question) {
  return question.components.find(
    c => c.type === QuestionComponentTypeEnum.Component
  );
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
    apiQuestion.brickQuestionId = question.brickQuestionId;
    apiQuestion.type = question.type;
  }
  apiQuestion.order = question.order;
  return apiQuestion;
}

export function prepareBrickToSave(brick: Brick, questions: Question[], synthesis: string) {
  brick.questions = [];
  brick.synthesis = synthesis;
  for (let question of questions) {
    if(question) {
      const apiQuestion = getApiQuestion(question) as Question;
      brick.questions.push(apiQuestion);
    }
  }
}

export function removeQuestionByIndex(questions: Question[], index: number) {
  let updatedQuestions = [];
  if (index !== 0) {
    updatedQuestions = update(questions, {
      $splice: [[index, 1]],
      0: { active: { $set: true } }
    });
  } else {
    updatedQuestions = update(questions, {
      $splice: [[index, 1]],
      [questions.length - 1]: { active: { $set: true } }
    });
  }
  return updatedQuestions;
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

export function setQuestionTypeByIndex(questions: Question[], index: number, type: QuestionTypeEnum) {
  const uniqueComponentIndex = questions[index].components.findIndex(c => c.type === QuestionComponentTypeEnum.Component);
  return update(questions, {
    [index]: {
      type: { $set: type },
      components: {
        [uniqueComponentIndex]: {
          $merge: {
            ...defaultFunctions[type]?.()
          }
        }
      },
    }
  });
}

export function parseQuestion(question: ApiQuestion, parsedQuestions: Question[]) {
  const parsedQuestion = JSON.parse(question.contentBlocks);
  if (parsedQuestion.components) {
    let q = {
      id: question.id,
      brickQuestionId: question.brickQuestionId,
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

export function justParseQuestion(question: ApiQuestion) {
  const parsedQuestion = JSON.parse(question.contentBlocks);
  let q = null;
  if (parsedQuestion.components) {
    q = {
      id: question.id,
      brickQuestionId: question.brickQuestionId,
      type: question.type,
      hint: parsedQuestion.hint,
      order: question.order,
      firstComponent: parsedQuestion.firstComponent ?
        parsedQuestion.firstComponent : { type: QuestionComponentTypeEnum.Text, value: '' },
      components: parsedQuestion.components
    } as Question;
  }
  return q;
}

export function setLastQuestionId(brick: Brick, questions: Question[]) {
  const savedQuestions = brick.questions;
  const updatedQuestions = deactiveQuestions(questions);
  const lastIndex = updatedQuestions.length - 1;
  updatedQuestions[lastIndex].active = true;
  updatedQuestions[lastIndex].id = savedQuestions[lastIndex].id;
  return updatedQuestions;
}

export function getFirstInvalidQuestionIndex(qs: Question[]) {
  for (const [i, q] of Array.from(qs.entries())) {
    let isQuestionValid = validateQuestion(q as any);
    if (!isQuestionValid) {
      return i;
    }
  }
}
