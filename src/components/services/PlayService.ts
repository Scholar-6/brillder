import { Question, QuestionTypeEnum } from 'model/question';
import { ComponentAttempt } from 'components/play/model';
import {getUniqueComponent} from 'components/build/questionService/QuestionService';
import { mark } from 'components/play/services/scoring';

/* Used by Play brick routing to initialise the answer value for each 
   answer type */

export function prefillAttempts(questions: Question[]) {
  
  let initAttempts:ComponentAttempt<any>[] = [];
  
  questions.forEach(question => {
    let initAttempt = { correct: false, questionId: question.id, marks: 0, maxMarks: 5 } as ComponentAttempt<any>;
    const uniq = getUniqueComponent(question);
    
    if (question.type === QuestionTypeEnum.ChooseOne) {
      initAttempt.answer = { shuffleIndex: -1, realIndex: -1 };
    }
    else if 
      (question.type === QuestionTypeEnum.ChooseSeveral ||
      question.type === QuestionTypeEnum.WordHighlighting ||
      question.type === QuestionTypeEnum.LineHighlighting) 
    { initAttempt.answer = []; } 
    
    else if 
      (question.type === QuestionTypeEnum.HorizontalShuffle ||
      question.type === QuestionTypeEnum.VerticalShuffle ) 
    { 
      initAttempt.answer = Object.assign([], uniq.list); 
    } 
    
    else if (question.type === QuestionTypeEnum.PairMatch) 
    { 
      initAttempt.answer = Object.assign([], uniq.choices);
    } 
    
    else if (question.type === QuestionTypeEnum.Sort) 
    {
      const {categories} = getUniqueComponent(question);
      let choices:any = {};
      let unsortedIndex = categories.length;
      for (const category of categories) {
        for (const choice of category.answers) {
          choices[choice.value] = unsortedIndex;
        }
      }
      initAttempt.answer = choices;
    }

    try {
      initAttempt.maxMarks = mark(question.type, uniq, {...initAttempt}).maxMarks;
    } catch {
      console.log('can`t get max score questionId: ', question.id);
    }

    initAttempts.push(initAttempt);
  });
  return initAttempts;
}
