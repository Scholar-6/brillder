import React from 'react';
import { Route, Redirect } from "react-router-dom";
// @ts-ignore
import { connect } from 'react-redux';

import actions from '../../redux/actions/auth';
import userActions from '../../redux/actions/user';
import { isAuthenticated } from 'model/brick';
import { User, UserType } from 'model/user';


interface StudentRouteProps {
  component: any,
  isAuthenticated: isAuthenticated,
  user: User,
  getUser():void,
  isAuthorized():void,
}

const StudentRoute: React.FC<StudentRouteProps> = ({ component: Component, user, ...rest }) => {
  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!user) {
      rest.getUser();
      return <div>...Getting User...</div>
    }
    if (user.type === UserType.Student || user.type === UserType.Admin || user.type === UserType.Builder || user.type === UserType.Editor) {
      return <Route {...rest} render={(props) => <Component {...props} />} />;
    } else {
      return <div>...Forbidden...</div>
    }
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

export default connector(StudentRoute);
