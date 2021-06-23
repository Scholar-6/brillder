import React from 'react';
import { Radio } from '@material-ui/core';
import { connect } from 'react-redux';

import './UserPreferencePage.scss';
import { ReduxCombinedState } from 'redux/reducers';
import userActions from 'redux/actions/user';
import map from 'components/map';
import { RolePreference, User, UserType } from 'model/user';
import { checkAdmin } from 'components/services/brickService';
import { setUserPreference } from 'services/axios/user';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { isPhone } from 'services/phone';
import { isMobile } from 'react-device-detect';
import { hideZendesk } from 'services/zendesk';

interface UserPreferencePageProps {
  user: User;
  defaultPreference?: UserType;
  history: any;
  getUser(): void;
}

const MobileTheme = React.lazy(() => import('./themes/PreferenceMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/PreferenceTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/PreferenceDesktopTheme'));

const UserPreferencePage: React.FC<UserPreferencePageProps> = props => {
  const isAdmin = checkAdmin(props.user.roles);
  const [preference, setPreference] = React.useState(props.user.rolePreference?.roleId ?? props.defaultPreference ?? UserType.Student);

  const handleChange = async (roleId: RolePreference, disabled: boolean) => {
    if (disabled || !roleId) {
      return;
    }
    setPreference(roleId);
    try {
      await setUserPreference(roleId);
      props.getUser();
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    if (isPhone()) {
      hideZendesk();
    }
  }, []);

  React.useEffect(() => {
    if (preference) {
      handleChange(preference, false);
    }
    /* eslint-disable-next-line */
  }, [props.defaultPreference]);

  const renderRadioButton = (roleId: RolePreference) => {
    return <Radio checked={preference === roleId} value={roleId} />;
  }

  const moveNext = () => {
    if (preference && props.user.rolePreference) {
      props.history.push(map.SetUsername);
    }
  }

  const RadioContainer: React.FC<{ roleId: RolePreference | UserType, name: string }> = ({ roleId, name, children }) => {
    let disabled = false;
    if (!isAdmin && roleId === UserType.Institution) {
      disabled = true;
    }

    let className = 'radio-container';
    if (disabled) {
      className += ' disabled';
    }

    if (preference === roleId) {
      className += ' active';
    }

    return (
      <div className="ef-radio-box">
        <div className={className} onClick={() => handleChange(roleId as RolePreference, disabled)}>
          {renderRadioButton(roleId as RolePreference)}
          <span className="radio-text pointer">{name}</span>
          <div className="ef-label">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <React.Suspense fallback={<></>}>
      {isPhone() ? <MobileTheme /> : isMobile ? <TabletTheme /> : <DesktopTheme />}
      <div className="s-user-preference-page">
        <div className="ef-container">
          {isPhone() && <div className="ef-space-before-title" />}
          {isPhone() ? <div className="ef-head-container">
            <h2>Which of the following</h2>
            <h2>best describes you?</h2>
          </div> : <h2>Which of the following best describes you?</h2>}
          {isPhone() && <div className="ef-space-after-title" />}
          <div className="ef-main-radio-context">
            <div className="ef-flex">
              <RadioContainer roleId={RolePreference.Student} name="Student">
                I want to learn, receive assignments and feedback, or join a course.
              </RadioContainer>
              <RadioContainer roleId={RolePreference.Builder} name="Builder">
                I want to build and submit content for paid publication.
              </RadioContainer>
            </div>
            <div className="ef-flex">
              <RadioContainer roleId={RolePreference.Teacher} name="Teacher / Tutor">
                I want to assign Brillder content and provide feedback to my students.<br />
              </RadioContainer>
              <RadioContainer roleId={UserType.Institution} name="Institution">
                I want to manage classes, students, and teachers.<br />
              </RadioContainer>
            </div>
          </div>
          <button
            type="button"
            className="btn ss-user-preference-next"
            onClick={moveNext}
          >
            Next
            <SpriteIcon name="arrow-right" />
          </button>
        </div>
      </div>
    </React.Suspense>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  defaultPreference: state.auth.defaultPreference
});

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser())
});

const connector = connect(mapState, mapDispatch);

export default connector(UserPreferencePage);
