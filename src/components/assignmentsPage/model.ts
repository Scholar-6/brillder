import { Brick } from "model/brick";
import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";


export enum ThreeColumnNames {
  Red = "red",
  Yellow = "yellow",
  Green = "green",
};

export interface BricksContent {
  rawBricks: Brick[];
  finalBricks: Brick[];
}

export interface ThreeColumns {
  red: BricksContent;
  yellow: BricksContent;
  green: BricksContent;
}

export interface AssignmentContent {
  rawAssignments: AssignmentBrick[];
  finalAssignments: AssignmentBrick[];
}

export interface ThreeAssignmentColumns {
  red: AssignmentContent;
  yellow: AssignmentContent;
  green: AssignmentContent;
}

export enum SortBy {
  None,
  Date,
  Popularity,
  Status,
}

export interface Filters {
  draft: boolean;
  build: boolean;
  review: boolean;
  publish: boolean;

  isCore: boolean;
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
