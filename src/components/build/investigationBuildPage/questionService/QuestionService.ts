import update from "immutability-helper";

import {
  HintStatus, QuestionComponentTypeEnum, Question, QuestionTypeEnum
} from "model/question";
import { Brick } from "model/brick";


interface ApiQuestion {
  id?: number;
  contentBlocks: string;
  type: number;
}

export function getNewQuestion(type: number, active: boolean) {
  return {
    type,
    active,
    hint: {
      value: "",
      list: [] as string[],
      status: HintStatus.None
    },
    components: [
      { type: 0 },
      { type: QuestionComponentTypeEnum.Component },
      { type: 0 }
    ]
  } as Question;
};

export function deactiveQuestions(questions: Question[]) {
  const updatedQuestions = questions.slice();
  updatedQuestions.forEach(q => (q.active = false));
  return updatedQuestions;
}

export function activeQuestionByIndex(questions: Question[], index: number) {
  let updatedQuestions = questions;
  if (updatedQuestions[index]) {
    updatedQuestions = deactiveQuestions(questions)
    updatedQuestions[index].active = true;
  }
  return updatedQuestions;
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
  return apiQuestion;
}

export function prepareBrickToSave(brick: Brick, questions: Question[], synthesis: string) {
  brick.questions = [];
  brick.synthesis = synthesis;
  for (let question of questions) {
    const apiQuestion = getApiQuestion(question) as Question;
    brick.questions.push(apiQuestion);
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

export function convertToSort(question: Question) {
  const updatedQuestion = Object.assign({}, question);
  updatedQuestion.type = QuestionTypeEnum.Sort;
  updatedQuestion.hint = {
    status: HintStatus.All,
    value: question.hint.value,
    list: []
  };
  return updatedQuestion;
}

export function setQuestionTypeByIndex(questions: Question[], index: number, type: QuestionTypeEnum) {
  return update(questions, { [index]: { type: { $set: type } } });
}

export function parseQuestion(question: ApiQuestion, parsedQuestions: Question[]) {
  const parsedQuestion = JSON.parse(question.contentBlocks);
  if (parsedQuestion.components) {
    let q = {
      id: question.id,
      type: question.type,
      hint: parsedQuestion.hint,
      components: parsedQuestion.components
    } as Question;
    parsedQuestions.push(q);
  }
}