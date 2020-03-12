import { Question } from "components/model/question";

export enum UserType {
  Student = 1,
  Creator = 2,
  Editor = 3,
  Admin = 4,
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

export interface Brick {
  id: number
  subject: string
  topic: string
  subTopic: string
  title: string
  alternativeTopics: string
  brief: string
  prep: string
  openQuestion: string
  alternativeSubject: string
  brickLength: number
  type: number
  questions: Question[]
  author: Author
}

export enum isAuthenticated {
  None,
  True,
  False
}
