export enum UserType {
  Student = 1,
  Teacher,
  Builder,
  Admin,
  Editor,
}

export enum UserStatus {
  Pending,
  Active,
  Disabled
}

export interface UserRole {
  roleId: number;
  name?: string;
}

export interface UserBase {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  tutorialPassed: boolean;
  email: string;
  subjects: any[];
  bio: string;
  status: UserStatus;
  profileImage: string;
}

export interface User extends UserBase {
  roles: UserRole[];
}

export interface UserProfile extends UserBase {
  password: string;
  roles: number[];
}

export interface Student extends UserBase {
  isStudent?: boolean;
}