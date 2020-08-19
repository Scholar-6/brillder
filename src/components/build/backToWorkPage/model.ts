import { Brick } from "model/brick";


export enum ThreeColumnNames {
  Draft = "draft",
  Review = "review",
  Publish = "publish",
};

export interface BricksContent {
  rawBricks: Brick[];
  finalBricks: Brick[];
}

export interface ThreeColumns {
  draft: BricksContent;
  review: BricksContent;
  publish: BricksContent;
}

export enum SortBy {
  None,
  Date,
  Popularity,
  Status,
}

export interface Filters {
  viewAll: boolean;
  buildAll: boolean;
  editAll: boolean;

  draft: boolean;
  review: boolean;
  publish: boolean;

  isCore: boolean;
}

export interface PlayFilters {
  completed: boolean;
  submitted: boolean;
  checked: boolean;
}

export interface TeachFilters {
  assigned: boolean;
  submitted: boolean;
  completed: boolean;
}
