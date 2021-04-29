import { ApiQuestion, BaseApiQuestion, justParseQuestion } from 'components/build/questionService/QuestionService';
import { post } from './index';

export const createQuestion = async (brickId: number, question: BaseApiQuestion) => {
  try {
    const resQuestion = await post<ApiQuestion>('/question/new/' + brickId, question);
    if (resQuestion) {
      return justParseQuestion(resQuestion);
    }
  } catch { console.log('can`t create question') }
  return null;
}