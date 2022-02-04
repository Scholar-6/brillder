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
}

export interface User extends UserBase {
  roles: UserRole[];
  userPreference?: UserPreference;
  hasPlayedBrick: boolean;
  termsAndConditionsAcceptedVersion: string;

  freeAssignmentsLeft: number;
  freeAttemptsLeft: number;
  freeCompetitionLeft: number;
  subscriptionState?: number;
}

export interface UserProfile extends UserBase {
  password: string;
  userPreference?: UserPreference;
  roles: number[];
}

export interface Student extends UserBase {
  isStudent?: boolean;
}
