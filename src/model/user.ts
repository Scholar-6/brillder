export enum UserType {
  Student = 1,
  Teacher,
  Builder,
  Admin,
  Publisher,
  Institution,
}

export enum UserPreferenceEnum {
  Student = 1,
  Teacher,
  Builder,
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
  preferenceId: UserPreferenceEnum;
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
  userPreference?: UserPreference;
}

export interface User extends UserBase {
  roles: UserRole[];
  userPreference: UserPreference;
  hasPlayedBrick: boolean;
}

export interface UserProfile extends UserBase {
  password: string;
  roles: number[];
}

export interface Student extends UserBase {
  isStudent?: boolean;
}
