import { RealLibrary } from "services/axios/realLibrary";

export enum UserType {
  Student = 1,
  Teacher,
  Builder,
  Admin,
  Publisher,
}

export enum UserPreferenceType {
  Student = 1,
  Teacher,
  Builder,
  Institution
}

export enum SubscriptionState {
  Free,
  Pending,
  PaidStudent,
  PaidTeacher,
  PaidInstitution,
  FreePass
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
export interface UserPreference {
  preferenceId: number;
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
  profileImagePublic: boolean;
  freeAttemptsLeft?: number;
}

export interface User extends UserBase {
  created: string;
  roles: UserRole[];
  userPreference?: UserPreference;
  hasPlayedBrick: boolean;
  termsAndConditionsAcceptedVersion: string;
  brills?: number;
  credits?: number;
  userCredits?: number;
  isFromInstitution?: boolean;

  freeAssignmentsLeft: number;
  freeAttemptsLeft: number;
  freeCompetitionLeft: number;
  subscriptionState?: SubscriptionState;

  library?: RealLibrary;
  libraryCardNumber?: string;

  teachClassroomCount?: number;
  studyClassroomCount?: number;
}

export interface UserProfile extends UserBase {
  password: string;
  userPreference?: UserPreference;
  roles: number[];
}

export interface Student extends UserBase {
  isStudent?: boolean;
}
