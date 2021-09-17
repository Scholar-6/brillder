import { User, UserType, UserStatus, RolePreference } from 'model/user';
import { checkAdmin, canEdit } from "components/services/brickService";
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

  let isOnlyStudent = user.roles.length === 1 && user.roles[0].roleId === RolePreference.Student;
  if (user.rolePreference && user.rolePreference.roleId === RolePreference.Student) {
    isEditor = false;
  }

  if (isAdmin) {
    isEditor = true;
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
