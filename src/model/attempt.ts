import { Brick } from "./brick";
import { User } from "./user";

export interface PlayAttempt {
  answers: any[];
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
