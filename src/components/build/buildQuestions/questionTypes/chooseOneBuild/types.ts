import { MainImageProps } from '../../components/Image/model';
import {QuestionValueType} from '../types';


export interface ChooseOneAnswer extends MainImageProps {
  index?: number;
  checked: boolean;
  value: string;
  valueFile: string;
  answerType?: QuestionValueType; 
  soundFile?: string;
  soundCaption?: string;
}
