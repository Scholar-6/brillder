import React from 'react';
import { Grid, Menu } from '@material-ui/core';
import { connect } from 'react-redux';

import { User } from 'model/user';
import { Notification } from 'model/notifications';
import { ReduxCombinedState } from 'redux/reducers';
import notificationActions from 'redux/actions/notifications';

import BrillIconAnimated from 'components/baseComponents/BrillIconAnimated';
import MoreButton from 'components/baseComponents/pageHeader/MoreButton';
import { isAuthenticated } from 'model/assignment';
import BellButton from 'components/baseComponents/pageHeader/bellButton/BellButton';
import MenuDropdown from 'components/baseComponents/pageHeader/MenuDropdown';
import { PageEnum } from 'components/baseComponents/pageHeader/PageHeadWithMenu';
import LogoutDialog from 'components/baseComponents/logoutDialog/LogoutDialog';
import NotificationPanel from 'components/baseComponents/notificationPanel/NotificationPanel';
import NotificationPopup from 'components/baseComponents/notificationPopup/NotificationPopup';
import { isPhone } from 'services/phone';
import ReactDOM from 'react-dom';


interface Props {
  user: User | null;
  history: any;
  isAuthenticated: any;
  notifications: Notification[] | null;
  getNotifications(): void;
}

const TopMenu: React.FC<Props> = (props) => {
  const { user } = props;

  const pageHeader = React.useRef(null);

  const [showNotifications, setShowNotifications] = React.useState(false);
  const [menuDropdown, setMenuDropdown] = React.useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  const notificationCount = props.notifications ? props.notifications.length : 0;

  if (props.isAuthenticated === isAuthenticated.True && !props.notifications) {
    props.getNotifications();
  }

  if (user) {
    return (
      <div className="logout-container" ref={pageHeader}>
        <div className="search-container font-32">
          {user.firstName} Dashboard
        </div>
        {user &&
          <Grid container direction="row" className="action-container">
            <BrillIconAnimated />
            <BellButton
              notificationCount={notificationCount}
              onClick={() => setShowNotifications(true)}
            />
            <MoreButton onClick={() => setMenuDropdown(true)} />
          </Grid>
        }
        {menuDropdown && <MenuDropdown
          dropdownShown={menuDropdown}
          hideDropdown={() => setMenuDropdown(false)}
          user={user}
          page={PageEnum.SixthformOutcomes}
          history={props.history}
          onLogout={() => setLogoutOpen(true)}
        />}
        {props.user &&
          <LogoutDialog
            isOpen={logoutOpen}
            close={() => setLogoutOpen(false)}
            history={props.history}
          />}
        {user &&
          <NotificationPanel
            history={props.history}
            shown={showNotifications}
            handleClose={() => setShowNotifications(false)}
            anchorElement={() => ReactDOM.findDOMNode(pageHeader.current)}
          />}
        {user && !isPhone() &&
          <NotificationPopup
            history={props.history}
            anchorElement={() => ReactDOM.findDOMNode(pageHeader.current)}
          />}
      </div>
    );
  }

  return (
    <div className="logout-container">
      <div className="search-container font-32" />
    </div>
  );
}


const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.user.user,
  notifications: state.notifications.notifications,
});

const mapDispatch = (dispatch: any) => ({
  getNotifications: () => dispatch(notificationActions.getNotifications()),
});

const connector = connect(mapState, mapDispatch);

export default connector(TopMenu);
