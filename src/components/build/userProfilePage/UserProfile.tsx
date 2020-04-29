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
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import authActions from 'redux/actions/auth';
import { User, UserType, UserStatus } from 'model/user';
import PhonePreview from '../baseComponents/phonePreview/PhonePreview';
import { Subject } from 'model/brick';


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

interface BackToWorkProps {
  user: User,
  history: any;
  match: any;
  forgetBrick(): void;
  logout(): void;
}

interface BackToWorkState {
  user: User;
  subjects?: Subject[];
  searchString: string;
  isSearching: boolean;
  logoutDialogOpen: boolean;
  deleteDialogOpen: boolean;
  dropdownShown: boolean;
  roles: any[];
}

class BackToWorkPage extends Component<BackToWorkProps, BackToWorkState> {
  constructor(props: BackToWorkProps) {
    super(props)
    const {userId} = props.match.params;
    this.state = {
      user: {
        id: -1,
        firstName: '',
        lastName: '',
        type: 0,
        tutorialPassed: false,
        email: '',
        roles: [],
        subjects: [],
        status: UserStatus.Pending,
      },
      logoutDialogOpen: false,
      deleteDialogOpen: false,
      searchString: '',
      isSearching: false,
      dropdownShown: false,
      roles: [
        { name: "Student"},
        { name: "Teacher"},
        { name: "Builder"},
        { name: "Editor"},
        { name: "Admin"}
      ]
    };
    if (userId) {
      axios.get(
        `${process.env.REACT_APP_BACKEND_HOST}/user/${userId}`, {withCredentials: true}
      ).then(res => {
        const user = res.data as User;
        if (!user.email) {
          user.email = '';
        }
        if (!user.firstName) {
          user.firstName = '';
        }
        if (!user.lastName) {
          user.lastName = '';
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

  saveUserProfile() {
    const {user} = this.state;
    const {id, firstName, lastName, type} = user;
    const userToSave = {
      id, firstName, lastName, type
    };
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user`, {...userToSave}, {withCredentials: true}
    ).then(res => {
      if (res.data === 'OK') {
        
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

  searching(searchString: string) { }

  keySearch(e: any) {
    if (e.keyCode === 13) {
      this.search();
    }
  }

  search() { }

  render() {  
    return (
      <div className="user-profile-page">
        <div className="bricks-upper-part">
          <Grid container direction="row" className="page-header">
            <HomeButton link="/build" />
            <Grid container className="logout-container" item direction="row" style={{width: '92.35vw'}}>
              <Grid container style={{width: '60vw', height: '7vh'}}>
              <Grid item>
                <div className="search-button" onClick={() => this.search()}></div>
              </Grid>
              <Grid item>
                <input
                  className="search-input"
                  onKeyUp={(e) => this.keySearch(e)}
                  onChange={(e) => this.searching(e.target.value)}
                  placeholder="Search by Name, Email or Subject"
                />
              </Grid>
              </Grid>
              <Grid item style={{width: '32.35vw'}}>
                <Grid container direction="row" justify="flex-end">
                  <div className="bell-button"><div></div></div>
                  <div className="more-button" onClick={() => this.showDropdown()}></div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
                      <input
                        value={this.state.user.email}
                        onChange={(e: any) => this.onEmailChanged(e)}
                        placeholder="username@domain.com"
                      />
                      <input placeholder="* * * * * * * * * * *"/>
                    </div>
                  </Grid>
                  <Grid container justify="center" alignContent="flex-start" className="profile-roles-container">
                    <div className="roles-title">ROLES</div>
                    <Grid container className="roles-box">
                      {
                        this.state.roles.map((role: any, i:number) =>
                          <Grid item key={i}>
                            <FormControlLabel
                              className="filter-container"
                              key={i}
                              control={<Radio className="filter-radio" />}
                              label={role.name}
                            />
                          </Grid>
                        )
                      }
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container direction="row" className="big-input-container">
                  <textarea placeholder="Write a short bio here..." />
                </Grid>
                <Grid container direction="row">
                </Grid>
              </div>
            </Grid>
            <Grid item xs={3} className="profile-phone-preview">
              <PhonePreview link="/" />
            </Grid>
          </Grid>
        </div>
        <Menu
          className="back-to-work-redirect-dropdown"
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
      </div>
    )
  }
}

export default connector(BackToWorkPage);
