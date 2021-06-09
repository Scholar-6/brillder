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

// implementation of Java's hashCode function from https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
const hashCode = (str: string) => {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export const generateId = () => {
  const dateNumber = Date.now().valueOf();
  const randomNumber = Math.floor(Math.random() * 65536);
  return Math.abs(hashCode(dateNumber.toString() + randomNumber.toString()));
}