import {QuestionValueType} from '../types';


export interface ChooseOneAnswer {
  index?: number;
  checked: boolean;
  value: string;
  valueFile: string;
  answerType?: QuestionValueType; 
}
