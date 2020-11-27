import { MainImageProps } from '../../components/Image/model';
import {QuestionValueType} from '../types';


export interface Answer extends MainImageProps {
  checked: boolean;
  value: string;
  valueFile: string;
  answerType?: QuestionValueType; 
  option: string;
  optionFile: string;
  optionType?: QuestionValueType;
}
