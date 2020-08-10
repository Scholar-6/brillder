import React from 'react';
import { Route, Redirect } from "react-router-dom";
import queryString from 'query-string';
import { connect } from 'react-redux';
import actions from 'redux/actions/auth';
import brickActions from "redux/actions/brickActions";

import userActions from '../../redux/actions/user';
import { isAuthenticated, Brick } from 'model/brick';
import { User, UserType } from 'model/user';
import { setBrillderTitle } from 'components/services/titleService';
import { ReduxCombinedState } from 'redux/reducers';
import PageLoader from 'components/baseComponents/loaders/pageLoader';

interface BuildRouteProps {
  exact?: any;
  path: string;
  component: any;
  brick: Brick;
  isAuthenticated: isAuthenticated;
  isRedirectedToProfile: boolean;
  user: User;
  location: any;
  getUser(): void;
  isAuthorized(): void;
  fetchBrick(id: number): void;
}

const BuildBrickRoute: React.FC<BuildRouteProps> = ({ component: Component, ...rest }) => {
  const values = queryString.parse(rest.location.search);
  setBrillderTitle();

  if (values.msg === 'USER_IS_NOT_ACTIVE') {
    //return <Redirect to="/sign-up-success" />
  }
  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!rest.user) {
      rest.getUser();
      return <PageLoader content="...Getting User..." />;
    }

    let { user } = rest;

    if (!rest.isRedirectedToProfile) {
      if (!user.firstName || !user.lastName) {
        return <Redirect to="/user-profile" />
      }
    }

    const isBuilder = user.roles.some(role => {
      const { roleId } = role;
      return roleId === UserType.Builder || roleId === UserType.Editor || roleId === UserType.Admin;
    });
    if (isBuilder) {
      return <Route {...rest} render={props => {
        const brickId = parseInt(props.match.params.brickId);
        if (!rest.brick || !rest.brick.author || rest.brick.id !== brickId) {
          rest.fetchBrick(brickId);
          return <PageLoader content="...Getting Brick..." />;
        }
        return <Component {...props} />
      }} />;
    }
    const isStudent = user.roles.some(role => role.roleId === UserType.Student);
    if (isStudent) {
      return <Redirect to="/play" />
    }
    return <Redirect to="/" />
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized()
    return <PageLoader content="...Checking rights..." />;
  } else {
    return <Redirect to="/choose-login" />
  }
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isRedirectedToProfile: state.auth.isRedirectedToProfile,
  user: state.user.user,
  brick: state.brick.brick
})

const mapDispatch = (dispatch: any) => ({
  isAuthorized: () => dispatch(actions.isAuthorized()),
  fetchBrick: (id: number) => dispatch(brickActions.fetchBrick(id)),
  getUser: () => dispatch(userActions.getUser()),
})

const connector = connect(mapState, mapDispatch)

export default connector(BuildBrickRoute);
