import React from 'react';
import { Route, Redirect } from "react-router-dom";
// @ts-ignore
import { connect } from 'react-redux';
import actions from '../../redux/actions/auth';
import { isAuthenticated } from 'model/brick';

const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  if (rest.isAuthenticated === isAuthenticated.True) {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized()
    return <div>...Checking rights</div>
  } else {
    return <Redirect to="/choose-user" />
  }
}

const mapState = (state: any) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    isAuthorized: () => dispatch(actions.isAuthorized()),
  }
}

const connector = connect(mapState, mapDispatch)

export default connector(PrivateRoute);
