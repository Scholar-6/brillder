import React from 'react';
import { connect } from 'react-redux';

import './SixthformLoginPage.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import userActions from 'redux/actions/user';
import { User } from 'model/user';
import { Route, Switch } from 'react-router-dom';
import routes from './routes';
import SixthformSignUpEmail from './SixthformSignUpEmail';
import SixthformSignUp from './SixthformSignUp';


interface Props {
  loginSuccess(user: User): void;
  getUser(): Promise<User>;
}

const SixthformAuth: React.FC<Props> = (props) => {
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
          </Switch>
        </div>
      </div>
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

const connector = connect(null, mapDispatch)

export default connector(SixthformAuth);
