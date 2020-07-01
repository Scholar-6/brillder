import React from 'react';
import { Redirect } from "react-router-dom";
import queryString from 'query-string';
// @ts-ignore
import { connect } from 'react-redux';

import actions from '../../redux/actions/auth';
import userActions from '../../redux/actions/user';
import { isAuthenticated } from 'model/brick';
import { User, UserType } from 'model/user';
import { UserLoginType } from 'model/auth';
import { ReduxCombinedState } from 'redux/reducers';

interface AuthRedirectProps {
  isAuthenticated: isAuthenticated;
  isRedirected: boolean;
  user: User;
  location: any;
  getUser():void;
  isAuthorized():void;
  redirected():void;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ user, ...props }) => {
  if (props.isAuthenticated === isAuthenticated.True) {
    if (!user) {
      props.getUser();
      return <div>...Getting User...</div>
    }

    if (!props.isRedirected) {
      if(!user.firstName || !user.lastName) {
        props.redirected();
        return <Redirect to="/build/user-profile" />
      }
    }

    const values = queryString.parse(props.location.search)
    if (values.userType) {
      let userType:UserLoginType = parseInt(values.userType as string);
      if (userType === UserLoginType.Student) {
        return <Redirect to="/play/dashboard" />
      } else if (userType === UserLoginType.Builder) {
        return <Redirect to="/build" />
      }
    }
    let path = props.location.pathname;

    let isAdmin = user.roles.some((role:any) => role.roleId === UserType.Admin);

    if (isAdmin) {
      if (path === '/build') {
        return <Redirect to="/build" />
      } else if (path === '/play') {
        return <Redirect to="/play/dashboard" />
      }
    }

    let canBuild = user.roles.some((role:any) => 
      role.roleId === UserType.Admin || role.roleId === UserType.Builder || role.roleId === UserType.Editor
    );

    if (canBuild) {
      return <Redirect to="/build" />
    } else {
      return <Redirect to="/play/dashboard" />
    }
  } else if (props.isAuthenticated === isAuthenticated.None) {
    props.isAuthorized();
    return <div>...Checking rights...</div>
  } else {
    return <Redirect to="/choose-user" />
  }
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isRedirected: state.auth.isRedirected,
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  redirected: () => dispatch(actions.redirectedToProfile()),
  isAuthorized: () => dispatch(actions.isAuthorized()),
  getUser: () => dispatch(userActions.getUser()),
});

const connector = connect(mapState, mapDispatch)

export default connector(AuthRedirect);
