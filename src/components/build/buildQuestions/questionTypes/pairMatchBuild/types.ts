import { MainImageProps } from '../../components/Image/model';
import {QuestionValueType} from '../types';


export interface Answer extends MainImageProps {
  checked: boolean;
  value: string;
  valueFile: string;
  valueSoundFile: string;
  valueSoundCaption: string;
  answerType?: QuestionValueType; 

  option: string;
  optionFile: string;
  optionSoundFile: string;
  optionSoundCaption: string;
  optionType?: QuestionValueType;
}
