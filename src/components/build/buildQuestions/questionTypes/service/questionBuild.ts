import { stripHtml } from "components/build/questionService/ConvertService";

export function showSameAnswerPopup(i: number, list: any, openSameAnswerDialog: Function) {
  let answerText = stripHtml(list[i].value);
  for (let [index, item] of list.entries()) {
    if (index !== i && item.value) {
      let text = stripHtml(item.value)
      if (answerText === text) {
        openSameAnswerDialog();
      }
    }
  }
}

export const generateId = () => Math.floor(Math.random() * 8192);