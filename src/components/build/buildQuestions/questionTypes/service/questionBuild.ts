import { stripHtml } from "components/build/questionService/ConvertService";

export function showSameAnswerPopup(i: number, list: any, openSameAnswerDialog: Function) {
  console.log(list);
  let answerText = stripHtml(list[i].value);
  let optionText = stripHtml(list[i].option);
  for (let [index, item] of list.entries()) {
    if (index !== i && item.value) {
      let text = stripHtml(item.value)
      if (answerText === text) {
        openSameAnswerDialog();
      }
    }
    if (index !== i && item.option) {
      let text = stripHtml(item.option);
      if(optionText === text) {
        openSameAnswerDialog();
      }
    }
  }
}

export const generateId = () => Math.floor(Math.random() * 8192);