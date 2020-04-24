export enum UserType {
  Student = 1,
  Teacher,
  Builder,
  Admin,
  Editor,
}

export interface User {
  id: number
  type: UserType,
  firstName: string
  lastName: string
  tutorialPassed: boolean
  email: string
  subjects: any[],
  status: number,
}