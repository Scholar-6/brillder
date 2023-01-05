import { RealLibrary } from "services/axios/realLibrary";

export enum UserType {
  Student = 1,
  Teacher,
  Builder,
  Admin,
  Publisher,
  Institution,
  InstitutionUser,
}

export enum UserPreferenceType {
  Student = 1,
  Teacher,
  Builder,
  Institution
}

export enum SubscriptionState {
  Free = 0,
  Pending,
  PaidStudent,
  PaidTeacher,
  PaidInstitution,
  FreePass,
  Cancelled
}

export enum SubscriptionInterval {
  Montly,
  Yearly
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

export interface Institution {
  id: number;
  name: string;
  logo: string;
  domains: string[];
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
  subscriptionInterval?: SubscriptionInterval;

  library?: RealLibrary;
  libraryCardNumber?: string;

  teachClassroomCount?: number;
  studyClassroomCount?: number;

  institution: Institution;

  attempts: any[];
}

export interface UserProfile extends UserBase {
  password: string;
  userPreference?: UserPreference;
  roles: number[];
}

export interface Student extends UserBase {
  isStudent?: boolean;
}
