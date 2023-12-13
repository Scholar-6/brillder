import React from 'react';
import { Hidden } from '@material-ui/core';
import { connect } from 'react-redux';
import { Input } from "@material-ui/core";
import { isIPad13, isMobile, isTablet } from 'react-device-detect';

import { ReduxCombinedState } from "redux/reducers";
import userActions from "redux/actions/user";
import { updateUser } from 'services/axios/user';
import { User } from 'model/user';
import map from 'components/map';
import { isPhone } from 'services/phone';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import BasePhonePreview from 'components/baseComponents/BasePhonePreview';
import LabelTyping from 'components/baseComponents/LabelTyping';
import { isStudentPreference } from 'components/services/preferenceService';
import { GetActivateUrl } from 'localStorage/login';


interface InputState {
  value: string;
  valid: boolean | null;
}

enum AnimationStep {
  PageLoaded = 1,
  TitleFinished,
  FormShowed,
}

interface UsernamePageProps {
  history: any;

  user: User;
  getUser(): Promise<User>;
}

const MobileTheme = React.lazy(() => import('./themes/UsernamePageMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/UsernamePageTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/UsernamePageDesktopTheme'));

const UsernamePage: React.FC<UsernamePageProps> = props => {
  const { user } = props;

  const [animationStep, setStep] = React.useState(AnimationStep.PageLoaded);
  const [submited, setSubmited] = React.useState(null as boolean | null);
  const [firstName, setFirstName] = React.useState({ value: user.firstName ? user.firstName : '', valid: null } as InputState);
  const [lastName, setLastName] = React.useState({ value: user.lastName ? user.lastName : '', valid: null } as InputState);

  const validate = () => {
    let valid = true;
    if (!firstName.value) {
      valid = false;
      setFirstName({ ...firstName, valid: false });
    }

    if (!lastName.value) {
      valid = false;
      setLastName({ ...lastName, valid: false });
    }

    return valid;
  }

  const submit = async () => {
    const valid = validate();
    if (!valid) {
      return;
    }

    const userToSave = {
      id: user.id,
      roles: user.roles.map(r => r.roleId),
      email: user.email,
      firstName: firstName.value,
      lastName: lastName.value
    } as any;

    const saved = await updateUser(userToSave);

    // after saving user and getting user added some delay to prevent bugs
    setTimeout(async () => {
      if (saved) {

        await props.getUser();
        const { history } = props;

        if (isStudentPreference(user)) {
          var url = GetActivateUrl();
          if (url) {
            const dd = '/' + url.split('/').slice(3).join('/');
            history.push(dd);
          } else {
            history.push(map.MainPage + '?newStudent=true');
          }
        } else {
          history.push(map.SelectSubjectPage);
        }
        //UnsetActivateUrl();
      } else {
        //this.props.requestFailed("Can`t save user profile");
      }
    }, 50)
  }

  const renderEditButton = () => {
    if (!submited) {
      return <div />
    }
    return <SpriteIcon name="edit-outline" className="back-to-type" onClick={() => {
      setSubmited(null);
    }} />
  }

  const clear = () => {
    setSubmited(null);
  }

  const checkValid = () => {
    if (lastName.value && firstName.value) {
      return true;
    }
    return false;
  }

  return (
    <React.Suspense fallback={<></>}>
      {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
      <div className="username-page">
        <form>
          <div>
            {isPhone() && <div className="wef-user-icon-container flex-center"><SpriteIcon name="user" /></div>}
            <h1>
              <LabelTyping
                start={true} value="Please enter your full name."
                onFinish={() => setStep(AnimationStep.TitleFinished)}
              />
            </h1>
            <div className={`inputs-box ${animationStep >= AnimationStep.TitleFinished ? 'shown hidden' : 'hidden'}`}>
              <Input
                value={firstName.value}
                className={firstName.valid === false && !firstName.value ? 'invalid' : ''}
                onChange={e => {
                  setFirstName({ ...firstName, value: e.target.value });
                  clear();
                }}
                placeholder="First Name" />
              {renderEditButton()}
            </div>
            <div className={`inputs-box ${animationStep >= AnimationStep.TitleFinished ? 'shown hidden' : 'hidden'}`}>
              <Input
                value={lastName.value}
                className={lastName.valid === false && !lastName.value ? 'invalid' : ''}
                onChange={e => {
                  setLastName({ ...lastName, value: e.target.value });
                  clear();
                }}
                placeholder="Last Name" />
              {renderEditButton()}
            </div>
            <div className={animationStep >= AnimationStep.TitleFinished ? 'shown hidden' : 'hidden'}>
              <div className="submit-button" >
                <button type="button" onClick={submit} className={checkValid() ? 'valid' : 'invalid'}>
                  Save
                  <SpriteIcon name="feather-cloud-upload" />
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="blue-right-block"></div>
        {!isPhone() && <Hidden only={['xs', 'sm']}>
          <div className="proposal-phone-preview phone-username-preview">
            <BasePhonePreview>
              <div className="only-icon-container">
                <div className="icon-container">
                  <SpriteIcon name="user" />
                </div>
              </div>
            </BasePhonePreview>
          </div>
        </Hidden>}
      </div>
    </React.Suspense>
  );
};

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(mapState, mapDispatch)(UsernamePage);
