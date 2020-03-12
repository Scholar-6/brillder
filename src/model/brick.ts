export interface Brick {
  id: number
  subject: string
  topic: string
  subTopic: string
  title: string
  alternativeTopics: string
  alternativeSubject: string
  openQuestion: string
  brief: string
  prep: string
  synthesis: string
  brickLength: number
  type: number
  questions: any[]
}

export enum isAuthenticated {
  None,
  True,
  False
}
