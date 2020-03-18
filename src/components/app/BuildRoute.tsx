import React from 'react';
import { Route, Redirect } from "react-router-dom";
// @ts-ignore
import { connect } from 'react-redux';
import actions from '../../redux/actions/auth';
import userActions from '../../redux/actions/user';
import { isAuthenticated } from 'model/brick';


interface BuildRouteProps {
  component: any,
  isAuthenticated: isAuthenticated,
  user: any,
  getUser():void,
  isAuthorized():void,
}

const BuildRoute: React.FC<BuildRouteProps> = ({ component: Component, ...rest }) => {
  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!rest.user) {
      rest.getUser();
      return <div>...Getting User...</div>
    }
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized()
    return <div>...Checking rights...</div>
  } else {
    return <Redirect to="/choose-user" />
  }
}

const mapState = (state: any) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.user.user,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    isAuthorized: () => dispatch(actions.isAuthorized()),
    getUser: () => dispatch(userActions.getUser()),
  }
}

const connector = connect(mapState, mapDispatch)

export default connector(BuildRoute);
