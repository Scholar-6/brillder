import React, { Component } from "react";
import { User } from "model/user";
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'


import { ReduxCombinedState } from 'redux/reducers';
import notificationActions from 'redux/actions/notifications';
import { Notification } from 'model/notifications';

import './MainPageMenu.scss';
import LogoutDialog from "../logoutDialog/LogoutDialog";
import MainNotificationPanel from "components/baseComponents/notificationPanel/MainNotificationPanel";
import MenuDropdown from './MenuDropdown';
import BellButton from './bellButton/BellButton';
import MoreButton from './MoreButton';
import { PageEnum } from './PageHeadWithMenu';
import { isMobile } from "react-device-detect";
import NotificationPanel from "../notificationPanel/NotificationPanel";

interface MainPageMenuProps {
  history: any;
  user: User;
  notificationExpanded: boolean;

  notifications: Notification[] | null;
  toggleNotification(): void;
  getNotifications(): void;
}

interface HeaderMenuState {
  dropdownShown: boolean;
  logoutOpen: boolean;
  width: string;
}

class PageHeadWithMenu extends Component<MainPageMenuProps, HeaderMenuState> {
  pageHeader: React.RefObject<any>;

  constructor(props: MainPageMenuProps) {
    super(props);

    this.state = {
      dropdownShown: false,
      logoutOpen: false,
      width: '16vw'
    };

    this.pageHeader = React.createRef();
  }

  showDropdown() {
    if (this.props.notificationExpanded) {
      this.props.toggleNotification();
    }
    this.setState({ ...this.state, dropdownShown: true });
  }

  hideDropdown() {
    this.setState({ ...this.state, dropdownShown: false });
  }

  handleLogoutOpen() {
    this.setState({ ...this.state, logoutOpen: true });
  }

  handleLogoutClose() {
    this.setState({ ...this.state, logoutOpen: false });
  }

  render() {
    let notificationCount = 0;
    if (!this.props.notifications) {
      this.props.getNotifications();
    } else {
      notificationCount = this.props.notifications.length;
    }

    let className = "main-page-menu";
    if (this.state.dropdownShown) {
      className += " menu-expanded";
    } else if (this.props.notificationExpanded) {
      className += " notification-expanded"
    }

    const renderBrills = () => {
      const {brills} = this.props.user;
      if (brills && brills > 0) {
        return brills;
      }
      return '';
    }

    return (
      <div className={className} ref={this.pageHeader}>
        <div className="menu-buttons">
          <div className="brill-intro-container">
            <div className="brills-number">{renderBrills()}</div>
            <img alt="" className="brills-icon" src="/images/Brill-B.svg" />
          </div>
          <BellButton notificationCount={notificationCount} onClick={this.props.toggleNotification} />
          <MoreButton onClick={() => this.showDropdown()} />
        </div>
        <MenuDropdown
          dropdownShown={this.state.dropdownShown}
          hideDropdown={this.hideDropdown.bind(this)}
          user={this.props.user}
          page={PageEnum.MainPage}
          history={this.props.history}
          onLogout={this.handleLogoutOpen.bind(this)}
        />
        {isMobile ? (
          <NotificationPanel
            history={this.props.history}
            shown={this.props.notificationExpanded}
            handleClose={this.props.toggleNotification}
            anchorElement={() => ReactDOM.findDOMNode(this.pageHeader.current)}
          />
        ) : (
          <MainNotificationPanel
            history={this.props.history}
            shown={this.props.notificationExpanded}
            handleClose={this.props.toggleNotification}
            anchorElement={() => ReactDOM.findDOMNode(this.pageHeader.current)}
          />
        )}
        <LogoutDialog
          isOpen={this.state.logoutOpen}
          close={() => this.handleLogoutClose()}
          history={this.props.history}
        />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
    notifications: state.notifications.notifications
  });
  
  const mapDispatch = (dispatch: any) => ({
    getNotifications: () => dispatch(notificationActions.getNotifications())
  });

  
const connector = connect(mapState, mapDispatch, null, { forwardRef: true });
export default connector(PageHeadWithMenu);
