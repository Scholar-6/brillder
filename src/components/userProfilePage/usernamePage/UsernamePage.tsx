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

interface InputState {
  value: string;
  valid: boolean | null;
}

interface UsernamePageProps {
  history: any;

  user: User;
  getUser(): Promise<void>;
}

const UsernamePage: React.FC<UsernamePageProps> = props => {
  const { user } = props;

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
      firstName,
      lastName
    } as any;
    const saved = await updateUser(userToSave);
    if (saved) {
      await props.getUser();
      if (user.rolePreference && user.rolePreference.roleId === UserType.Student) {
        props.history.push('/home');
      } else {
        props.history.push('/terms');
      }
    } else {
      //this.props.requestFailed("Can`t save user profile");
    }
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
          <div className="submit-button" onClick={submit}>
            <div>Get Started!</div>
            <SpriteIcon name="arrow-right" className={lastName.value && firstName.value ? 'valid' : 'invalid'} />
          </div>
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
              <div className="screen">
                <SpriteIcon name="user" />
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
