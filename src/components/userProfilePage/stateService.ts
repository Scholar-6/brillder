import { User, UserType, UserStatus, UserPreferenceEnum } from 'model/user';
import { checkAdmin, canEdit, isInstitution } from "components/services/brickService";
import { newStudentProfile } from './service';

export const getNewUserState = (isAdmin: boolean) => {
  return {
    user: newStudentProfile(),
    subjects: [],
    isNewUser: true,
    isStudent: false,
    isAdmin,
    roles: [
      { roleId: UserType.Publisher, name: "Publisher", disabled: false },
      { roleId: UserType.Institution, name: "Institution", disabled: false },
      { roleId: UserType.Admin, name: "Admin", disabled: false },
    ],
    noSubjectDialogOpen: false,
    savedDialogOpen: false,
    emailInvalidOpen: false,
    passwordChangedDialog: false,

    validationRequired: false,
    emailInvalid: false,
    previewAnimationFinished: false,
    editPassword: false
  };
}

export const getExistedUserState = (user: User) => {
  const isAdmin = checkAdmin(user.roles);
  let isEditor = canEdit(user);
  let isInstitute = isInstitution(user);

  let isOnlyStudent  = false;
  if (user.userPreference && user.userPreference.preferenceId === UserPreferenceEnum.Student) {
    isOnlyStudent = true;
  }

  if (isAdmin) {
    isEditor = true;
    isInstitute = true;
  }

  return {
    user: {
      id: -1,
      username: "",
      firstName: "",
      lastName: "",
      tutorialPassed: false,
      email: "",
      password: "",
      roles: [],
      subjects: [],
      status: UserStatus.Pending,
      bio: '',
      profileImage: "",
    },
    subjects: [],
    isNewUser: false,
    isStudent: isOnlyStudent,
    isAdmin,
    roles: [
      { roleId: UserType.Publisher, name: "Publisher", disabled: !isEditor },
      { roleId: UserType.Institution, name: "Institution", disabled: !isInstitute },
      { roleId: UserType.Admin, name: "Admin", disabled: !isAdmin },
    ],
    noSubjectDialogOpen: false,
    savedDialogOpen: false,
    emailInvalidOpen: false,
    passwordChangedDialog: false,

    validationRequired: false,
    emailInvalid: false,
    previewAnimationFinished: false,
    editPassword: false
  };
}
