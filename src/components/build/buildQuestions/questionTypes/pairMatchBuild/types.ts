import { MainImageProps } from '../../components/Image/model';
import {QuestionValueType} from '../types';


export interface Answer extends MainImageProps {
  checked: boolean;
  value: string;
  valueFile: string;
  valueSoundFile: string;
  valueSoundCaption: string;
  answerType?: QuestionValueType; 

  // only for pairMatch
  option: string;
  optionFile: string;
  imageOptionSource?: string; 
  imageOptionCaption?: string; 

  optionSoundFile: string;
  optionSoundCaption: string;
  optionType?: QuestionValueType;
}
