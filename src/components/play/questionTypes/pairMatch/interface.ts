import {CompQuestionProps} from '../types';
import { QuestionComponentTypeEnum } from 'model/question';

export interface PairMatchChoice {
  value: string;
  index: number;
  hint: string;
  option: string;
}

export type PairMatchAnswer = { index: number; }[]
  
export interface PairMatchComponent {
  type: QuestionComponentTypeEnum;
  list: PairMatchChoice[];
  choices: any[];
  options: any[];
}

export enum DragAndDropStatus {
  None,
  Init,
  Changed
}

export interface PairMatchProps extends CompQuestionProps {
  component: PairMatchComponent;
  answers: number;
}
  
export interface PairMatchState {
  status: DragAndDropStatus;
  userAnswers: any[];
  canDrag: boolean;
}
