import React, { Component } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Grid } from "@material-ui/core";

import PageHeader from "components/baseComponents/pageHeader/PageHeader";
import { User, UserType } from "model/user";
import LogoutDialog from "components/baseComponents/logoutDialog/LogoutDialog";

interface UserMenuProps {
  history: any;
  user: User;
  forgetBrick(): void;
}

interface UserMenuState {
  dropdownShown: boolean;
  logoutOpen: boolean;
}

class UserProfileMenu extends Component<UserMenuProps, UserMenuState> {
  constructor(props: UserMenuProps) {
    super(props);

    this.state = {
      dropdownShown: false,
      logoutOpen: false,
    };
  }

  showDropdown() {
    this.setState({ ...this.state, dropdownShown: true });
  }

  hideDropdown() {
    this.setState({ ...this.state, dropdownShown: false });
  }

  creatingBrick() {
    this.props.forgetBrick();
    this.props.history.push("/build/new-brick/subject");
  }

  handleLogoutOpen() {
    this.setState({ ...this.state, logoutOpen: true });
  }

  handleLogoutClose() {
    this.setState({ ...this.state, logoutOpen: false });
  }

  render() {
    return (
      <div>
        <PageHeader
          searchPlaceholder="Search by Name, Email or Subject"
          search={() => {}}
          searching={(v: string) => {}}
          showDropdown={() => this.showDropdown()}
        />
        <Menu
          className="menu-dropdown"
          keepMounted
          open={this.state.dropdownShown}
          onClose={() => this.hideDropdown()}
        >
          <MenuItem
            className="first-item menu-item"
            onClick={() => this.props.history.push("/play/dashboard")}
          >
            View All Bricks
            <Grid
              container
              className="menu-icon-container"
              justify="center"
              alignContent="center"
            >
              <div>
                <img
                  className="menu-icon"
                  alt=""
                  src="/images/main-page/glasses-white.png"
                />
              </div>
            </Grid>
          </MenuItem>
          <MenuItem className="menu-item" onClick={() => this.creatingBrick()}>
            Start Building
            <Grid
              container
              className="menu-icon-container"
              justify="center"
              alignContent="center"
            >
              <div>
                <img
                  className="menu-icon"
                  alt=""
                  src="/images/main-page/create-white.png"
                />
              </div>
            </Grid>
          </MenuItem>
          <MenuItem className="menu-item" onClick={() => this.props.history.push('/back-to-work')}>
            Back To Work
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="back-to-work-icon" alt="" src="/images/main-page/backToWork-white.png" />
              </div>
            </Grid>
          </MenuItem>
          {this.props.user.roles.some(
            (role) => role.roleId === UserType.Admin
          ) ? (
            <MenuItem
              className="menu-item"
              onClick={() => this.props.history.push("/users")}
            >
              Manage Users
              <Grid
                container
                className="menu-icon-container"
                justify="center"
                alignContent="center"
              >
                <div>
                  <img
                    className="manage-users-icon svg-icon"
                    alt=""
                    src="/images/users.svg"
                  />
                </div>
              </Grid>
            </MenuItem>
          ) : (
            ""
          )}
          <MenuItem
            className="menu-item"
            onClick={() => this.handleLogoutOpen()}
          >
            Logout
            <Grid
              container
              className="menu-icon-container"
              justify="center"
              alignContent="center"
            >
              <div>
                <img
                  className="menu-icon svg-icon logout-icon"
                  alt=""
                  src="/images/log-out.svg"
                />
              </div>
            </Grid>
          </MenuItem>
        </Menu>
        <LogoutDialog
          isOpen={this.state.logoutOpen}
          close={this.handleLogoutClose}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default UserProfileMenu;
