import { Brick } from "./brick";
import { User } from "./user";

export interface AttemptAnswer {
  answer: string;
  correct: boolean;
  marks: number;
  maxMarks: number;
}

export interface PlayAttempt {
  answers: AttemptAnswer[];
  liveAnswers: AttemptAnswer[];
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
