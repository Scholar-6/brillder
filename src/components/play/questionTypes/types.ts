import { Question } from "model/question";
import {ComponentAttempt} from '../model';

export interface CompQuestionProps {
  question: Question;
  component: any;
  attempt?: ComponentAttempt<any>;
  answers: any;
  isReview?: boolean;
  onAttempted(): void;

  isPreview?: boolean;

  // book result
  isBookPreview?: boolean;
  isDefaultBook?: boolean;
}
