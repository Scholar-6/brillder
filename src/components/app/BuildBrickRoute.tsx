import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import actions from "redux/actions/auth";
import brickActions from "redux/actions/brickActions";

import userActions from "../../redux/actions/user";
import { isAuthenticated, Brick } from "model/brick";
import { User } from "model/user";
import { setBrillderTitle } from "components/services/titleService";
import { ReduxCombinedState } from "redux/reducers";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import map from "components/map";

interface BuildRouteProps {
  exact?: any;
  path: string | string[];
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

const BuildBrickRoute: React.FC<BuildRouteProps> = ({
  component: Component,
  ...rest
}) => {
  setBrillderTitle();

  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!rest.user) {
      rest.getUser();
      return <PageLoader content="...Getting User..." />;
    }

    let { user } = rest;

    if (!user.rolePreference) {
      return <Redirect to={map.TermsSignUp} />;
    }

    if (!rest.isRedirectedToProfile) {
      if (!user.firstName || !user.lastName) {
        return <Redirect to={map.UserProfile} />;
      }
    }

    return (
      <Route
        {...rest}
        render={(props) => {
          // fetch brick
          const brickId = parseInt(props.match.params.brickId);
          if (!rest.brick || !rest.brick.author || rest.brick.id !== brickId) {
            rest.fetchBrick(brickId);
            return <PageLoader content="...Getting Brick..." />;
          }

          // move to investigation
          const found = rest.location.pathname.indexOf('/investigation');
          if (found === -1) {
            const isSynthesis = rest.location.pathname.indexOf('/synthesis');
            if (isSynthesis) {
              return <Component {...props} />;
            }

            props.history.push(`/build/brick/${brickId}/investigation`);
            return <PageLoader content="...Getting Brick..." />;
          }

          return <Component {...props} />;
        }}
      />
    );
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized();
    return <PageLoader content="...Checking rights..." />;
  } else {
    return <Redirect to={map.Login} />;
  }
};

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isRedirectedToProfile: state.auth.isRedirectedToProfile,
  user: state.user.user,
  brick: state.brick.brick,
});

const mapDispatch = (dispatch: any) => ({
  isAuthorized: () => dispatch(actions.isAuthorized()),
  fetchBrick: (id: number) => dispatch(brickActions.fetchBrick(id)),
  getUser: () => dispatch(userActions.getUser()),
});

const connector = connect(mapState, mapDispatch);

export default connector(BuildBrickRoute);
