import React from 'react';
import { Radio } from '@material-ui/core';
import { connect } from 'react-redux';

import './UserPreferencePage.scss';
import { ReduxCombinedState } from 'redux/reducers';
import userActions from 'redux/actions/user';
import map from 'components/map';
import { RolePreference, User, UserType } from 'model/user';
import { setUserPreference } from 'services/axios/user';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { isPhone } from 'services/phone';
import { isMobile } from 'react-device-detect';
import { hideZendesk } from 'services/zendesk';
import TeachButton from 'components/mainPage/components/TeachButton';
import TypingLabel from 'components/baseComponents/TypingLabel';

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
  const [preference, setPreference] = React.useState(props.user.rolePreference?.roleId ?? props.defaultPreference ?? RolePreference.Student);

  const handleChange = async (roleId: RolePreference, disabled: boolean) => {
    if (disabled || !roleId) {
      return;
    }
    setPreference(roleId);
    try {
      await setUserPreference(roleId, true);
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

  if (isPhone()) {
    return (
      <React.Suspense fallback={<></>}>
        <MobileTheme />
        <div className="s-user-preference-page">
          <div className="ef-container">
            <div className="ef-space-before-title" />
            <div className="ef-head-container">
              <h2>Which of the following</h2>
              <h2>best describes you?</h2>
            </div>
            <div className="ef-space-after-title" />
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
                <RadioContainer roleId={RolePreference.Institution} name="Institution">
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
  }

  const RoleBox: React.FC<{ roleId: RolePreference | UserType, className: string }> = ({ roleId, className, children }) => {
    return <div className={"role-box " + className} onClick={async () => {
      await handleChange(roleId as RolePreference, false);
      moveNext();
    }}>
      {children}
    </div>
  }

  let historyMock = {} as any;
  historyMock.push = () => { };

  return (
    <React.Suspense fallback={<></>}>
      {isMobile ? <TabletTheme /> : <DesktopTheme />}
      <div className="s-user-preference-page">
        <div className="ef-container">
          <h1>
            <TypingLabel minTime={20} maxTime={30} onEnd={() => { }} label="Which of the following best describes you?" />
          </h1>
          <div className="ef-flex">
            <RoleBox roleId={RolePreference.Student} className="box1">
              <div className="flex-center">
                <SpriteIcon name="glasses" className="glasses" />
              </div>
              <h2>Student</h2>
              <p>I want to learn,</p>
              <p>receive assignments</p>
              <p>and feedback, or join</p>
              <p>a course.</p>
            </RoleBox>
            <RoleBox roleId={RolePreference.Teacher} className="box2">
              <div className="flex-center file-container">
                <SpriteIcon name="file-plus" />
              </div>
              <h2>Teacher | Tutor</h2>
              <p>I want to assign Brillder</p>
              <p>content and provide</p>
              <p>feedback to my students.</p>
            </RoleBox>
            <RoleBox roleId={RolePreference.Institution} className="box3">
              <div className="flex-center">
                <TeachButton history={historyMock} />
              </div>
              <h2>Institution</h2>
              <p>I want to manage</p>
              <p>classes, students,</p>
              <p>and teachers.</p>
            </RoleBox>
            <RoleBox roleId={RolePreference.Builder} className="box4">
              <div className="flex-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="dd-trowel" viewBox="0 0 570.728 450.691">
                  <path id="Path_140" data-name="Path 140" d="M1186.909,726.115l3.436-10.847L1371.8,492.923l12.378-7.847,10.862-1.178,8.811,1.178,7.179,3.586,8.133,4.261,40.921,41.658,33.37-20.381a17.992,17.992,0,0,0,3.742-4.186,12.5,12.5,0,0,0,1.492-4.791v-12.3l1.252-49.893,2.666-7.273,9.87-11.555,33.362-24.667-1.045-6.87v-9.082l4.609-6.262,7.665-4.425,149.052-80.213,8.425-3.922,7.345-1.288,9.4,1.288,6.973,3.922,3.974,4.286,4.834,5.272,5.449,5.769,4.054,6.93,1.058,7v7.515l-2.177,5.934-2.935,5.041-5.449,6.128L1599.96,428.781l-9.55,5.12-9.706,1.856-8.857-.951-8.045-3.871-6.733-6.733-26.284,18.828-4.193,5.461v73.462h0a25.189,25.189,0,0,1-.979,4.314,7.623,7.623,0,0,1-1.562,2.651l-7.35,5.665-8.115,4.681-113.544,65.971,3.884,5.2,5.861,2.975h7.679l6.7-1.331,79.524-37.7,58.38,53.3,4.563,7.862,1.135,8.009-1.135,6.248-4.563,5.4-7.464,4.959-345.336,78.013h-6.742l-5.486-1.63-3.5-4.191-1.635-6.227" transform="translate(-1186.909 -287.472)" fill="#c43c30"/>
                </svg>
              </div>
              <h2>Builder</h2>
              <p>I want to build and</p>
              <p>submit content for</p>
              <p>paid publication.</p>
            </RoleBox>
          </div>
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
