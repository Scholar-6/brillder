import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import brickActions from "redux/actions/brickActions";
import userActions from "redux/actions/user";
import authActions from "redux/actions/auth";
import RolesBox from './RolesBox';
import "./UserProfile.scss";

import { getGeneralSubject, loadSubjects } from 'components/services/subject';
import { UpdateUserStatus, UserProfileField, UserRoleItem } from './model';
import { getUserById, createUser, updateUser, saveProfileImageName } from 'services/axios/user';
import { isValid, getUserProfile, newStudentProfile } from './service';
import { User, UserType, UserStatus, UserProfile } from "model/user";
import { Subject } from "model/brick";
import { checkAdmin, canEdit, isInstitution } from "components/services/brickService";

import SubjectAutocomplete from "./components/SubjectAutoCompete";
import SubjectDialog from "./components/SubjectDialog";
import PhonePreview from "../build/baseComponents/phonePreview/PhonePreview";
import SaveProfileButton from "./components/SaveProfileButton";
import ProfileSavedDialog from "./components/ProfileSavedDialog";
import ProfileImage from "./components/ProfileImage";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import UserProfilePreview from "./components/UserProfilePreview";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProfileInput from "./components/ProfileInput";
import ProfileIntroJs from "./components/ProfileIntroJs";

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  getUser: () => dispatch(userActions.getUser()),
  redirectedToProfile: () => dispatch(authActions.redirectedToProfile()),
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(mapState, mapDispatch);

interface UserProfileProps {
  user: User;
  location: any;
  history: any;
  match: any;
  forgetBrick(): void;
  redirectedToProfile(): void;
  getUser(): void;
  requestFailed(e: string): void;
}

interface UserProfileState {
  noSubjectDialogOpen: boolean;
  savedDialogOpen: boolean;
  emailInvalidOpen: boolean;
  previewAnimationFinished: boolean;

  user: UserProfile;
  subjects: Subject[];
  isNewUser: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  roles: UserRoleItem[];
  validationRequired: boolean;
  emailInvalid: boolean;
  editPassword: boolean;
}

class UserProfilePage extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);
    this.props.redirectedToProfile();
    const { userId } = props.match.params;
    const isAdmin = checkAdmin(props.user.roles);

    // check if admin wanna create new user
    if (userId === "new") {
      if (isAdmin) {
        this.state = this.getNewUserState(isAdmin);
      } else {
        props.history.push("/home");
      }
    } else {
      const { user } = props;

      let tempState: UserProfileState = this.getExistedUserState(user, isAdmin);
      if (userId) {
        this.state = tempState;
        getUserById(userId).then(user => {
          if (user) {
            this.setState({ user: getUserProfile(user) });
          } else {
            this.props.requestFailed("Can`t get user profile");
          }
        });
      } else {
        tempState.user = getUserProfile(user);
        this.state = tempState;
      }
    }

    loadSubjects().then(subjects => {
      if (subjects) {
        let user = this.state.user;
        const general = getGeneralSubject(subjects);
        if (general) {
          if (user.subjects.length === 0) {
            user.subjects = [general];
          }
        }
        this.setState({ subjects, user });
      } else {
        this.props.requestFailed("Can`t get subjects");
      }
    });
  }

  getExistedUserState(user: User, isAdmin: boolean) {
    let isEditor = canEdit(user);
    let isInstitute = isInstitution(user);

    let isOnlyStudent = user.roles.length === 1 && user.roles[0].roleId === UserType.Student;
    if (this.props.user.rolePreference && this.props.user.rolePreference.roleId === UserType.Student) {
      isEditor = false;
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

      validationRequired: false,
      emailInvalid: false,
      previewAnimationFinished: false,
      editPassword: false
    };
  }

  getNewUserState(isAdmin: boolean) {
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
      validationRequired: false,
      emailInvalid: false,
      previewAnimationFinished: false,
      editPassword: false
    };
  }

  saveStudentProfile(user: UserProfile) {
    const userToSave = {} as any;
    this.prepareUserToSave(userToSave, user);
    userToSave.roles = user.roles;

    if (!user.subjects || user.subjects.length === 0) {
      this.setState({ noSubjectDialogOpen: true });
      return;
    }
    this.save(userToSave);
  }

  prepareUserToSave(userToSave: any, user: UserProfile) {
    userToSave.firstName = user.firstName;
    userToSave.lastName = user.lastName;
    userToSave.email = user.email;
    userToSave.bio = user.bio;

    if (user.password) {
      userToSave.password = user.password;
    }
    if (user.id !== -1) {
      userToSave.id = user.id;
    }
    if (user.subjects) {
      userToSave.subjects = user.subjects.map((s) => s.id);
    }
    if (user.profileImage) {
      userToSave.profileImage = user.profileImage;
    }
  }

  saveUserProfile() {
    const { user } = this.state;
    if (this.state.isStudent) {
      this.saveStudentProfile(user);
      return;
    }
    const userToSave = { roles: user.roles } as any;
    this.prepareUserToSave(userToSave, user);

    if (!user.subjects || user.subjects.length === 0) {
      this.setState({ noSubjectDialogOpen: true });
      return;
    }
    this.save(userToSave);
  }

  async save(userToSave: any) {
    const valid = isValid(userToSave);
    if (!valid) {
      this.setState({ validationRequired: true });
      return;
    }
    if (this.state.emailInvalid) {
      this.setState({ emailInvalidOpen: true });
      return;
    }

    if (this.state.isNewUser) {
      const status = await createUser(userToSave);
      if (status === UpdateUserStatus.Success) {
        this.setState({ savedDialogOpen: true });
        this.props.getUser();
      } else if (status === UpdateUserStatus.InvalidEmail) {
        this.setState({ emailInvalidOpen: true });
      } else {
        this.props.requestFailed("Can`t save user profile");
      }
    } else {
      const saved = await updateUser(userToSave);
      if (saved) {
        this.setState({ savedDialogOpen: true });
        this.props.getUser();
      } else {
        this.props.requestFailed("Can`t save user profile");
      }
    }
  }

  onInvalidEmailClose() {
    this.setState({ emailInvalidOpen: false });
  }

  onSubjectDialogClose() {
    this.setState({ noSubjectDialogOpen: false });
  }

  onProfileSavedDialogClose() {
    this.setState({ savedDialogOpen: false });
  }

  onFieldChanged(e: React.ChangeEvent<HTMLInputElement>, name: UserProfileField) {
    const { user } = this.state;
    user[name] = e.target.value;
    this.setState({ user });
  }

  onEmailChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const { user } = this.state;
    const { value } = e.target;
    user.email = value;
    let emailInvalid = false;
    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
      emailInvalid = true;
    }
    this.setState({ user, emailInvalid });
  }

  onProfileImageChanged(name: string) {
    const { user } = this.state;
    user.profileImage = name;

    saveProfileImageName(user.id, name).then((res: boolean) => {
      if (res) {
        // upload success
      } else {
        // saving image name failed
      }
    });

    this.setState({ user });
  }

  toggleRole(roleId: number, disabled: boolean) {
    if (disabled) {
      return;
    }
    let index = this.state.user.roles.indexOf(roleId);
    if (index !== -1) {
      // publisher can`t remove his publisher role
      if (roleId === UserType.Publisher) {
        const foundUpperRole = this.state.user.roles.find(r => r === UserType.Admin || r === UserType.Institution);
        if (!foundUpperRole) {
          return;
        }
      }
      this.state.user.roles.splice(index, 1);
    } else {
      this.state.user.roles.push(roleId);
    }
    this.setState({ ...this.state });
  }

  onSubjectChange(newValue: any[]) {
    const { user } = this.state;
    user.subjects = newValue;
    this.setState({ user });
  }

  renderSubjects(user: UserProfile) {
    if (user.id === -1 || this.state.subjects.length === 0) {
      return;
    }
    return (
      <SubjectAutocomplete
        selected={user.subjects}
        subjects={this.state.subjects}
        onSubjectChange={(subjects) => this.onSubjectChange(subjects)}
      />
    );
  }

  previewAnimationFinished() {
    this.setState({ previewAnimationFinished: true })
  }

  render() {
    const { user } = this.state;
    return (
      <div className="main-listing user-profile-page">
        <PageHeadWithMenu
          page={PageEnum.Profile}
          user={this.props.user}
          history={this.props.history}
          search={() => { }}
          searching={() => { }}
        />
        <Grid container direction="row">
          <div className="profile-block">
            <div className="profile-header">
              {user.firstName ? user.firstName : "NAME"}
              <span className="profile-username">{user.username ? user.username : "USERNAME"}</span>
            </div>
            <div className="save-button-container">
              <SaveProfileButton
                user={user}
                onClick={() => this.saveUserProfile()}
              />
            </div>
            <div className="profile-fields">
              <ProfileImage
                profileImage={user.profileImage}
                setImage={(v) => this.onProfileImageChanged(v)}
                deleteImage={() => this.onProfileImageChanged('')}
              />
              <div className="profile-inputs-container">
                <div className="input-group">
                  <ProfileInput
                    value={user.firstName} validationRequired={this.state.validationRequired}
                    className="first-name"  placeholder="Name"
                    onChange={e => this.onFieldChanged(e, UserProfileField.FirstName)}
                  />
                  <ProfileInput
                    value={user.lastName} validationRequired={this.state.validationRequired}
                    className="last-name"  placeholder="Surname"
                    onChange={e => this.onFieldChanged(e, UserProfileField.LastName)}
                  />
                </div>
                <ProfileInput
                  value={user.email} validationRequired={this.state.validationRequired}
                  className=""  placeholder="Email" type="email"
                  onChange={e => this.onEmailChanged(e)}
                />
                <div className="password-container">
                  <ProfileInput
                    value={user.password} validationRequired={this.state.validationRequired}
                    className=""  placeholder="●●●●●●●●●●●" type="password" shouldBeFilled={false}
                    onChange={e => this.onFieldChanged(e, UserProfileField.Password)}
                  />
                  {!this.state.editPassword &&
                  <div className="button-container">
                    <button onClick={() => this.setState({editPassword: true})}>Edit</button>
                  </div>}
                  {this.state.editPassword &&
                  <div className="confirm-container">
                    <SpriteIcon name="check-icon" className="start" />
                    <SpriteIcon name="cancel-custom" className="end" />
                  </div>}
                </div>
              </div>
              <div className="profile-roles-container">
                <div className="roles-title">ROLES</div>
                <RolesBox
                  roles={this.state.roles}
                  userRoles={this.state.user.roles}
                  rolePreference={this.props.user.rolePreference?.roleId}
                  toggleRole={this.toggleRole.bind(this)}
                />
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              {this.renderSubjects(user)}
              <div className="centered">
                <SpriteIcon
                  name="arrow-left-2"
                  className={`svg red-circle ${this.state.previewAnimationFinished ? '' : 'hidden'}`}
                />
              </div>
            </div>
            <Grid container direction="row" className="big-input-container">
              <textarea
                className="style2"
                value={user.bio}
                placeholder="Write a short bio here..."
                onChange={e => this.onFieldChanged(e as any, UserProfileField.Bio)}
              />
            </Grid>
          </div>
          <div className="profile-phone-preview">
            <Grid
              container
              justify="center"
              alignContent="center"
              style={{ height: "100%" }}
            >
              <PhonePreview Component={UserProfilePreview} data={{user:this.state.user}} action={this.previewAnimationFinished.bind(this)} />
            </Grid>
          </div>
        </Grid>
        <ValidationFailedDialog
          isOpen={this.state.emailInvalidOpen}
          header={this.state.emailInvalid ? "That email address doesn’t look right" : "Email is already in use"}
          label="Have you spelled it correctly?"
          close={this.onInvalidEmailClose.bind(this)}
        />
        <SubjectDialog
          isOpen={this.state.noSubjectDialogOpen}
          close={this.onSubjectDialogClose.bind(this)}
        />
        <ProfileSavedDialog
          isAdmin={this.state.isAdmin}
          history={this.props.history}
          isOpen={this.state.savedDialogOpen}
          close={this.onProfileSavedDialogClose.bind(this)}
        />
        <ProfileIntroJs location={this.props.location} />
      </div>
    );
  }
}

export default connector(UserProfilePage);
