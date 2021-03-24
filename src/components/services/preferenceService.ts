import { User, UserType } from "model/user";

export const isStudentPreference = (user: User) => {
  if (user.rolePreference && user.rolePreference.roleId === UserType.Student) {
    return true;
  }
}

export const isTeacherPreference = (user: User) => {
  if (user.rolePreference && user.rolePreference.roleId === UserType.Teacher) {
    return true;
  }
}