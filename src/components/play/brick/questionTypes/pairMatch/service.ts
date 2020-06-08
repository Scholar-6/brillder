import {ComponentAttempt} from 'components/play/brick/model/model';
import {PairMatchChoice} from './interface';


export function mark(list: PairMatchChoice[], attempt: ComponentAttempt, prev: ComponentAttempt): ComponentAttempt {
  let markIncrement = prev ? 2 : 5;
  attempt.correct = true;
  attempt.marks = 0;
  attempt.maxMarks = 0;
  attempt.answer.forEach((answer: any, index: number, array: any[]) => {
    attempt.maxMarks += 5;
    if(answer.index === list[index].index) {
      if(!prev) {
        attempt.marks += markIncrement;
      } else if (prev.answer[index].index !== list[index].index) {
        attempt.marks += markIncrement;
      }
    } else {
      attempt.correct = false;
    }
  });
  if(attempt.marks === 0 && !prev) attempt.marks = 1;
  return attempt;
}
