import {
  HintStatus, Question, QuestionTypeEnum
} from "model/question";
import {getUniqueComponent} from './QuestionService';


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

export function convertToShortAnswer(question: Question) {
  const updatedQuestion = Object.assign({}, question);
  updatedQuestion.type = QuestionTypeEnum.ShortAnswer;
  const component = getUniqueComponent(updatedQuestion);
  if (component.list && component.list.length > 0) {
    component.list = [component.list[0]];
    if (component.list[0].value) {
      component.list[0].value = stripHtml(component.list[0].value);
    }
  }
  return updatedQuestion;
}

function stripHtmlList(list: any[]) {
  if (list && list.length > 0) {
    for (let item of list) {
      if (item.value) {
        item.value = stripHtml(item.value);
      }
    }
  }
}

export function convertToVerticalShuffle(question: Question) {
  const updatedQuestion = Object.assign({}, question);
  updatedQuestion.type = QuestionTypeEnum.VerticalShuffle;
  const component = getUniqueComponent(updatedQuestion);
  stripHtmlList(component.list);
  return updatedQuestion;
}

export function convertToHorizontalShuffle(question: Question) {
  const updatedQuestion = Object.assign({}, question);
  updatedQuestion.type = QuestionTypeEnum.HorizontalShuffle;
  const component = getUniqueComponent(updatedQuestion);
  stripHtmlList(component.list);
  return updatedQuestion;
}

function stripHtml(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
