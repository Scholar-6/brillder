import React from 'react';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import { CircularProgressbar } from "react-circular-progressbar";
import ReactDOM from 'react-dom';

import { User } from 'model/user';
import { Notification } from 'model/notifications';
import { ReduxCombinedState } from 'redux/reducers';
import notificationActions from 'redux/actions/notifications';

import { isAuthenticated } from 'model/assignment';
import BellButton from 'components/baseComponents/pageHeader/bellButton/BellButton';
import MenuDropdown from './MenuDropdown';
import { PageEnum } from 'components/baseComponents/pageHeader/PageHeadWithMenu';
import LogoutDialog from 'components/baseComponents/logoutDialog/LogoutDialog';
import NotificationPanel from 'components/baseComponents/notificationPanel/NotificationPanel';
import NotificationPopup from 'components/baseComponents/notificationPopup/NotificationPopup';
import { isPhone } from 'services/phone';
import map from 'components/map';
import { SixActivePage } from './SixthformOutcome';
import routes from '../login/routes';


interface Props {
  history: any;
  progress: number;

  activePage: SixActivePage;
  setActivePage(page: SixActivePage): void;

  user: User | null;
  isAuthenticated: any;
  notifications: Notification[] | null;
  getNotifications(): void;
}

const TopMenu: React.FC<Props> = (props) => {
  const { user } = props;

  const { activePage } = props;

  const pageHeader = React.useRef(null);

  const [showNotifications, setShowNotifications] = React.useState(false);
  const [menuDropdown, setMenuDropdown] = React.useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  const notificationCount = props.notifications ? props.notifications.length : 0;

  if (props.isAuthenticated === isAuthenticated.True && !props.notifications) {
    props.getNotifications();
  }

  if (user) {
    let rName = (user.firstName ? user.firstName[0] : '') + (user.lastName[0] ? user.lastName[0] : '');
    return (
      <div className="logout-container" ref={pageHeader}>
        <div className="top-buttons-r32 font-20">
          <div
            className={activePage === SixActivePage.Outcome ? 'active bold' : ''}
            onClick={() => {
              props.setActivePage(SixActivePage.Outcome);
              props.history.push(map.SixthformOutcome);
            }}
          >
            MY OUTCOMES
          </div>
          <div
            className={activePage === SixActivePage.SubjectTasters ? 'active bold' : ''}
            onClick={() => {
              props.setActivePage(SixActivePage.SubjectTasters);
              props.history.push(map.SixthformTaster);
            }}
          >
            SUBJECT TASTERS
          </div>
        </div>
        {user &&
          <Grid container direction="row" className="action-container">
            <div className="circle-container-r32" onClick={() => props.history.push(map.SixthformChoices)}>
              <div className="css-custom-tooltip font-14">
                <div className="triangle" />
                Continue Course Selector survey
              </div>
              <div className="circle-score-r32 font-16 bold">
                {props.progress}%
              </div>
              <CircularProgressbar
                className="circle-progress-first"
                strokeWidth={10}
                counterClockwise={false}
                value={props.progress}
              />
            </div>
            <BellButton
              notificationCount={notificationCount}
              onClick={() => setShowNotifications(true)}
            />
            <div className="menu-btn flex-center bold font-24" onClick={() => setMenuDropdown(true)}>
              {rName}
            </div>
          </Grid>
        }
        {menuDropdown && <MenuDropdown
          dropdownShown={menuDropdown}
          hideDropdown={() => setMenuDropdown(false)}
          page={PageEnum.SixthformOutcomes}
          moveToProfilePage={() => {
            props.history.push(map.SixthformProfile);
            props.setActivePage(SixActivePage.Profile);
          }}
          onLogout={() => setLogoutOpen(true)}
        />}
        {props.user &&
          <LogoutDialog
            isOpen={logoutOpen}
            close={() => setLogoutOpen(false)}
            logoutUrl={routes.SignIn}
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
