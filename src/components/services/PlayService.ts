import { Question, QuestionTypeEnum } from 'model/question';
import { ComponentAttempt } from 'components/play/model';
import {getJSONUniqueComponent as getUniqueComponent} from 'components/build/questionService/QuestionService';

/* Used by Play brick routing to initialise the answer value for each 
   answer type */

export function prefillAttempts(questions: Question[]) {
  
  let initAttempts:ComponentAttempt<any>[] = [];
  
  questions.forEach(question => {
    let initAttempt = { correct: false, marks: 0, maxMarks: 5 } as ComponentAttempt<any>;
    
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
      const uniq = getUniqueComponent(question);
      initAttempt.answer = Object.assign([], uniq.list); 
    } 
    
    else if (question.type === QuestionTypeEnum.PairMatch) 
    { 
      const uniq = getUniqueComponent(question);
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
    
    initAttempts.push(initAttempt);
  });
  return initAttempts;
}
