import React from 'react';
import { Hidden } from '@material-ui/core';
import { connect } from 'react-redux';
import { Input } from "@material-ui/core";


import './UsernamePage.scss';
import { ReduxCombinedState } from "redux/reducers";
import userActions from "redux/actions/user";
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { updateUser } from 'services/axios/user';
import { User, UserType } from 'model/user';
import LabelTyping from 'components/baseComponents/LabelTyping';
import map from 'components/map';

interface InputState {
  value: string;
  valid: boolean | null;
}

interface UsernamePageProps {
  history: any;

  user: User;
  getUser(): Promise<User>;
}

const UsernamePage: React.FC<UsernamePageProps> = props => {
  const { user } = props;

  const [submited, setSubmited] = React.useState(null as boolean | null);
  const [labelFinished, setLabelFinished] = React.useState(false);
  const [username, setUsername] = React.useState('');
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
    let valid = validate();
    if (!valid) {
      return;
    }

    let userToSave = {
      id: user.id,
      roles: user.roles.map(r => r.roleId),
      email: user.email,
      firstName: firstName.value,
      lastName: lastName.value
    } as any;

    const saved = await updateUser(userToSave);

    setSubmited(false);

    if (saved) {
      const updatedUser = await props.getUser();
      setSubmited(true);
      setUsername(updatedUser.username);
    } else {
      //this.props.requestFailed("Can`t save user profile");
    }
  }

  const move = () => {
    if (user.rolePreference && user.rolePreference.roleId === UserType.Student) {
      props.history.push('/home');
    } else {
      props.history.push('/home');
    }
  }

  const renderGetStartedButton = () => {
    return (
      <div className="submit-button" onClick={move}>
        <div>Get Started!</div>
        <SpriteIcon name="arrow-right" className={lastName.value && firstName.value ? 'valid' : 'invalid'} />
      </div>
    );
  }

  const renderGenerateButton = () => {
    return (
      <div className="submit-button" onClick={submit}>
        <div>Generate!</div>
        <SpriteIcon name="arrow-right" className={lastName.value && firstName.value ? 'valid' : 'invalid'} />
      </div>
    );
  }

  const renderUsername = () => {
    return (
      <div>
        <LabelTyping value="Your username will be" className="username-help-label" start={true} onFinish={() => setLabelFinished(true)} />
        <LabelTyping value={username} className="username" start={labelFinished} />
      </div>
    );
  }

  return (
    <div className="username-page">
      <form>
        <div>
          <h1>Generate a username</h1>
          <div className="inputs-box">
            <Input
              value={firstName.value}
              className={firstName.valid === false && !firstName.value ? 'invalid' : ''}
              onChange={e => setFirstName({ ...firstName, value: e.target.value })}
              placeholder="First Name" />
          </div>
          <div className="inputs-box">
            <Input
              value={lastName.value}
              className={lastName.valid === false && !lastName.value ? 'invalid' : ''}
              onChange={e => setLastName({ ...lastName, value: e.target.value })}
              placeholder="Last Name" />
          </div>
          {submited === null ? renderGenerateButton() : renderGetStartedButton()}
        </div>
      </form>
      <div className="blue-right-block"></div>
      <Hidden only={['xs', 'sm']}>
        <div className="proposal-phone-preview phone-username-preview">
          <div className="phone">
            <div className="phone-border">
              <div className="volume volume1"></div>
              <div className="volume volume2"></div>
              <div className="volume volume3"></div>
              <div className="sleep"></div>
              <div className={username ? 'username-screen screen' : 'screen'}>
                <div className={username ? 'username-container': 'only-icon-container'}>
                  <div className="icon-container">
                    <SpriteIcon name="user" />
                  </div>
                  {username && renderUsername()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Hidden>
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(mapState, mapDispatch)(UsernamePage);
