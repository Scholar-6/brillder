import {ComponentAttempt} from 'components/play/model';
import {PairMatchChoice, DragAndDropStatus} from './interface';


export function mark(
  list: PairMatchChoice[],
  attempt: ComponentAttempt<any>,
  prev: ComponentAttempt<any>,
  status: DragAndDropStatus,
  isReview: boolean = false
) {
  let markIncrement = isReview ? 2 : 5;
  attempt.correct = true;
  attempt.marks = 0;
  attempt.maxMarks = 0;
  attempt.answer.forEach((answer: any, index: number, array: any[]) => {
    attempt.maxMarks += 5;
    if(answer.index === list[index].index) {
      if(!isReview) {
        attempt.marks += markIncrement;
      } else if (prev.answer[index].index !== list[index].index) {
        attempt.marks += markIncrement;
      }
    } else {
      attempt.correct = false;
    }
  });
  if(attempt.marks === 0 && !isReview) attempt.marks = 1;

  if (status === DragAndDropStatus.Changed) {
    attempt.dragged = true;
  }

  return attempt;
}
