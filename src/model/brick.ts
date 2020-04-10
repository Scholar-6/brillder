
import { Question } from "components/model/question";
import { UserType } from "./user";

export enum BrickStatus {
  Draft = 1,
  Review,
  Build,
  Publish
}

export interface Author {
  email: string
  firstName: string
  googleId: string
  id: number
  lastName: string
  tutorialPassed: boolean
  type: UserType
}

export interface Subject {
  id: number;
  name: string;
  color: string;
}

export interface Brick {
  id: number
  subject?: Subject
  subjectId: number
  topic: string
  subTopic: string
  title: string
  alternativeTopics: string
  alternativeSubject: string
  created: string
  updated: string
  openQuestion: string
  brief: string
  prep: string
  synthesis: string
  brickLength: number
  type: number
  questions: Question[]
  author: Author
  expanded?: boolean
  expandFinished?: boolean
  status: BrickStatus
  attemptsCount: number
}

export enum isAuthenticated {
  None,
  True,
  False
}
