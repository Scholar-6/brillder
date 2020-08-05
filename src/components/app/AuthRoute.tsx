import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { isAuthenticated } from 'model/brick';
import { UserLoginType } from 'model/auth';
import { ReduxCombinedState } from 'redux/reducers';


interface AuthRouteProps {
  exact?: any;
  path: string;
  component: any;
  isAuthenticated: isAuthenticated;
  userType: UserLoginType;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ component: Component, ...rest }) => {
  if (rest.isAuthenticated === isAuthenticated.None || rest.isAuthenticated === isAuthenticated.False) {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  } else {
    if (rest.userType === UserLoginType.Student) {
      return <Redirect to={{ pathname: '/play/dashboard' }} />
    } else {
      return <Redirect to={{ pathname: '/home' }} />
    }
  }
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  userType: state.auth.userType
})

const connector = connect(mapState)

export default connector(AuthRoute);
