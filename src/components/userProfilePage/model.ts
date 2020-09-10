import { UserRole } from "model/user";

export enum UpdateUserStatus {
  None,
  Failed,
  InvalidEmail,
  Success
}

export enum UserProfileField {
  LastName = 'lastName',
  FirstName = 'firstName',
  Email = 'email',
  Bio = 'bio',
  Password = 'password'
}

export interface UserRoleItem extends UserRole {
  disabled: boolean;
}
