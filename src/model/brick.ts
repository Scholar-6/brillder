
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
  profileImage: string;
  bio: string;
  type: UserType;
}

export interface Editor extends UserBase {
  username: string;
}

export enum SubjectGroup {
  None = 0,
  Arts,
  Languages,
  HumanitiesAndSocialSciences,
  GeneralTopical,
  Science,
  MathsAndComputing,
  SchoolClient,
  Corporate
}

export const SubjectGroupNames = [
  '', 'Arts', 'Languages', 'Humanities & Social Sciences', 'General & Topical',
  'Science', 'Maths and Computing', 'School Client', 'Corporate'
]

export interface Subject {
  id: number;
  name: string;
  color: string;
  publishedBricksCount: number;
  userCount: number;
  group: SubjectGroup;
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
  order?: number;
  name: string;
}

export enum AcademicLevel {
  Default = 0,
  First = 1,
  Second,
  Third
}

export const AcademicLevelLabels = [
  '', 'I', 'II', 'III', 'IV'
];

export interface Brick {
  id: number;
  subject?: Subject;
  subjectId: number;
  subTopic: string;
  topic: string,
  alternativeTopics: string,
  title: string;
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

  // cover page
  competitions?: any[];
  competitionId?: number;
  coverImage: string;
  coverImageCaption: string;
  coverImageSource: string;
  sponsorUrl: string;
  sponsorLogo: string;
  sponsorName: string;

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
