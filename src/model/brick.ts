import { Question } from "components/model/question";

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
}

export enum isAuthenticated {
  None,
  True,
  False
}
