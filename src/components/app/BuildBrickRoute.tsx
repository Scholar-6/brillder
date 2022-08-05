import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import actions from "redux/actions/auth";
import brickActions from "redux/actions/brickActions";

import userActions from "../../redux/actions/user";
import { isAuthenticated, Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { getBrillderTitle } from "components/services/titleService";
import { ReduxCombinedState } from "redux/reducers";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import map from "components/map";
import { checkAdmin } from "components/services/brickService";
import { Helmet } from "react-helmet";
import LoginRedirect from "components/baseComponents/LoginRedirect";
import BaseTermsRedirect from "./BaseTermsRedirect";

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
  fetchBrick(id: number): Promise<any>;
}

const ProposalBrickRoute: React.FC<BuildRouteProps> = ({
  component: Component,
  ...rest
}) => {
  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!rest.user) {
      rest.getUser();
      return <PageLoader content="...Getting User..." />;
    }

    let { user } = rest;

    if (!user.userPreference) {
      return <BaseTermsRedirect />;
    }

    if (!rest.isRedirectedToProfile) {
      if (!user.firstName || !user.lastName) {
        return <Redirect to={map.UserProfile} />;
      }
    }

    // #3374 brillder
    const canAccess = (brick: Brick) => {
      const isAdmin = checkAdmin(rest.user.roles);
      if (isAdmin) { return true; }

      if (brick.isCore && brick.status === BrickStatus.Publish) {
        return false;
      }
      return true;
    }

    return <>
      <Helmet>
        <title>{getBrillderTitle()}</title>
      </Helmet>
      <Route
        {...rest}
        render={(props) => {
          // fetch brick
          const brickId = parseInt(props.match.params.brickId);
          if (!rest.brick || !rest.brick.author || rest.brick.id !== brickId) {
            rest.fetchBrick(brickId).then(res => {
              if (res.status === 403) {
                props.history.push(map.MainPage);
              }
            })
            return <PageLoader content="...Getting Brick..." />;
          }

          // move to investigation
          const found = rest.location.pathname.indexOf('/investigation');
          if (found === -1) {
            const isSynthesis = rest.location.pathname.indexOf('/synthesis');
            if (isSynthesis) {
              if (canAccess(rest.brick)) {
                return <Component {...props} />;
              }
              return <LoginRedirect />;
            }

            props.history.push(`/build/brick/${brickId}/investigation`);
            return <PageLoader content="...Getting Brick..." />;
          }

          if (canAccess(rest.brick)) {
            return <Component {...props} />;
          }
          return <LoginRedirect />;
        }}
      />
    </>;
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized();
    return <PageLoader content="...Checking rights..." />;
  } else {
    return <LoginRedirect />;
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

export default connector(ProposalBrickRoute);
