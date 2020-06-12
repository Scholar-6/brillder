import { Question, QuestionTypeEnum } from 'model/question';
import { ComponentAttempt } from 'components/play/brick/model/model';
import {getUniqueComponent} from 'components/build/investigationBuildPage/questionService/QuestionService';


export function prefillAttempts(questions: Question[]) {
  let initAttempts:ComponentAttempt[] = [];
  questions.forEach(question => {
    let initAttempt = { correct: false, marks: 0, maxMarks: 5 } as ComponentAttempt;
    if (question.type === QuestionTypeEnum.ChooseOne) {
      initAttempt.answer = -1;
    } else if (question.type === QuestionTypeEnum.ChooseSeveral) {
      initAttempt.answer = [];
    } else if (
      question.type === QuestionTypeEnum.HorizontalShuffle ||
      question.type === QuestionTypeEnum.VerticalShuffle
    ) {
      let uniq = getUniqueComponent(question);
      initAttempt.answer = Object.assign([], uniq.list);
    } else if (question.type === QuestionTypeEnum.PairMatch) {
      let uniq = getUniqueComponent(question);
      initAttempt.answer = Object.assign([], uniq.choices);
    }
    initAttempts.push(initAttempt);
  });
  return initAttempts;
}
