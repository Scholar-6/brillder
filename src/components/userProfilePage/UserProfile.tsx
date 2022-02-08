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
import { isValid, getUserProfile } from './service';
import { User, UserType, UserProfile } from "model/user";
import { Subject } from "model/brick";
import { checkAdmin } from "components/services/brickService";

import SubjectAutocomplete from "./components/SubjectAutoCompete";
import SubjectDialog from "./components/SubjectDialog";
import SaveProfileButton from "./components/SaveProfileButton";
import ProfileSavedDialog from "./components/ProfileSavedDialog";
import ProfileImage from "./components/ProfileImage";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProfileInput from "./components/ProfileInput";
import ProfileIntroJs from "./components/ProfileIntroJs";
import PasswordChangedDialog from "components/baseComponents/dialogs/PasswordChangedDialog";
import ProfilePhonePreview from "./components/ProfilePhonePreview";
import { getExistedUserState, getNewUserState } from "./stateService";
import { isPhone } from "services/phone";
import { isMobile } from "react-device-detect";
import UserTypeLozenge from "./UsertypeLozenge";
import { maximizeZendeskButton, minimizeZendeskButton } from "services/zendesk";
import SaveIntroJs from "./components/SaveIntroJs";

const TabletTheme = React.lazy(() => import("./themes/UserTabletTheme"));

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
  passwordChangedDialog: boolean;

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
  saveDisabled: boolean;
  minimizeTimeout?: number;
  introJsSuspended?: boolean;
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
        this.state = getNewUserState(isAdmin);
      } else {
        props.history.push("/home");
      }
    } else {
      const { user } = props;

      let tempState: UserProfileState = getExistedUserState(user);

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

  componentDidMount() {
    minimizeZendeskButton();
    const minimizeTimeout = setTimeout(() => {
      minimizeZendeskButton();
    }, 1400);
    this.setState({ minimizeTimeout });
  }

  componentWillUnmount() {
    if (this.state.minimizeTimeout) {
      clearTimeout(this.state.minimizeTimeout);
    }
    maximizeZendeskButton();
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

    this.suspendIntroJs();

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
    this.resumeIntroJs();
  }

  onProfileSavedDialogClose() {
    this.setState({ savedDialogOpen: false });
    this.resumeIntroJs();
  }

  onFieldChanged(e: React.ChangeEvent<HTMLInputElement>, name: UserProfileField) {
    const { user } = this.state;
    user[name] = e.target.value;
    this.setState({ user, saveDisabled: false });
  }

  onEmailChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const { user } = this.state;
    const { value } = e.target;
    user.email = value;
    let emailInvalid = false;
    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
      emailInvalid = true;
    }
    this.setState({ user, emailInvalid, saveDisabled: false });
  }

  onProfileImageChanged(name: string, imagePublic: boolean) {
    const { user } = this.state;
    user.profileImage = name;
    user.profileImagePublic = imagePublic;

    saveProfileImageName(user.id, name, imagePublic).then((res: boolean) => {
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
        const foundUpperRole = this.props.user.roles.find(r => r.roleId === UserType.Admin);
        if (!foundUpperRole) {
          return;
        }
      }
      this.state.user.roles.splice(index, 1);
    } else {
      this.state.user.roles.push(roleId);
    }
    this.setState({ ...this.state, saveDisabled: false });
  }

  onSubjectChange(newValue: any[]) {
    const { user } = this.state;
    user.subjects = newValue;
    this.setState({ user, saveDisabled: false });
  }

  async changePassword() {
    const { user } = this.state;
    const userToSave = { password: user.password } as any;

    // set current user roles
    userToSave.roles = this.props.user.roles.map(role => role.roleId);
    //const saved = await updateUser(userToSave);

    //this.setState({ passwordChangedDialog: true });
  }

  suspendIntroJs() {
    if (!this.state.introJsSuspended) {
      this.setState({ introJsSuspended: true });
    }
  }

  resumeIntroJs() {
    if (this.state.introJsSuspended) {
      this.setState({ introJsSuspended: false });
    }
  }

  renderSubjects(user: UserProfile) {
    if (user.id === -1 || this.state.subjects.length === 0) {
      return;
    }
    return (
      <SubjectAutocomplete
        selected={user.subjects}
        subjects={this.state.subjects}
        suspendIntroJs={this.suspendIntroJs.bind(this)}
        resumeIntroJs={this.resumeIntroJs.bind(this)}
        onSubjectChange={(subjects) => this.onSubjectChange(subjects)}
      />
    );
  }

  previewAnimationFinished() {
    this.setState({ previewAnimationFinished: true })
  }

  render() {
    const { user } = this.state;
    const canMove = user.username ? true : false;

    const mockHistory = {
      location: this.props.history.location,
      push() { }
    } as any;

    return (
      <React.Suspense fallback={<></>}>
        <div className="main-listing user-profile-page">
          {!isPhone() && isMobile && <TabletTheme />}
          <PageHeadWithMenu
            page={PageEnum.Profile}
            user={this.props.user}
            history={canMove ? this.props.history : mockHistory}
            search={() => { }}
            searching={() => { }}
          />
          <Grid container direction="row" className="user-profile-content">
            <div className="profile-block">
              <div className="profile-header">
                <UserTypeLozenge roles={user.roles} userPreference={this.props.user.userPreference} />
                <div>{user.username ? user.username : "USERNAME"}</div>
                {this.props.user && this.props.user.subscriptionState && this.props.user.subscriptionState > 1 && <SpriteIcon name="hero-sparkle" />}
              </div>
              <div className="save-button-container">
                <SaveProfileButton
                  user={user}
                  disabled={this.state.saveDisabled}
                  onClick={() => this.saveUserProfile()}
                />
              </div>
              <div className="profile-fields">
                <ProfileImage
                  user={user}
                  currentUser={this.props.user}
                  setImage={this.onProfileImageChanged.bind(this)}
                  deleteImage={() => this.onProfileImageChanged('', false)}
                  suspendIntroJs={this.suspendIntroJs.bind(this)}
                  resumeIntroJs={this.resumeIntroJs.bind(this)}
                />
                <div className="profile-inputs-container">
                  <div className="input-group">
                    <ProfileInput
                      value={user.firstName} validationRequired={this.state.validationRequired}
                      className="first-name" placeholder="Name"
                      onChange={e => this.onFieldChanged(e, UserProfileField.FirstName)}
                    />
                    <ProfileInput
                      value={user.lastName} validationRequired={this.state.validationRequired}
                      className="last-name" placeholder="Surname"
                      onChange={e => this.onFieldChanged(e, UserProfileField.LastName)}
                    />
                  </div>
                  <ProfileInput
                    value={user.email} validationRequired={this.state.validationRequired}
                    className="" placeholder="Email" type="email"
                    onChange={e => this.onEmailChanged(e)}
                  />
                  <div className="password-container">
                    <ProfileInput
                      value={user.password} validationRequired={this.state.validationRequired}
                      className="" placeholder="●●●●●●●●●●●" type="password" shouldBeFilled={false}
                      onChange={e => this.onFieldChanged(e, UserProfileField.Password)}
                    /*disabled={!this.state.editPassword}*/
                    />
                    {!this.state.editPassword &&
                      <div className="button-container">
                        <button onClick={() => this.setState({ editPassword: true })}>Edit</button>
                      </div>}
                    {this.state.editPassword &&
                      <div className="confirm-container">
                        <SpriteIcon name="check-icon" className="start" onClick={this.changePassword.bind(this)} />
                        <SpriteIcon name="cancel-custom" className="end" onClick={() => {
                          this.setState({ editPassword: false })
                        }} />
                      </div>}
                  </div>
                </div>
                <div className="profile-roles-container">
                  {this.state.user.userPreference &&
                    <RolesBox
                      roles={this.state.roles}
                      userId={this.state.user.id}
                      userRoles={this.state.user.roles}
                      isAdmin={this.state.isAdmin}
                      userPreference={this.state.user.userPreference?.preferenceId}
                      togglePreference={() => this.setState({ saveDisabled: false })}
                      toggleRole={this.toggleRole.bind(this)}
                    />}
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
              <Grid container direction="row" className="big-input-container bio-container-2">
                <textarea
                  className="style2 bio-container"
                  value={user.bio}
                  onClick={this.suspendIntroJs.bind(this)}
                  placeholder="Write a short bio here..."
                  onChange={e => {
                    this.onFieldChanged(e as any, UserProfileField.Bio)
                  }}
                  onBlur={this.resumeIntroJs.bind(this)}
                />
              </Grid>
            </div>
            <ProfilePhonePreview user={this.state.user} previewAnimationFinished={this.previewAnimationFinished.bind(this)} />
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
          <PasswordChangedDialog
            isOpen={this.state.passwordChangedDialog}
            close={() => this.setState({ passwordChangedDialog: false })} />
          <ProfileIntroJs user={this.props.user} suspended={this.state.introJsSuspended} history={this.props.history} location={this.props.location} />
          {!this.state.saveDisabled && <SaveIntroJs />}
        </div>
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  getUser: () => dispatch(userActions.getUser()),
  redirectedToProfile: () => dispatch(authActions.redirectedToProfile()),
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(UserProfilePage);
