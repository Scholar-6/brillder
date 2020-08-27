import { Brick } from './brick';

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
}
