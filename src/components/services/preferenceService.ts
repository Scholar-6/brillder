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

export const isBuilderPreference = (user: User) => {
  if (user.rolePreference && user.rolePreference.roleId === RolePreference.Builder) {
    return true;
  }
}

export const isInstitutionPreference = (user: User) => {
  if (user.rolePreference && user.rolePreference.roleId === RolePreference.Institution) {
    return true;
  }
}