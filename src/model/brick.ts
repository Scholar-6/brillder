
import { Question } from "./question";
import { UserBase, UserType } from "./user";
import { Assignment } from "./classroom";

export enum BrickLengthEnum {
  None = 0,
  S20min = 20,
  S40min = 40,
  S60min = 60
}

export enum BrickStatus {
  Draft = 1,
  Build,
  Review,
  Publish
}

export interface Author {
  email: string;
  firstName: string;
  googleId: string;
  id: number;
  lastName: string;
  tutorialPassed: boolean;
  type: UserType;
}

export interface Editor extends UserBase {
  username: string;
}

export interface Subject {
  id: number;
  name: string;
  color: string;
}

export interface Brick {
  id: number;
  subject?: Subject;
  subjectId: number;
  topic: string;
  subTopic: string;
  title: string;
  alternativeTopics: string;
  alternativeSubject: string;
  created: string;
  updated: string;
  openQuestion: string;
  brief: string;
  prep: string;
  synthesis: string;
  brickLength: BrickLengthEnum;
  type: number;
  questions: Question[];
  author: Author;
  editors?: Editor[];
  publisher?: Editor;
  expanded?: boolean;
  expandFinished?: boolean;
  status: BrickStatus;
  attemptsCount: number;
  locked: boolean;
  isCore?: boolean;
  hasNotifications?: boolean;

  assignments?: Assignment[];
}

export enum isAuthenticated {
  None,
  True,
  False
}
