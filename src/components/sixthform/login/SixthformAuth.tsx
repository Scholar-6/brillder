import React from 'react';
import { connect } from 'react-redux';

import './SixthformLoginPage.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import userActions from 'redux/actions/user';
import { User } from 'model/user';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from './routes';
import SixthformSignUpEmail from './SixthformSignUpEmail';
import SixthformSignUp from './SixthformSignUp';
import { ReduxCombinedState } from 'redux/reducers';
import map from 'components/map';
import { isAuthenticated } from 'model/brick';
import SixthformSignIn from './SixthformSignIn';


interface Props {
  user: User;
  isAuthenticated: isAuthenticated;
  getUser(): Promise<User>;
}

const SixthformAuth: React.FC<Props> = (props) => {
  if (props.isAuthenticated === isAuthenticated.None || props.isAuthenticated === isAuthenticated.False) {
    return (
      <div className="LoginSixthformPage">
        <div>
          <div className="popup-container">
            <div className="first-column relative">
              <SpriteIcon name="scholar6-white-logo" className="white-logo-r23" />
              <SpriteIcon name="red-shape-icon-r1" className="red-shape-r23" />
              <img src="/images/login-background.png" />
              <div className="study-text font-30">
                What will you study in<br /> the sixth form?
              </div>
            </div>
            <Switch>
              <Route path={routes.SignUp}>
                <SixthformSignUp />
              </Route>
              <Route path={routes.EmailSignUp}>
                <SixthformSignUpEmail />
              </Route>
              <Route path={routes.SignIn}>
                <SixthformSignIn />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
  return <Redirect to={map.SixthformChoices} />;
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  isAuthenticated: state.auth.isAuthenticated,
});
const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

const connector = connect(mapState, mapDispatch)

export default connector(SixthformAuth);
