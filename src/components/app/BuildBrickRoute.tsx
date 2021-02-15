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
import map, { ProposalBase } from "components/map";
import YJSProvider, { YJSContext } from "components/build/baseComponents/YJSProvider";
import { BrickLengthRoutePart, BriefRoutePart, OpenQuestionRoutePart, PrepRoutePart, ProposalReviewPart, TitleRoutePart } from "components/build/proposal/model";

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
  createNewBrick(authorId: number): void;
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
      return <Redirect to={map.TermsPage} />;
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
          let brickId = parseInt(props.match.params.brickId);
          brickId = isNaN(brickId) ? -1 : brickId;

          // move to investigation
          const part = "/" + rest.location.pathname.split("/")[4];
          const validRoutes = ["/investigation", "/synthesis", "/subject", TitleRoutePart, OpenQuestionRoutePart, BrickLengthRoutePart, BriefRoutePart, PrepRoutePart, ProposalReviewPart];
          const isNewBrickRoute = rest.location.pathname.includes(ProposalBase);
          if(isNewBrickRoute) {
            if(!(rest.brick && rest.brick.id)) {
              console.log("creating new brick!");
              rest.createNewBrick(user.id);
              return <PageLoader content="...Creating brick..." />
            } else {
              return <Redirect to={`/build/brick/${rest.brick.id}/subject`} />;
            }
          } else if (!validRoutes.includes(part)) {
            console.log(part);
            props.history.push(`/build/brick/${brickId}/investigation`);
            return <PageLoader content="...Getting Brick..." />;
          }
          return (
            <YJSProvider brickId={brickId}>
              <YJSContext.Consumer>
                {context => {
                  const brick = context?.json.brick;
                  if (!brick || !brick.author?.id || brick.id !== brickId) {
                    return <PageLoader content="...Getting Brick..." />;
                  }
                  console.log({ ...brick, questions: brick.questions.map((q: any) => q.toJSON()) });

                  const reduxBrick = rest.brick;
                  if (!reduxBrick || !reduxBrick.author || reduxBrick.id !== brickId) {
                    rest.fetchBrick(brickId);
                    return <PageLoader content="...Getting Brick..." />;
                  }

                  // move to investigation
                  if (!validRoutes.includes(part)) {
                    props.history.push(`/build/brick/${brickId}/investigation`);
                    return <PageLoader content="...Getting Brick..." />;
                  }
                  return <Component {...props} />
                }}
              </YJSContext.Consumer>
            </YJSProvider>
          );
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
  createNewBrick: (authorId: number) => dispatch(brickActions.createBrick({
    created: new Date(),
    updated: new Date(),
    topic: "",
    subTopic: "",
    title: "",
    brief: "",
    prep: "",
    synthesis: "",
    author: { id: authorId },
  })),
});

const connector = connect(mapState, mapDispatch);

export default connector(BuildBrickRoute);
