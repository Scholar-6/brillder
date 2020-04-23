export enum UserType {
  Student = 1,
  Builder = 2,
  Editor = 3,
  Admin = 4,
  Teacher = 5
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