import { User, UserType, UserStatus, UserPreferenceType } from 'model/user';
import { checkAdmin, canEdit } from "components/services/brickService";
import { newStudentProfile } from './service';

export const getNewUserState = (isAdmin: boolean) => {
  return {
    user: newStudentProfile(),
    subjects: [],
    isNewUser: true,
    isStudent: false,
    isAdmin,
    isFromInstitution: false,
    library: false,
    brills: 0,
    roles: [
      { roleId: UserType.Publisher, name: "Publisher", disabled: false },
      { roleId: UserType.Admin, name: "Admin", disabled: false },
    ],
    noSubjectDialogOpen: false,
    savedDialogOpen: false,
    emailInvalidOpen: false,
    passwordChangedDialog: false,

    saveDisabled: true,
    isProfile: true,
    validationRequired: false,
    emailInvalid: false,
    previewAnimationFinished: false,
    profileImagePublic: false,
    editPassword: false,
    isLoaded: true,
    stepsEnabled: false,
    originLibrary: false,
    emailConfirmDialog: false,
    emailConfirmed: false,
    librarySteps: [{ }]
  }
}

export const  getExistingUserState = (user: User) => {
  const isAdmin = checkAdmin(user.roles);
  let isEditor = canEdit(user);

  let isOnlyStudent = user.roles.length === 1 && user.roles[0].roleId === UserPreferenceType.Student;
  if (user.userPreference && user.userPreference.preferenceId === UserPreferenceType.Student) {
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
      profileImagePublic: user.profileImagePublic || false,
    },
    subjects: [],
    userBrills: user.brills,
    isNewUser: false,
    isProfile: true,
    isStudent: isOnlyStudent,
    isAdmin,
    isLoaded: true,
    roles: [
      { roleId: UserType.Publisher, name: "Publisher", disabled: !isEditor },
      { roleId: UserType.Admin, name: "Admin", disabled: !isAdmin },
    ],
    noSubjectDialogOpen: false,
    savedDialogOpen: false,
    emailInvalidOpen: false,
    passwordChangedDialog: false,
    saveDisabled: true,

    subscriptionState: user.subscriptionState,
    isFromInstitution: user.isFromInstitution,
    library: user.library,

    validationRequired: false,
    emailInvalid: false,
    previewAnimationFinished: false,
    editPassword: false,
    stepsEnabled: false,
    originLibrary: false,
    emailConfirmDialog: false,
    emailConfirmed: false,
    librarySteps: [{ }]
  };
}
