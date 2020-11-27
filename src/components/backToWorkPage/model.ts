import { Brick } from "model/brick";


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
