import React from 'react';
import { Route, Redirect, useLocation } from "react-router-dom";
import { connect } from 'react-redux';

import actions from 'redux/actions/auth';
import userActions from 'redux/actions/user';
import { isAuthenticated } from 'model/brick';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import map from 'components/map';
import LoginRedirect from 'components/baseComponents/LoginRedirect';


interface AllUsersRouteProps {
  path: string;
  component: any;
  isAuthenticated: isAuthenticated;
  user: User;
  isPreferencePage?: boolean;
  getUser(): void;
  isAuthorized(): void;
}

const AllUsersRoute: React.FC<AllUsersRouteProps> = ({ component: Component, user, ...rest }) => {
  const location = useLocation();
  console.log('1', rest.isAuthenticated)

  if (rest.isAuthenticated === isAuthenticated.True) {
    console.log('2')
    if (!user) {
      rest.getUser();
      return <PageLoader content="...Getting User..." />;
    }
    if (!user.userPreference && !rest.isPreferencePage) {
      console.log('3')
      if (user.username) {
        return <Redirect to={map.TermsOnlyAccept} />;
      }
      return <Redirect to={map.TermsSignUp} />
    }
    console.log('4')
    if (user.firstName === "" || user.lastName === "") {
      console.log('5')
      if (location.pathname !== map.UserProfile) { // Only redirect to the user profile if we're not already there.
        return <Redirect to={map.UserProfile} />
      }
    }
    console.log('6')
    return <Route {...rest} render={(props) => {
      return <Component {...props} user={user} />
    }} />;
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized();
    return <PageLoader content="...Checking rights..." />;
  } else {
    return <LoginRedirect />;
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

export default connector(AllUsersRoute);
