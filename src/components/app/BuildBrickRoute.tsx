import React from 'react';
import { Route, Redirect } from "react-router-dom";
import queryString from 'query-string';
// @ts-ignore
import { connect } from 'react-redux';
import actions from '../../redux/actions/auth';
import userActions from '../../redux/actions/user';
import { isAuthenticated } from 'model/brick';
import { User, UserType } from 'model/user';
import {setBrillderTitle} from 'components/services/titleService';
import { ReduxCombinedState } from 'redux/reducers';


interface BuildRouteProps {
  component: any,
  isAuthenticated: isAuthenticated,
  user: User,
  location: any,
  getUser():void,
  isAuthorized():void,
}

const BuildBrickRoute: React.FC<BuildRouteProps> = ({ component: Component, ...rest }) => {
  const values = queryString.parse(rest.location.search);
  setBrillderTitle();

  if (values.msg === 'USER_IS_NOT_ACTIVE') {
    return <Redirect to="/sign-up-success" />
  }
  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!rest.user) {
      rest.getUser();
      return <div>...Getting User...</div>
    }
    const isBuilder = rest.user.roles.some(role => {
      const {roleId} = role;
      return roleId === UserType.Builder || roleId === UserType.Editor || roleId === UserType.Admin;
    });
    if (isBuilder) {
      return <Route {...rest} render={(props) => <Component {...props} />} />;
    }
    const isStudent = rest.user.roles.some(role => role.roleId === UserType.Student);
    if (isStudent) {
      return <Redirect to="/play" />
    }
    return <Redirect to="/" />
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized()
    return <div className="page-loader">...Checking rights...</div>
  } else {
    return <Redirect to="/choose-login" />
  }
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.user.user,
})

const mapDispatch = (dispatch: any) => ({
  isAuthorized: () => dispatch(actions.isAuthorized()),
  getUser: () => dispatch(userActions.getUser()),
})

const connector = connect(mapState, mapDispatch)

export default connector(BuildBrickRoute);
