import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import queryString from 'query-string';

import actions from "../../redux/actions/auth";
import userActions from "../../redux/actions/user";
import { isAuthenticated } from "model/brick";
import { User } from "model/user";
import { getBrillderTitle } from "components/services/titleService";
import { ReduxCombinedState } from "redux/reducers";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import map from "components/map";
import LoginRedirect from "components/baseComponents/LoginRedirect";
import BaseTermsRedirect from "./BaseTermsRedirect";


interface BuildRouteProps {
  exact?: any;
  path: string;
  component: any;
  isAuthenticated: isAuthenticated;
  isRedirectedToProfile: boolean;
  user: User;
  location: any;
  getUser(): void;
  isAuthorized(): void;
}

class BuildRoute extends React.Component<BuildRouteProps> {
  constructor(props: BuildRouteProps) {
    super(props);

    this.getUser(props);
  }

  getUser(props: BuildRouteProps) {
    if (!props.user) {
      if (props.isAuthenticated === isAuthenticated.True) {
        props.getUser();
      }
    }
  }

  componentDidUpdate() {
    this.getUser(this.props);
  }

  renderRoute() {
    const { props } = this;

    if (props.isAuthenticated === isAuthenticated.True) {
      if (!props.user) {
        return <PageLoader content="...Getting User..." />;
      }

      let { user } = props;

      if (!user.userPreference) {
        return <BaseTermsRedirect />;
      }

      if (!props.isRedirectedToProfile) {
        if (!user.firstName || !user.lastName) {
          return <Redirect to={map.UserProfile} />;
        }
      }

      const { component: Component } = props;
      return <Route {...props} render={(props) => <Component {...props} />} />;
    } else if (props.isAuthenticated === isAuthenticated.None) {
      props.isAuthorized();
      return <PageLoader content="...Checking rights..." />;
    } else {
      const values = queryString.parse(props.location.search);

      // move to microsoft login or other login way
      if (values.loginUrl) {
        const loginUrl = values.loginUrl as string;
        const a = document.createElement('a');
        a.href = loginUrl;
        a.click();
        return <div />;
      }

      return <LoginRedirect />;
    }
  }

  render() {
    return <>
      <Helmet>
        <title>{getBrillderTitle()}</title>
      </Helmet>
      {this.renderRoute()}
    </>
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

const connector = connect(mapState, mapDispatch);

export default connector(BuildRoute);
