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
import BrillIconAnimated from "../BrillIconAnimated";
import ReactiveUserCredits from "components/userProfilePage/ReactiveUserCredits";
import ConvertCreditsDialog from "./convertCreditsDialog/ConvertCreditsDialog";

interface MainPageMenuProps {
  history: any;
  user: User;
  notificationExpanded: boolean;


  notifications: Notification[] | null;
  toggleNotification(): void;
  getNotifications(): void;
}

interface HeaderMenuState {
  popupShown: number; // 0 - nothing opened

  convertCreditsOpen: boolean,

  dropdownShown: boolean;
  logoutOpen: boolean;
  width: string;
}

class MainPageMenu extends Component<MainPageMenuProps, HeaderMenuState> {
  pageHeader: React.RefObject<any>;

  constructor(props: MainPageMenuProps) {
    super(props);

    this.state = {
      popupShown: 0,
      convertCreditsOpen: false,
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
    const {user} = this.props;
    let noCredits = false;
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


    if (user.freeAttemptsLeft === 0) {
      noCredits = true;
      className += " menu-without-credits";
    }

    return (
      <div className={className} ref={this.pageHeader}>
        <div className="menu-buttons">
          <BrillIconAnimated popupShown={this.state.popupShown === 2} onClick={() => {
            if (this.state.popupShown === 2) {
              this.setState({popupShown: 0});
            } else {
              this.setState({popupShown: 2});
            }
          }} />
          {user.library ? <div /> :
          <div className="header-credits-container">
            <ReactiveUserCredits popupShown={this.state.popupShown === 1} onClick={() => {
              if (this.state.popupShown === 1) {
                this.setState({popupShown: 0});
              } else {
                this.setState({popupShown: 1});
              }
            }} className="desktop-credit-coins" history={this.props.history} />
          </div>}
          <BellButton notificationCount={notificationCount} onClick={this.props.toggleNotification} />
          <MoreButton onClick={() => this.showDropdown()} />
        </div>
        {noCredits && <div className="no-credits-container">
            <div className="text-container-cd43">Uh-oh! Looks like you’re our of credits. To keep playing, convert some of your brills.</div>
            <div className="flex-center">
              <div className="btn green flex-center" onClick={() => this.setState({convertCreditsOpen: true})}>
                Convert Brills
              </div>
            </div>
          </div>
        }
        <MenuDropdown
          dropdownShown={this.state.dropdownShown}
          hideDropdown={this.hideDropdown.bind(this)}
          user={user}
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
        <ConvertCreditsDialog
          isOpen={this.state.convertCreditsOpen}
          close={() => this.setState({convertCreditsOpen: false})}
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
export default connector(MainPageMenu);
