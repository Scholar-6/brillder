import React from 'react';
import { Route, Redirect } from "react-router-dom";
import queryString from 'query-string';
// @ts-ignore
import { connect } from 'react-redux';
import actions from '../../redux/actions/auth';
import userActions from '../../redux/actions/user';
import { isAuthenticated } from 'model/brick';
import { User, UserType } from 'model/user';


interface AdminRouteProps {
  component: any,
  isAuthenticated: isAuthenticated,
  user: User,
  location: any,
  getUser():void,
  isAuthorized():void,
}

const AdminRoute: React.FC<AdminRouteProps> = ({ component: Component, ...rest }) => {
  const values = queryString.parse(rest.location.search);
  if (values.msg === 'USER_IS_NOT_ACTIVE') {
    return <Redirect to="/sign-up-success" />
  }
  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!rest.user) {
      rest.getUser();
      return <div>...Getting User...</div>
    }
    if (rest.user.type === UserType.Student) {
      return <Redirect to="/play" />
    } else if (rest.user.type === UserType.Builder) {
      return <Redirect to="/build" />
    } else if (rest.user.type === UserType.Admin) {
      return <Route {...rest} render={(props) => <Component {...props} />} />;
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

export default connector(AdminRoute);
