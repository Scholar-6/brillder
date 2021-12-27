import { User, UserPreferenceType } from "model/user";

export const isStudentPreference = (user: User) => {
  if (user.userPreference && user.userPreference.preferenceId === UserPreferenceType.Student) {
    return true;
  }
}

export const isTeacherPreference = (user: User) => {
  if (user.userPreference && user.userPreference.preferenceId === UserPreferenceType.Teacher) {
    return true;
  }
}

export const isBuilderPreference = (user: User) => {
  if (user.userPreference && user.userPreference.preferenceId === UserPreferenceType.Builder) {
    return true;
  }
}

export const isInstitutionPreference = (user: User) => {
  if (user.userPreference && user.userPreference.preferenceId === UserPreferenceType.Institution) {
    return true;
  }
}