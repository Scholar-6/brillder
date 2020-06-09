import React, { Component } from 'react';
import { Grid, Button, Radio, FormControlLabel } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import axios from 'axios';
// @ts-ignore
import { connect } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import brickActions from 'redux/actions/brickActions';

import './UserProfile.scss';
import authActions from 'redux/actions/auth';
import { User, UserType, UserStatus, UserProfile, UserRole } from 'model/user';
import PhonePreview from '../baseComponents/phonePreview/PhonePreview';
import { Subject } from 'model/brick';
import PageHeader from 'components/baseComponents/pageHeader/PageHeader';
import SubjectAutocomplete from './SubjectAutoCompete';


const mapState = (state: any) => {
  return {
    user: state.user.user,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    forgetBrick: () => dispatch(brickActions.forgetBrick()),
    logout: () => dispatch(authActions.logout()),
  }
}

const connector = connect(mapState, mapDispatch);

interface UserRoleItem extends UserRole {
  disabled: boolean;
}

interface UserProfileProps {
  user: User,
  history: any;
  match: any;
  forgetBrick(): void;
  logout(): void;
}

interface UserProfileState {
  noSubjectDialogOpen: boolean;
  user: UserProfile;
  subjects: Subject[];
  searchString: string;
  isSearching: boolean;
  logoutDialogOpen: boolean;
  deleteDialogOpen: boolean;
  dropdownShown: boolean;
  autoCompleteOpen: boolean;
  isStudent: boolean;
  roles: UserRoleItem[];
}

class UserProfilePage extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props)
    const {user} = props;
    const {userId} = props.match.params;

    const isBuilder = user.roles.some(role => {
      const {roleId} = role;
      return roleId === UserType.Builder || roleId === UserType.Editor || roleId === UserType.Admin;
    });

    const isEditor = user.roles.some(role => {
      const {roleId} = role;
      return roleId === UserType.Editor || roleId === UserType.Admin;
    });

    const isAdmin = user.roles.some(role => {
      const {roleId} = role;
      return roleId === UserType.Admin;
    });

    const isOnlyStudent = user.roles.length === 1 && user.roles[0].roleId === UserType.Student;

    const roles = props.user.roles.map(role => role.roleId);

    this.state = {
      user: {
        id: user.id,
        firstName: user.firstName ? user.firstName : '',
        lastName: user.lastName ? user.lastName : '',
        tutorialPassed: false,
        email: user.email ? user.email : '',
        password: '',
        roles: roles,
        subjects: user.subjects,
        status: UserStatus.Pending,
      },
      subjects: [],
      logoutDialogOpen: false,
      deleteDialogOpen: false,
      searchString: '',
      isSearching: false,
      dropdownShown: false,
      autoCompleteOpen: false,
      isStudent: isOnlyStudent,
      roles: [
        { roleId: UserType.Student, name: "Student", disabled: !isBuilder},
        { roleId: UserType.Teacher, name: "Teacher", disabled: !isBuilder},
        { roleId: UserType.Builder, name: "Builder", disabled: !isBuilder},
        { roleId: UserType.Editor, name: "Editor", disabled: !isEditor},
        { roleId: UserType.Admin, name: "Admin", disabled: !isAdmin}
      ],
      noSubjectDialogOpen: false,
    };
    if (userId) {
      axios.get(
        `${process.env.REACT_APP_BACKEND_HOST}/user/${userId}`, {withCredentials: true}
      ).then(res => {
        const user = res.data as UserProfile;

        user.roles = res.data.roles.map((role: UserRoleItem) => role.roleId);
        if (!user.email) {
          user.email = '';
        }
        if (!user.firstName) {
          user.firstName = '';
        }
        if (!user.lastName) {
          user.lastName = '';
        }
        if (!user.roles) {
          user.roles = [];
        }
        if (!user.subjects) {
          user.subjects = [];
        }
        this.setState({...this.state, user: res.data});
      })
      .catch(error => {
        alert('Can`t get user profile');
      });
    }

    axios.get(
      process.env.REACT_APP_BACKEND_HOST + '/subjects', {withCredentials: true}
    ).then(res => {
      this.setState({...this.state, subjects: res.data });
    })
    .catch(error => {
      alert('Can`t get bricks');
    });
  }

  saveStudentProfile(user: UserProfile) {
    const userToSave = {} as any;
    this.prepareUserToSave(userToSave, user);
    userToSave.roles = user.roles;

    if (!user.subjects || user.subjects.length === 0) {
      this.setState({...this.state, noSubjectDialogOpen: true});
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
      userToSave.subjects = user.subjects.map(s => s.id);
    }
  }

  saveUserProfile() {
    const {user} = this.state;
    if (this.state.isStudent) {
      this.saveStudentProfile(user);
      return;
    }
    const userToSave = { roles: user.roles } as any;
    this.prepareUserToSave(userToSave, user)

    if (!user.subjects || user.subjects.length === 0) {
      this.setState({...this.state, noSubjectDialogOpen: true});
      return;
    }

    this.save(userToSave);
  }

  save(userToSave: any) {
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user`, {...userToSave}, {withCredentials: true}
    ).then(res => {
      if (res.data === 'OK') {
        alert('Profile saved');
      }
    }).catch(error => {
      alert('Can`t save user profile');
    });
  }

  logout() {
    this.props.logout();
    this.props.history.push('/choose-user');
  }

  handleLogoutOpen() {
    this.setState({...this.state, logoutDialogOpen: true})
  }

  handleLogoutClose() {
    this.setState({...this.state, logoutDialogOpen: false})
  }

  handleSubjectDialogClose() {
    this.setState({...this.state, noSubjectDialogOpen: false})
  }

  creatingBrick() {
    this.props.forgetBrick();
    this.props.history.push('/build/new-brick/subject');
  }

  showDropdown() {
    this.setState({...this.state, dropdownShown: true});
  }

  hideDropdown() {
    this.setState({...this.state, dropdownShown: false});
  }

  onFirstNameChanged(e: any) {
    const {user} = this.state;
    user.firstName = e.target.value;
    this.setState({...this.state});
  }

  onLastNameChanged(e: any) {
    const {user} = this.state;
    user.lastName = e.target.value;
    this.setState({...this.state});
  }

  onEmailChanged(e: any) {
    const {user} = this.state;
    user.email = e.target.value;
    this.setState({...this.state});
  }

  onPasswordChanged(e: any) {
    const {user} = this.state;
    user.password = e.target.value;
    this.setState({...this.state});
  }

  searching(searchString: string) {

  }

  search() { }

  checkUserRole(roleId: number) {
    return this.state.user.roles.some(id => id === roleId);
  }

  toggleRole(roleId: number, disabled: boolean) {
    if (disabled) { return; }
    let index = this.state.user.roles.indexOf(roleId);
    if (index !== -1) {
      this.state.user.roles.splice(index, 1);
    } else {
      this.state.user.roles.push(roleId);
    }
    this.setState({...this.state});
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
        className={`filter-container ${role.disabled ? 'disabled' : ''}`}
        checked={checked}
        onClick={() => this.toggleRole(role.roleId, role.disabled)}
        control={<Radio className="filter-radio" />}
        label={role.name}
      />
    );
  }

  renderRoles() {
    return (
      this.state.roles.map((role: any, i:number) =>
        <Grid item key={i}>
          {this.renderUserRole(role)}
        </Grid>
      )
    );
  }

  onSubjectChange(newValue: any[]) {
    const {user} = this.state;
    user.subjects = newValue;
    this.setState({...this.state, user});
  }

  render() {
    return (
      <div className="user-profile-page">
        <div className="upper-part">
          <PageHeader
            searchPlaceholder="Search by Name, Email or Subject"
            search={() => this.search()}
            searching={(v) => this.searching(v)}
            showDropdown={() => this.showDropdown()}
          />
          <Grid container direction="row">
            <Grid item xs={9}>
              <div className="profile-block">
                <div className="profile-header">NAME</div>
                <div className="save-button-container">
                  <Avatar
                    alt="" src="/feathericons/save-blue.png" className="save-image"
                    onClick={() => this.saveUserProfile()}
                  />
                </div>
                <Grid container direction="row">
                  <Grid container className="profile-image-container" justify="center" alignContent="flex-start">
                    <Avatar src="/images/user.svg" className="profile-image" />
                    <IconButton className="add-image-button">
                      <AddCircleIcon className="add-image-icon"/>
                    </IconButton>
                    <Grid container justify="center" alignContent="center" className="status-container">
                      <FiberManualRecordIcon className="circle-icon"/>
                      <span>Active</span>
                    </Grid>
                  </Grid>
                  <Grid item className="profile-inputs-container">
                    <div>
                      <Grid>
                        <input
                          className="first-name"
                          value={this.state.user.firstName}
                          onChange={(e: any) => this.onFirstNameChanged(e)}
                          placeholder="Name"
                        />
                        <input
                          className="last-name"
                          value={this.state.user.lastName}
                          onChange={(e: any) => this.onLastNameChanged(e)}
                          placeholder="Surname"
                        />
                      </Grid>
                      <input
                        type="email"
                        value={this.state.user.email}
                        onChange={(e: any) => this.onEmailChanged(e)}
                        placeholder="username@domain.com"
                      />
                      <input
                        type="password"
                        value={this.state.user.password}
                        onChange={(e: any) => this.onPasswordChanged(e)}
                        placeholder="* * * * * * * * * * *"
                      />
                    </div>
                  </Grid>
                  <Grid container justify="center" alignContent="flex-start" className="profile-roles-container">
                    <div className="roles-title">ROLES</div>
                    <Grid container className="roles-box">
                      { this.renderRoles()}
                    </Grid>
                  </Grid>
                </Grid>
                <SubjectAutocomplete
                  selected={this.state.user.subjects}
                  onSubjectChange={(subjects) => this.onSubjectChange(subjects)}
                />
                <Grid container direction="row" className="big-input-container">
                  <textarea placeholder="Write a short bio here..." />
                </Grid>
                <Grid container direction="row">
                </Grid>
              </div>
            </Grid>
            <Grid item xs={3} className="profile-phone-preview">
              <Grid container justify="center" alignContent="center" style={{height: "100%"}}>
                <div>
                  <PhonePreview />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Menu
          className="user-profile-redirect-dropdown"
          keepMounted
          open={this.state.dropdownShown}
          onClose={() => this.hideDropdown()}
        >
          <MenuItem className="first-item menu-item" onClick={() => this.props.history.push('/build/bricks-list')}>
            View All Bricks
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="menu-icon" alt="" src="/images/main-page/glasses-white.png" />
              </div>
            </Grid>
          </MenuItem>
          <MenuItem className="menu-item" onClick={() => this.creatingBrick()}>
            Start Building
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="menu-icon" alt="" src="/images/main-page/create-white.png" />
              </div>
            </Grid>
          </MenuItem>
          {
            this.props.user.roles.some(role => role.roleId === UserType.Admin) ? (
              <MenuItem className="menu-item" onClick={() => this.props.history.push('/build/users')}>
                Manage Users
                <Grid container className="menu-icon-container" justify="center" alignContent="center">
                  <div>
                    <img className="manage-users-icon svg-icon" alt="" src="/images/users.svg" />
                  </div>
                </Grid>
              </MenuItem>
            ) : ""
          }
          <MenuItem className="menu-item" onClick={() => this.handleLogoutOpen()}>
            Logout
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="menu-icon svg-icon logout-icon" alt="" src="/images/log-out.svg" />
              </div>
            </Grid>
          </MenuItem>
        </Menu>
        <Dialog
          open={this.state.logoutDialogOpen}
          onClose={() => this.handleLogoutClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="alert-dialog"
        >
          <div className="logout-dialog-header">
            <div>Are you sure you want</div>
            <div>to log out?</div>
          </div>
          <Grid container direction="row" className="logout-buttons" justify="center">
            <Button className="yes-button" onClick={() => this.logout()}>Yes</Button>
            <Button className="no-button" onClick={() => this.handleLogoutClose()}>No</Button>
          </Grid>
        </Dialog>
        <Dialog
          open={this.state.noSubjectDialogOpen}
          onClose={() => this.handleSubjectDialogClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="delete-brick-dialog"
        >
          <div className="dialog-header">
            <div>You need to assign at least one subject to user</div>
          </div>
          <Grid container direction="row" className="row-buttons" justify="center">
            <Button className="yes-button" onClick={() => this.handleSubjectDialogClose()}>
              Close
            </Button>
          </Grid>
        </Dialog>
      </div>
    )
  }
}

export default connector(UserProfilePage);
