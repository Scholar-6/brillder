import { User, RolePreference } from "model/user";

export const isStudentPreference = (user: User) => {
  if (user.rolePreference && user.rolePreference.roleId === RolePreference.Student) {
    return true;
  }
}

export const isTeacherPreference = (user: User) => {
  if (user.rolePreference && user.rolePreference.roleId === RolePreference.Teacher) {
    return true;
  }
}