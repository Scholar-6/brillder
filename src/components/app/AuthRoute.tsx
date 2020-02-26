import React from 'react';
import { Route, Redirect } from "react-router-dom";
// @ts-ignore
import { connect } from 'react-redux';
import { isAuthenticated } from 'model/brick';

const AuthRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  if (rest.isAuthenticated == isAuthenticated.None || rest.isAuthenticated == isAuthenticated.None) {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  } else {
    return <Redirect to={{ pathname: '/build' }} />
  }
}

const mapState = (state: any) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  }
}

const connector = connect(mapState)

export default connector(AuthRoute);
