import React, { Component } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Grid } from "@material-ui/core";

import PageHeader from "components/baseComponents/pageHeader/PageHeader";
import { User, UserType } from "model/user";
import LogoutDialog from "components/baseComponents/logoutDialog/LogoutDialog";
import ReactDOM from "react-dom";
import NotificationPanel from "components/baseComponents/notificationPanel/NotificationPanel";

interface UserMenuProps {
  history: any;
  user: User;
  forgetBrick(): void;
}

interface UserMenuState {
  dropdownShown: boolean;
  notificationsShown: boolean;
  logoutOpen: boolean;
}

class UserProfileMenu extends Component<UserMenuProps, UserMenuState> {
  pageHeader: React.RefObject<any>;

  constructor(props: UserMenuProps) {
    super(props);

    this.state = {
      dropdownShown: false,
      notificationsShown: false,
      logoutOpen: false,
    };

    this.pageHeader = React.createRef();
  }

  showDropdown() {
    this.setState({ ...this.state, dropdownShown: true });
  }

  hideDropdown() {
    this.setState({ ...this.state, dropdownShown: false });
  }

  showNotifications() {
    this.setState({ ...this.state, notificationsShown: true });
  }

  hideNotifications() {
    this.setState({ ...this.state, notificationsShown: false });
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
      <div className="upper-part">
        <PageHeader ref={this.pageHeader}
          searchPlaceholder="Search by Name, Email or Subject"
          search={() => {}}
          searching={(v: string) => {}}
          showDropdown={() => this.showDropdown()}
          showNotifications={() => this.showNotifications()}
        />
        <Menu
          className="menu-dropdown"
          keepMounted
          open={this.state.dropdownShown}
          onClose={() => this.hideDropdown()}>
          <MenuItem
            className="first-item menu-item"
            onClick={() => this.props.history.push("/play/dashboard")}>
            View All Bricks
            <Grid
              container
              className="menu-icon-container"
              justify="center"
              alignContent="center">
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
						onClick={() => this.props.history.push("/users")}>
						Manage Users
						<Grid
							container
							className="menu-icon-container"
							justify="center"
							alignContent="center">
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
            onClick={() => this.handleLogoutOpen()}>
            Logout
            <Grid
              container
              className="menu-icon-container"
              justify="center"
              alignContent="center">
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
        <NotificationPanel
          shown={this.state.notificationsShown}
          handleClose={() => this.hideNotifications()}
          anchorElement={() => ReactDOM.findDOMNode(this.pageHeader.current)}
        />
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
