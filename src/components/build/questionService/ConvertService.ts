/* Combinatorics dictates there should be 90 different ways to move from one answer type to another */

import * as Y from "yjs";
import {
  HintStatus, QuestionTypeEnum
} from "model/question";
import {getUniqueComponent} from './QuestionService';
import { convertString } from "services/SharedTypeService";
import { getDefaultCategoriseAnswer } from "../buildQuestions/questionTypes/categoriseBuild/categoriseBuild";
import { getDefaultMissingWordAnswer } from "../buildQuestions/questionTypes/missingWordBuild/MissingWordBuild";
import { getDefaultWordHighlightingAnswer } from "../buildQuestions/questionTypes/highlighting/wordHighlighting/wordHighlighting";
import { getDefaultLineHighlightingAnswer } from "../buildQuestions/questionTypes/highlighting/lineHighlightingBuild/LineHighlightingBuild";
import { HighlightMode } from "../buildQuestions/questionTypes/highlighting/model";


export function stripHtml(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;

  div.querySelectorAll("img").forEach((img) => {
    img.replaceWith(img.getAttribute("alt") ?? "image");
  });

  return div.textContent || div.innerText || "";
}

export function stripYHtml(html: Y.Text) {
  return convertString(stripHtml(html.toString()));
}

const stripRegex = /<(?!\/?(?:sup|sub))[^>]*>/g
export function stripHtmlExceptSubAndSup(html: any) {
  const replaced = html.replaceAll(stripRegex, "");
  return replaced;
}

function stripHtmlList(list: Y.Array<Y.Map<any>>) {
  if (list && list.length > 0) {
    list.forEach(item => {
      const value = item.get("value");
      if (value) {
        item.set("value", stripYHtml(value));
      }
    });
  }
}

function setQuestionType(question: Y.Doc, type: QuestionTypeEnum) {
  question.getMap().set("type", type);
  return question;
}

function stripHtmlQuestionList(question: Y.Doc) {
  const component = getUniqueComponent(question);
  stripHtmlList(component.get("list") as Y.Array<any>);
  return question;
}

export function getQuestionIndex(questions: Y.Array<Y.Doc>, question: Y.Doc) {
  return questions.toJSON().indexOf(question.toJSON());
};

export function convertToSort(question: Y.Doc) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.Sort);
  const component = getUniqueComponent(question);
  getDefaultCategoriseAnswer(component);
  updatedQuestion.getMap().get("hint").set("status", HintStatus.All);
  updatedQuestion.getMap().get("hint").set("list", new Y.Array());
  return updatedQuestion;
}

export function convertToShortAnswer(question: Y.Doc) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.ShortAnswer);
  const component = getUniqueComponent(updatedQuestion);
  const list = component.get("list") as Y.Array<any>;
  if (list && list.length > 0) {
    list.delete(1, list.length - 1);
    const firstValue = list.get(0).get("value");
    if (firstValue) {
      list.get(0).set("value", stripYHtml(firstValue));
    }
  }
  return updatedQuestion;
}

export function convertToVerticalShuffle(question: Y.Doc) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.VerticalShuffle);
  return stripHtmlQuestionList(updatedQuestion);
}

export function convertToChooseOne(question: Y.Doc) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.ChooseOne);
  const component = getUniqueComponent(updatedQuestion);
  for (const answer of component.get("list")) {
    answer.set("checked", false);
  }
  return updatedQuestion;
};

export function convertToChooseSeveral(question: Y.Doc) {
  return setQuestionType(question, QuestionTypeEnum.ChooseSeveral);
}

export function convertToHorizontalShuffle(question: Y.Doc) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.HorizontalShuffle);
  return stripHtmlQuestionList(updatedQuestion);
}

export function convertToPairMatch(question: Y.Doc) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.PairMatch);
  return stripHtmlQuestionList(updatedQuestion);
}

export function convertToMissingWord(question: Y.Doc) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.MissingWord);
  const component = getUniqueComponent(updatedQuestion);
  getDefaultMissingWordAnswer(component);
  return updatedQuestion;
}

export function convertToWordHighlighting(question: Y.Doc) {
  const text = getUniqueComponent(question).get("text");
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.WordHighlighting);
  const component = getUniqueComponent(updatedQuestion);
  if(text) {
    component.delete("lines");
    component.set("words", new Y.Array());
    component.set("mode", HighlightMode.Input)
  } else {
    getDefaultWordHighlightingAnswer(component);
  }
  return updatedQuestion;
}

export function convertToLineHighlighting(question: Y.Doc) {
  const text = getUniqueComponent(question).get("text");
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.LineHighlighting);
  const component = getUniqueComponent(updatedQuestion);
  if(text) {
    component.delete("words");
    component.set("lines", new Y.Array());
    component.set("mode", HighlightMode.Input)
  } else {
    getDefaultLineHighlightingAnswer(component);
  }
  return updatedQuestion;
}


export function convertToQuestionType(
  questions: Y.Array<Y.Doc>, question: Y.Doc, type: QuestionTypeEnum,
  setQuestionCallback?: Function
) {
  const index = getQuestionIndex(questions, question);
  let updatedQuestion;
  switch (type) {
    case QuestionTypeEnum.ChooseOne:
      updatedQuestion = convertToChooseOne(question);
      break;
    case QuestionTypeEnum.ChooseSeveral:
      updatedQuestion = convertToChooseSeveral(question);
      break;
    case QuestionTypeEnum.Sort:
      updatedQuestion = convertToSort(question);
      break;
    case QuestionTypeEnum.ShortAnswer:
      updatedQuestion = convertToShortAnswer(question);
      break;
    case QuestionTypeEnum.VerticalShuffle:
      updatedQuestion = convertToVerticalShuffle(question);
      break;
    case QuestionTypeEnum.HorizontalShuffle:
      updatedQuestion = convertToHorizontalShuffle(question);
      break;
    case QuestionTypeEnum.PairMatch:
      updatedQuestion = convertToPairMatch(question);
      break;
    case QuestionTypeEnum.MissingWord:
      updatedQuestion = convertToMissingWord(question);
      break;
    case QuestionTypeEnum.WordHighlighting:
      updatedQuestion = convertToWordHighlighting(question);
      break;
    case QuestionTypeEnum.LineHighlighting:
      updatedQuestion = convertToLineHighlighting(question);
      break;
    default:
      updatedQuestion = setQuestionType(question, type);
      break;
  }
  setQuestionCallback?.(index, updatedQuestion);
}
