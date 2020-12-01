import { Brick } from "model/brick";
import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";


export enum ThreeColumnNames {
  Red = "red",
  Yellow = "yellow",
  Green = "green",
};

export interface AssignmentContent {
  rawAssignments: AssignmentBrick[];
  finalAssignments: AssignmentBrick[];
}

export interface ThreeAssignmentColumns {
  red: AssignmentContent;
  yellow: AssignmentContent;
  green: AssignmentContent;
}

export interface PlayFilters {
  viewAll: boolean;
  completed: boolean;
  submitted: boolean;
  checked: boolean;
}

export interface AssignmentBrickData {
  brick: Brick;
  key: number;
  index: number;
  row: number;
  assignmentId: number;
  status: AssignmentBrickStatus;
  isInvitation: boolean;
}
