import {QuestionValueType} from '../types';


export interface ChooseOneAnswer {
  checked: boolean;
  value: string;
  valueFile: string;
  answerType?: QuestionValueType; 
}
