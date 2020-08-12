import React, { Component } from "react";
import PageHeader from "./PageHeader";
import { User } from "model/user";
import LogoutDialog from "../logoutDialog/LogoutDialog";

import ReactDOM from 'react-dom';
import NotificationPanel from "components/baseComponents/notificationPanel/NotificationPanel";

import MenuDropdown from './MenuDropdown';

export enum PageEnum {
  None,
  BackToWork,
  ViewAll,
  ManageUsers,
  MainPage,
  Play
}

interface HeaderMenuProps {
  history: any;
  user: User;
  placeholder?: string;
  page: PageEnum;
  isMobileHidden?: boolean;
  search(): void;
  searching(v: string): void;
}

interface HeaderMenuState {
  dropdownShown: boolean;
  notificationsShown: boolean;
  logoutOpen: boolean;
}

class PageHeadWithMenu extends Component<HeaderMenuProps, HeaderMenuState> {
  pageHeader: React.RefObject<any>;

  constructor(props: HeaderMenuProps) {
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

  handleLogoutOpen() {
    this.setState({ ...this.state, logoutOpen: true });
  }

  handleLogoutClose() {
    this.setState({ ...this.state, logoutOpen: false });
  }

  render() {
    let placeholder = "Search Subjects, Topics, Titles & more";
    if (this.props.placeholder) {
      placeholder = this.props.placeholder;
    }
    return (
      <div>
        <PageHeader ref={this.pageHeader}
          searchPlaceholder={placeholder}
          search={() => this.props.search()}
          searching={(v: string) => this.props.searching(v)}
          showDropdown={() => this.showDropdown()}
          showNotifications={() => this.showNotifications()}
        />
        <MenuDropdown
          dropdownShown={this.state.dropdownShown}
          hideDropdown={() => this.hideDropdown()}
          user={this.props.user}
          page={this.props.page}
          history={this.props.history}
          onLogout={() => this.handleLogoutOpen()}
          forgetBrick={() => {}}
        />
        <NotificationPanel
          history={this.props.history}
          shown={this.state.notificationsShown}
          handleClose={() => this.hideNotifications()}
          anchorElement={() => ReactDOM.findDOMNode(this.pageHeader.current)}
        />
        <LogoutDialog
          isOpen={this.state.logoutOpen}
          close={() => this.handleLogoutClose()}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default PageHeadWithMenu;
