import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

import actions from '../../redux/actions/auth';
import userActions from '../../redux/actions/user';
import { isAuthenticated } from 'model/brick';
import { User, UserType } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import map from 'components/map';

interface StudentRouteProps {
  path: string;
  component: any;
  innerComponent?: any;
  isAuthenticated: isAuthenticated;
  isRedirectedToProfile: boolean;
  user: User;
  getUser(): void;
  isAuthorized(): void;
}

const StudentRoute: React.FC<StudentRouteProps> = ({ component: Component, innerComponent, user, ...rest }) => {
  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!user) {
      rest.getUser();
      return <PageLoader content="...Getting User..." />;
    }

    if (!rest.isRedirectedToProfile) {
      if (!user.firstName || !user.lastName) {
        return <Redirect to="/user-profile" />
      }
    }
    const { roles } = user;
    let can = roles.some((role: any) => {
      const { roleId } = role
      return roleId === UserType.Student || roleId === UserType.Admin || roleId === UserType.Builder || roleId === UserType.Publisher;
    });
    if (can) {
      return <Route {...rest} render={(props) => <Component component={innerComponent} {...props} />} />;
    } else {
      return <PageLoader content="...Forbidden..." />;
    }
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized()
    return <PageLoader content="...Checking rights..." />;
  } else {
    return <Redirect to={map.Login} />
  }
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isRedirectedToProfile: state.auth.isRedirectedToProfile,
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  isAuthorized: () => dispatch(actions.isAuthorized()),
  getUser: () => dispatch(userActions.getUser()),
});

const connector = connect(mapState, mapDispatch)

export default connector(StudentRoute);
