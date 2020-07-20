import React, { Component } from "react";
import { Grid, Radio, FormControlLabel } from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";
// @ts-ignore
import { connect } from "react-redux";

import brickActions from "redux/actions/brickActions";
import userActions from "redux/actions/user";
import authActions from "redux/actions/auth";
import sprite from "../../../assets/img/icons-sprite.svg";

import "./UserProfile.scss";
import { User, UserType, UserStatus, UserProfile, UserRole } from "model/user";
import PhonePreview from "../baseComponents/phonePreview/PhonePreview";
import { Subject } from "model/brick";
import SubjectAutocomplete from "./SubjectAutoCompete";
import { checkAdmin } from "components/services/brickService";
import UserProfileMenu from "./UserProfileMenu";
import SubjectDialog from "./SubjectDialog";
import { ReduxCombinedState } from "redux/reducers";

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  getUser: () => dispatch(userActions.getUser()),
  redirectedToProfile: () => dispatch(authActions.redirectedToProfile()),
});

const connector = connect(mapState, mapDispatch);

interface UserRoleItem extends UserRole {
  disabled: boolean;
}

interface UserProfileProps {
  user: User;
  history: any;
  match: any;
  forgetBrick(): void;
  redirectedToProfile(): void;
  getUser(): void;
}

interface UserProfileState {
  noSubjectDialogOpen: boolean;
  user: UserProfile;
  subjects: Subject[];
  autoCompleteOpen: boolean;
  isNewUser: boolean;
  isStudent: boolean;
  roles: UserRoleItem[];
}

class UserProfilePage extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);
    this.props.redirectedToProfile();
    const { userId } = props.match.params;
    // check if admin wanna create new user
    if (userId === "new") {
      const isAdmin = checkAdmin(props.user.roles);
      if (isAdmin) {
        this.state = {
          user: {
            id: 0,
            firstName: "",
            lastName: "",
            tutorialPassed: false,
            email: "",
            password: "",
            roles: [],
            subjects: [],
            status: UserStatus.Pending,
          },
          subjects: [],
          isNewUser: true,
          autoCompleteOpen: false,
          isStudent: false,
          roles: [
            { roleId: UserType.Student, name: "Student", disabled: false },
            { roleId: UserType.Teacher, name: "Teacher", disabled: false },
            { roleId: UserType.Builder, name: "Builder", disabled: false },
            { roleId: UserType.Editor, name: "Editor", disabled: false },
            { roleId: UserType.Admin, name: "Admin", disabled: false },
          ],
          noSubjectDialogOpen: false,
        };
      } else {
        props.history.push("/home");
      }
    } else {
      const { user } = props;

      const isBuilder = user.roles.some((role) => {
        const { roleId } = role;
        return (
          roleId === UserType.Builder ||
          roleId === UserType.Editor ||
          roleId === UserType.Admin
        );
      });

      const isEditor = user.roles.some((role) => {
        const { roleId } = role;
        return roleId === UserType.Editor || roleId === UserType.Admin;
      });

      const isAdmin = checkAdmin(user.roles);
      const isOnlyStudent =
        user.roles.length === 1 && user.roles[0].roleId === UserType.Student;

      const roles = props.user.roles.map((role) => role.roleId);

      this.state = {
        user: {
          id: user.id,
          firstName: user.firstName ? user.firstName : "",
          lastName: user.lastName ? user.lastName : "",
          tutorialPassed: false,
          email: user.email ? user.email : "",
          password: "",
          roles: roles,
          subjects: user.subjects,
          status: UserStatus.Pending,
        },
        subjects: [],
        autoCompleteOpen: false,
        isNewUser: false,
        isStudent: isOnlyStudent,
        roles: [
          { roleId: UserType.Student, name: "Student", disabled: !isBuilder },
          { roleId: UserType.Teacher, name: "Teacher", disabled: !isBuilder },
          { roleId: UserType.Builder, name: "Builder", disabled: !isBuilder },
          { roleId: UserType.Editor, name: "Editor", disabled: !isEditor },
          { roleId: UserType.Admin, name: "Admin", disabled: !isAdmin },
        ],
        noSubjectDialogOpen: false,
      };
      if (userId) {
        axios
          .get(`${process.env.REACT_APP_BACKEND_HOST}/user/${userId}`, {
            withCredentials: true,
          })
          .then((res) => {
            const user = res.data as UserProfile;

            user.roles = res.data.roles.map(
              (role: UserRoleItem) => role.roleId
            );
            if (!user.email) {
              user.email = "";
            }
            if (!user.firstName) {
              user.firstName = "";
            }
            if (!user.lastName) {
              user.lastName = "";
            }
            if (!user.roles) {
              user.roles = [];
            }
            if (!user.subjects) {
              user.subjects = [];
            }
            this.setState({ ...this.state, user: res.data });
          })
          .catch((error) => {
            alert("Can`t get user profile");
          });
      }
    }

    axios
      .get(process.env.REACT_APP_BACKEND_HOST + "/subjects", {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ ...this.state, subjects: res.data });
      })
      .catch((error) => {
        alert("Can`t get bricks");
      });
  }

  saveStudentProfile(user: UserProfile) {
    const userToSave = {} as any;
    this.prepareUserToSave(userToSave, user);
    userToSave.roles = user.roles;

    if (!user.subjects || user.subjects.length === 0) {
      this.setState({ ...this.state, noSubjectDialogOpen: true });
      return;
    }
    this.save(userToSave);
  }

  prepareUserToSave(userToSave: any, user: UserProfile) {
    userToSave.firstName = user.firstName;
    userToSave.lastName = user.lastName;
    userToSave.email = user.email;

    if (user.password) {
      userToSave.password = user.password;
    }
    if (user.id !== -1) {
      userToSave.id = user.id;
    }
    if (user.subjects) {
      userToSave.subjects = user.subjects.map((s) => s.id);
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
      this.setState({ ...this.state, noSubjectDialogOpen: true });
      return;
    }

    this.save(userToSave);
  }

  save(userToSave: any) {
    if (this.state.isNewUser) {
      // requet to add new user
    } else {
      axios
        .put(
          `${process.env.REACT_APP_BACKEND_HOST}/user`,
          { ...userToSave },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data === "OK") {
            alert("Profile saved");
            this.props.getUser();
          }
        })
        .catch((error) => {
          alert("Can`t save user profile");
        });
    }
  }

  handleSubjectDialogClose() {
    this.setState({ ...this.state, noSubjectDialogOpen: false });
  }

  onFirstNameChanged(e: any) {
    const { user } = this.state;
    user.firstName = e.target.value;
    this.setState({ ...this.state });
  }

  onLastNameChanged(e: any) {
    const { user } = this.state;
    user.lastName = e.target.value;
    this.setState({ ...this.state });
  }

  onEmailChanged(e: any) {
    const { user } = this.state;
    user.email = e.target.value;
    this.setState({ ...this.state });
  }

  onPasswordChanged(e: any) {
    const { user } = this.state;
    user.password = e.target.value;
    this.setState({ ...this.state });
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
    this.setState({ ...this.state, user });
  }

  render() {
    return (
      <div className="user-profile-page">
        <UserProfileMenu
          user={this.props.user}
          forgetBrick={this.props.forgetBrick}
          history={this.props.history}
        />
        <Grid container direction="row">
          <div className="profile-block">
            <div className="profile-header">{this.state.user.firstName ? this.state.user.firstName : 'NAME'}</div>
            <div className="save-button-container">
              <Avatar
                alt=""
                src="/feathericons/save-blue.png"
                className="save-image"
                onClick={() => this.saveUserProfile()}
              />
            </div>
            <div className="profile-fields">
              <div className="profile-image-container">
                <div className="profile-image svgOnHover">
                  <svg className="svg active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#user"} className="text-theme-dark-blue" />
                  </svg>
                </div>
                <div className="add-image-button svgOnHover">
                  <svg className="svg active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#plus"} className="text-white" />
                  </svg>
                </div>
                <div className="status-container svgOnHover">
                  <svg className="svg active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#circle-filled"} className="text-theme-green" />
                  </svg>
                  <span>Active</span>
                </div>
              </div>
              <div className="profile-inputs-container">
                <div className="input-group">
                  <div className="input-block">
                    <input
                      className="first-name style2"
                      value={this.state.user.firstName}
                      onChange={(e: any) => this.onFirstNameChanged(e)}
                      placeholder="Name"
                    />
                  </div>
                  <div className="input-block">
                    <input
                      className="last-name style2"
                      value={this.state.user.lastName}
                      onChange={(e: any) => this.onLastNameChanged(e)}
                      placeholder="Surname"
                    />
                  </div>
                </div>
                <FormControlLabel
                  value="start"
                  control={<Checkbox color="primary" />}
                  label="Keep me secret: I don't want to be searchable"
                  labelPlacement="end"
                />
                <div className="input-block">
                  <input
                    type="email"
                    className="style2"
                    value={this.state.user.email}
                    onChange={(e: any) => this.onEmailChanged(e)}
                    placeholder="username@domain.com"
                  />
                </div>
                <div className="input-block">
                  <input
                    type="password"
                    className="style2"
                    value={this.state.user.password}
                    onChange={(e: any) => this.onPasswordChanged(e)}
                    placeholder="●●●●●●●●●●●"
                  />
                </div>
              </div>
              <div className="profile-roles-container">
                <div className="roles-title">ROLES</div>
                <Grid container className="roles-box">
                  {this.renderRoles()}
                </Grid>
              </div>
            </div>
            <SubjectAutocomplete
              selected={this.state.user.subjects}
              onSubjectChange={(subjects) => this.onSubjectChange(subjects)}
            />
            <Grid container direction="row" className="big-input-container">
              <textarea className="style2" placeholder="Write a short bio here..." />
            </Grid>
          </div>
          <div className="profile-phone-preview">
            <Grid
              container
              justify="center"
              alignContent="center"
              style={{ height: "100%" }}
            >
              <div>
                <PhonePreview />
              </div>
            </Grid>
          </div>
        </Grid>
        <SubjectDialog
          isOpen={this.state.noSubjectDialogOpen}
          close={() => this.handleSubjectDialogClose()}
        />
      </div>
    );
  }
}

export default connector(UserProfilePage);
