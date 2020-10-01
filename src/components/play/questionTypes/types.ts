import { Question } from "model/question";
import {ComponentAttempt} from '../model';

export interface CompQuestionProps {
  question: Question;
  component: any;
  attempt?: ComponentAttempt<any>;
  isPreview?: boolean;
  answers: any;
  isBookPreview?: boolean;
  isReview?: boolean;
  onAttempted(): void;
}
