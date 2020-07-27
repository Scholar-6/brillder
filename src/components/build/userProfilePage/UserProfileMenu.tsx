import React, { Component } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import sprite from "../../../assets/img/icons-sprite.svg";
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
      <div>
        <PageHeader ref={this.pageHeader}
          searchPlaceholder="Search by Name, Email or Subject"
          search={() => { }}
          searching={(v: string) => { }}
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
            <span className="menu-text">View All Bricks</span>
            <div className="btn btn-transparent svgOnHover">
              <svg className="svg active">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#glasses"} className="text-white" />
              </svg>
            </div>
          </MenuItem>
          <MenuItem className="menu-item" onClick={() => this.creatingBrick()}>
            <span className="menu-text">Start Building</span>
            <div className="btn btn-transparent svgOnHover">
              <svg className="svg active">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#shovel"} className="text-white" />
              </svg>
            </div>
          </MenuItem>
          <MenuItem className="menu-item" onClick={() => this.props.history.push('/back-to-work')}>
            <span className="menu-text">Back To Work</span>
            <div className="btn btn-transparent svgOnHover">
              <svg className="svg active">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#roller"} className="text-white" />
              </svg>
            </div>
          </MenuItem>
          {this.props.user.roles.some(
            (role) => role.roleId === UserType.Admin
          ) ? (
              <MenuItem className="menu-item" onClick={() => this.props.history.push("/users")}>
                <span className="menu-text">Manage Users</span>
                <div className="btn btn-transparent svgOnHover">
                  <svg className="svg active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#users"} className="text-white" />
                  </svg>
                </div>
              </MenuItem>
            ) : (
              ""
            )}
          <MenuItem className="menu-item" onClick={() => this.handleLogoutOpen()}>
            <span className="menu-text">Logout</span>
            <div className="btn btn-transparent svgOnHover">
              <svg className="svg active">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#logout-thick"} className="text-white" />
              </svg>
            </div>
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
