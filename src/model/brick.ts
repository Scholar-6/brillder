
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
  Publish,
  Deleted
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
  publishedBricksCount: number;
  userCount: number;
  checked?: boolean;

  // view all page
  publicCount?: number;
  personalCount?: number;
}

export interface SubjectItem extends Subject {
  publicCount: number;
}

export interface SubjectAItem extends Subject {
  playedCount: number;
  assignedCount: number;
}

export interface KeyWord {
  id?: number;
  name: string;
}

export enum AcademicLevel {
  Default = 0,
  Fisrt = 1,
  Second,
  Third,
  Fourth
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
  keywords: KeyWord[];
  isCore?: boolean;
  hasNotifications?: boolean;
  academicLevel: AcademicLevel;

  assignments?: Assignment[];

  // for back to work page
  isEmptyColumn?: boolean;
  columnStatus?: BrickStatus;
  isDescription?: boolean;
  isCreateLink?: boolean;
  adaptedFrom?: any;
}

export enum isAuthenticated {
  None,
  True,
  False
}
