import {QuestionValueType} from '../types';


export interface Answer {
  checked: boolean;
  value: string;
  valueFile: string;
  answerType?: QuestionValueType; 
  option: string;
  optionFile: string;
  optionType?: QuestionValueType;
}
