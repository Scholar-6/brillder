import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { isAuthenticated } from 'model/brick';
import { ReduxCombinedState } from 'redux/reducers';


interface AuthRouteProps {
  exact?: any;
  path: string;
  component: any;
  isAuthenticated: isAuthenticated;
  intendedPath: string;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ component: Component, ...rest }) => {
  if (rest.isAuthenticated === isAuthenticated.None || rest.isAuthenticated === isAuthenticated.False) {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  } else {
    return <Redirect to={{ pathname: rest.intendedPath ?? "/home" }} />;
  }
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  intendedPath: state.auth.intendedPath,
});

const connector = connect(mapState)

export default connector(AuthRoute);
