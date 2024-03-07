import React from 'react';
import { Route, Redirect, useLocation } from "react-router-dom";
import { connect } from 'react-redux';

import actions from 'redux/actions/auth';
import userActions from 'redux/actions/user';
import { isAuthenticated } from 'model/brick';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import LoginSixthformRedirect from 'components/baseComponents/LoginSixthformRedirect';


interface AllUsersRouteProps {
  path: string;
  component: any;
  isAuthenticated: isAuthenticated;
  user: User;
  getUser(): void;
  isAuthorized(): void;
}

const AllUsersRouteSixthform: React.FC<AllUsersRouteProps> = ({ component: Component, user, ...rest }) => {
  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!user) {
      rest.getUser();
      return <PageLoader content="...Getting User..." />;
    }
    return <Route {...rest} render={(props) => {
      return <Component {...props} user={user} />
    }} />;
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized();
    return <PageLoader content="...Checking rights..." />;
  } else {
    return <LoginSixthformRedirect />;
  }
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  isAuthorized: () => dispatch(actions.isAuthorized()),
  getUser: () => dispatch(userActions.getUser()),
});

const connector = connect(mapState, mapDispatch);

export default connector(AllUsersRouteSixthform);
