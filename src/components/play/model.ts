import { Brick } from "model/brick";

export interface ComponentAttempt<T> {
  answer: T;
  correct: boolean;
  marks: number;
  maxMarks: number;
  attempted: boolean;
  questionId: number;
  // only for pair match and shuffle attempts
  dragged?: boolean;
  liveCorrect?: boolean;
  reviewCorrect?: boolean;
}

export enum PlayMode {
  Normal = 1,
  Highlighting,
  UnHighlighting,
  Anotating
}

export interface BrickAttempt {
  id?: string;
  brickId?: number;
  studentId?: number;
  brick?: Brick;
  score: number;
  oldScore?: number;
  maxScore: number;
  student?: any;
  answers: ComponentAttempt<any>[];
  liveAnswers?: ComponentAttempt<any>[];

  assignmentId?: number;
}

export enum PlayStatus {
  Intro,
  Live,
  Review,
  Ending
}
