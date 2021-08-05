import { Brick } from "./brick";
import { User } from "./user";

export interface AttemptAnswer {
  answer: string;
  correct: boolean;
  marks: number;
  maxMarks: number;
}

export enum AnnotationLocation {
  Brief, Prep, Question, Synthesis
}

export interface Annotation {
  location: AnnotationLocation;
  questionIndex?: number;

  id: number;
  user: User;
  priority: number;
  text: string;
  timestamp: Date;

  children?: Annotation[];
}

export interface PlayAttempt {
  id: string;
  answers: AttemptAnswer[];
  liveAnswers: AttemptAnswer[];
  annotations?: Annotation[];
  assignment: any;
  assignmentId: number;
  brick: Brick;
  brickId: number;
  maxScore: number;
  oldScore: number;
  score: number;
  status: number;
  student: User;
  studentId: number;
  timestamp: string;
}
