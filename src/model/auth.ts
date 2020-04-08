export enum UserLoginType {
  None = 0,
  Student = 1,
  Teacher = 2,
  Builder = 3
}

export interface LoginModel {
  email: string
  password: string
  userType: UserLoginType
}