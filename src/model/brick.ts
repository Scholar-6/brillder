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
  questions: any[]
}

export enum isAuthenticated {
  None,
  True,
  False
}
