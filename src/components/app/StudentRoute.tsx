import React from 'react';
import { Route, Redirect } from "react-router-dom";
// @ts-ignore
import { connect } from 'react-redux';

import actions from '../../redux/actions/auth';
import userActions from '../../redux/actions/user';
import { isAuthenticated } from 'model/brick';
import { User, UserType } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';


interface StudentRouteProps {
  component: any;
  isAuthenticated: isAuthenticated;
  isRedirectedToProfile: boolean;
  user: User;
  getUser():void;
  isAuthorized():void;
}

const StudentRoute: React.FC<StudentRouteProps> = ({ component: Component, user, ...rest }) => {
  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!user) {
      rest.getUser();
      return <div>...Getting User...</div>
    }

    if (!rest.isRedirectedToProfile) {
      if(!user.firstName || !user.lastName) {
        return <Redirect to="/build/user-profile" />
      }
    }
    const {roles} = user;
    let can = roles.some((role: any) => {
      const {roleId} = role
      return roleId === UserType.Student || roleId === UserType.Admin || roleId === UserType.Builder || roleId === UserType.Editor;
    });
    if (can) {
      return <Route {...rest} render={(props) => <Component {...props} />} />;
    } else {
      return <div>...Forbidden...</div>
    }
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized()
    return <div>...Checking rights...</div>
  } else {
    return <Redirect to="/choose-login" />
  }
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isRedirectedToProfile: state.auth.isRedirectedToProfile,
  user: state.user.user,
})

const mapDispatch = (dispatch: any) => ({
  isAuthorized: () => dispatch(actions.isAuthorized()),
  getUser: () => dispatch(userActions.getUser()),
});

const connector = connect(mapState, mapDispatch)

export default connector(StudentRoute);
