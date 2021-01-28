import React from 'react';
import { Hidden } from '@material-ui/core';
import { connect } from 'react-redux';

import './UsernamePage.scss';
import { ReduxCombinedState } from "redux/reducers";
import userActions from "redux/actions/user";
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { updateUser } from 'services/axios/user';
import { User } from 'model/user';

interface UsernamePageProps {
  history: any;

  user: User;
  getUser(): Promise<void>;
}

const UsernamePage: React.FC<UsernamePageProps> = props => {
  const {user} = props;

  const [firstName, setFirstName] = React.useState(user.firstName ? user.firstName : '');
  const [lastName, setLastName] = React.useState(user.lastName ? user.lastName : '');

  const submit = async () => {
    let userToSave = {
      id: user.id,
      roles: user.roles.map(r => r.roleId),
      firstName,
      lastName
    } as any;
    const saved = await updateUser(userToSave);
    if (saved) {
      await props.getUser();
      props.history.push('/terms');
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
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
          </div>
          <div className="submit-button" onClick={submit}>
            <div>Get Started!</div>
            <SpriteIcon name="arrow-right" />
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
