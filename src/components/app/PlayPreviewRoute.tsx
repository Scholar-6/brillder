import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import actions from "redux/actions/auth";
import brickActions from "redux/actions/brickActions";

import userActions from "../../redux/actions/user";
import { isAuthenticated, Brick } from "model/brick";
import { User } from "model/user";
import { getBrillderTitle } from "components/services/titleService";
import { ReduxCombinedState } from "redux/reducers";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import map from "components/map";
import routes from "components/playPreview/routes";
import { Helmet } from "react-helmet";
import LoginRedirect from "components/baseComponents/LoginRedirect";

interface PreviewRouteProps {
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

const PlayPreviewRoute: React.FC<PreviewRouteProps> = ({
  component: Component,
  ...rest
}) => {
  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!rest.user) {
      rest.getUser();
      return <PageLoader content="...Getting User..." />;
    }

    let { user } = rest;

    if (!user.rolePreference) {
      return <Redirect to={map.UserPreference} />;
    }

    if (!rest.isRedirectedToProfile) {
      if (!user.firstName || !user.lastName) {
        return <Redirect to={map.UserProfile} />;
      }
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
            rest.fetchBrick(brickId);
            return <PageLoader content="...Getting Brick..." />;
          }

          // by default move to intro
          let splited = props.location.pathname.split('/');
          if (splited.length === 4) {
            props.history.push(routes.previewNewPrep(brickId));
            return <PageLoader content="...Getting Brick..." />;
          }

          return <Component {...props} />;
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

export default connector(PlayPreviewRoute);
