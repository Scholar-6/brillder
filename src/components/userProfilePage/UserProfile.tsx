import React, { Component } from "react";
import { Grid, Radio, FormControlLabel } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { connect } from "react-redux";

import actions from 'redux/actions/requestFailed';
import brickActions from "redux/actions/brickActions";
import userActions from "redux/actions/user";
import authActions from "redux/actions/auth";
import { getGeneralSubject, loadSubjects } from 'components/services/subject';
import { UpdateUserStatus, UserProfileField, UserRoleItem } from './model';
import { isValid, getUserById, createUser, updateUser, saveProfileImageName } from './service';

import "./UserProfile.scss";
import { User, UserType, UserStatus, UserProfile } from "model/user";
import PhonePreview from "../build/baseComponents/phonePreview/PhonePreview";
import { Subject } from "model/brick";
import SubjectAutocomplete from "./components/SubjectAutoCompete";
import { checkAdmin, canBuild, canEdit } from "components/services/brickService";
import SubjectDialog from "./components/SubjectDialog";
import { ReduxCombinedState } from "redux/reducers";
import SaveProfileButton from "./components/SaveProfileButton";
import ProfileSavedDialog from "./components/ProfileSavedDialog";
import SimpleDialog from "../baseComponents/dialogs/SimpleDialog";
import ProfileImage from "./components/ProfileImage";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";

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

  user: UserProfile;
  subjects: Subject[];
  isNewUser: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  roles: UserRoleItem[];
  validationRequired: boolean;
  emailInvalid: boolean;
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
            this.setState({ user: this.getUserProfile(user) });
          } else {
            this.props.requestFailed("Can`t get user profile");
          }
        });
      } else {
        tempState.user = this.getUserProfile(user);
        this.state = tempState;
      }
    }

    loadSubjects().then(subjects => {
      if (subjects) {
        let user = this.state.user;
        const general = getGeneralSubject(subjects);
        if (general) {
          user.subjects = [general];
        }
        this.setState({ subjects, user });
      } else {
        this.props.requestFailed("Can`t get subjects");
      }
    });
  }

  getUserProfile(user: User): UserProfile {
    let roles = user.roles.map(role => role.roleId);

    return {
      id: user.id,
      username: user.username,
      roles: roles ? roles : [],
      email: user.email ? user.email : "",
      firstName: user.firstName ? user.firstName : "",
      lastName: user.lastName ? user.lastName : "",
      subjects: user.subjects ? user.subjects : [],
      profileImage: user.profileImage ? user.profileImage : "",
      status: UserStatus.Pending,
      tutorialPassed: false,
      bio: user.bio ? user.bio : '',
      password: ""
    }
  }

  getExistedUserState(user: User, isAdmin: boolean) {
    const isBuilder = canBuild(user);
    const isEditor = canEdit(user);

    const isOnlyStudent = user.roles.length === 1 && user.roles[0].roleId === UserType.Student;

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
        { roleId: UserType.Student, name: "Student", disabled: !isBuilder },
        { roleId: UserType.Teacher, name: "Teacher", disabled: !isBuilder },
        { roleId: UserType.Builder, name: "Builder", disabled: !isBuilder },
        { roleId: UserType.Editor, name: "Editor", disabled: !isEditor },
        { roleId: UserType.Admin, name: "Admin", disabled: !isAdmin },
      ],
      noSubjectDialogOpen: false,
      savedDialogOpen: false,
      emailInvalidOpen: false,

      validationRequired: false,
      emailInvalid: false
    };
  }

  getNewUserState(isAdmin: boolean) {
    return {
      user: {
        id: 0,
        username: "",
        firstName: "",
        lastName: "",
        tutorialPassed: false,
        email: "",
        password: "",
        roles: [UserType.Student, UserType.Builder],
        subjects: [],
        status: UserStatus.Pending,
        bio: '',
        profileImage: "",
      },
      subjects: [],
      isNewUser: true,
      isStudent: false,
      isAdmin,
      roles: [
        { roleId: UserType.Student, name: "Student", disabled: false },
        { roleId: UserType.Teacher, name: "Teacher", disabled: false },
        { roleId: UserType.Builder, name: "Builder", disabled: false },
        { roleId: UserType.Editor, name: "Editor", disabled: false },
        { roleId: UserType.Admin, name: "Admin", disabled: false },
      ],
      noSubjectDialogOpen: false,
      savedDialogOpen: false,
      emailInvalidOpen: false,
      validationRequired: false,
      emailInvalid: false
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

  save(userToSave: any) {
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
      createUser(userToSave).then(status => {
        if (status === UpdateUserStatus.Success) {
          this.setState({ savedDialogOpen: true });
          this.props.getUser();
        } else if (status === UpdateUserStatus.InvalidEmail) {
          this.setState({ emailInvalidOpen: true });
        } else {
          this.props.requestFailed("Can`t save user profile");
        }
      });
    } else {
      updateUser(userToSave).then(saved => {
        if (saved) {
          this.setState({ savedDialogOpen: true });
          this.props.getUser();
        } else {
          this.props.requestFailed("Can`t save user profile");
        }
      });
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
    const {value} = e.target;
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

  checkUserRole(roleId: number) {
    return this.state.user.roles.some((id) => id === roleId);
  }

  toggleRole(roleId: number, disabled: boolean) {
    if (disabled) {
      return;
    }
    let index = this.state.user.roles.indexOf(roleId);
    if (index !== -1) {
      this.state.user.roles.splice(index, 1);
    } else {
      this.state.user.roles.push(roleId);
    }
    this.setState({ ...this.state });
  }

  renderUserRole(role: UserRoleItem) {
    let checked = this.checkUserRole(role.roleId);

    if (this.state.isStudent) {
      return (
        <FormControlLabel
          className="filter-container disabled"
          checked={checked}
          control={<Radio className="filter-radio" />}
          label={role.name}
        />
      );
    }

    return (
      <FormControlLabel
        className={`filter-container ${role.disabled ? "disabled" : ""}`}
        checked={checked}
        onClick={() => this.toggleRole(role.roleId, role.disabled)}
        control={<Radio className="filter-radio" />}
        label={role.name}
      />
    );
  }

  renderRoles() {
    return this.state.roles.map((role: any, i: number) => (
      <Grid item key={i}>
        {this.renderUserRole(role)}
      </Grid>
    ));
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

  renderInput(
    value: string, initClassName: string, placeholder: string,
    onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined,
    type: string = 'text', shouldBeFilled: boolean = true
  ) {
    let className = initClassName + ' style2';
    if (this.state.validationRequired && !value && shouldBeFilled) {
      className += ' invalid';
    }
    return (
      <div className="input-block">
        <input type={type} className={className} value={value} onChange={onChange} placeholder={placeholder} />
      </div>
    );
  }

  render() {
    const { user } = this.state;
    //let valid = isValid(user) && !this.state.emailInvalid;
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
                  {this.renderInput(
                    user.firstName, 'first-name', 'Name', e => this.onFieldChanged(e, UserProfileField.FirstName)
                  )}
                  {this.renderInput(
                    user.lastName, 'last-name', 'Surname', e => this.onFieldChanged(e, UserProfileField.LastName)
                  )}
                </div>
                <FormControlLabel
                  value="start"
                  className="secret-input"
                  control={<Checkbox color="primary" />}
                  label="Keep me secret: I don't want to be searchable"
                  labelPlacement="end"
                />
                {this.renderInput(
                  user.email, '', 'Email', e => this.onEmailChanged(e), 'email'
                )}
                {this.renderInput(
                  user.password, '', 'Password', e => this.onFieldChanged(e, UserProfileField.Password), 'password'
                )}
              </div>
              <div className="profile-roles-container">
                <div className="roles-title">ROLES</div>
                <Grid container className="roles-box">
                  {this.renderRoles()}
                </Grid>
              </div>
            </div>
            {this.renderSubjects(user)}
            <Grid container direction="row" className="big-input-container">
              <textarea
                className="style2"
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
              <PhonePreview />
            </Grid>
          </div>
        </Grid>
        <SimpleDialog
          isOpen={this.state.emailInvalidOpen}
          label={this.state.emailInvalid ? "Email is invalid" : "Email is already in use"}
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
      </div>
    );
  }
}

export default connector(UserProfilePage);
