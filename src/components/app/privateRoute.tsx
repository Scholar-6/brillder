import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  if (rest.isAuthenticated) {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  }
  return <Redirect to={{ pathname: '/pre-login' }} />
}

const mapState = (state: any) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  }
}

const connector = connect(mapState)

export default connector(PrivateRoute);
