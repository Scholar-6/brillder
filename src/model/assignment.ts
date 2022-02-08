import { Brick } from './brick';
import { User } from './user';

export enum isAuthenticated {
  None,
  True,
  False
}

export enum AssignmentBrickStatus {
  ToBeCompleted,
  SubmitedToTeacher,
  CheckedByTeacher
}

export interface AssignmentBrick {
  id: number;
  assignedDate: string;
  status: AssignmentBrickStatus;
  brick: Brick;
  deadline: string;
  bestScore?: number;
  completedDate?: string;
  expanded?: boolean;
  expandFinished?: boolean;
  isInvitation: boolean;
  classroom?: any;
  teacher?: User;
}

export interface LibraryAssignmentBrick extends AssignmentBrick {
  maxScore?: number;
  lastAttemptScore?: number;
  bestAttemptScore?: number;
  bestAttemptPercentScore?: number;
  numberOfAttempts: number;
}
