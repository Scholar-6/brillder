import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

import actions from 'redux/actions/auth';
import userActions from 'redux/actions/user';
import { isAuthenticated } from 'model/brick';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import map from 'components/map';
import CookiePolicyDialog from 'components/baseComponents/policyDialog/CookiePolicyDialog';
import StopTrackingButton from './StopTrackingButton';

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

const UnauthorizedRoute: React.FC<StudentRouteProps> = ({ component: Component, innerComponent, user, ...rest }) => {
  let [cookieOpen, setCookiePopup] = React.useState(true);

  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!user) {
      rest.getUser();
      return <PageLoader content="...Getting User..." />;
    }
    
    if (!user.rolePreference) {
      return <Redirect to={map.TermsSignUp} />
    }

    if (!rest.isRedirectedToProfile) {
      if (!user.firstName || !user.lastName) {
        return <Redirect to={map.UserProfile} />
      }
    }

    return <Route {...rest} render={(props) => <Component component={innerComponent} {...props} />} />;
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized()
    return <PageLoader content="...Checking rights..." />;
  } else {
    return (
      <div>
        <Route {...rest} render={(props) => <Component component={innerComponent} {...props} />} />
        <StopTrackingButton shown={!cookieOpen} onClick={() => setCookiePopup(true)} />
        <CookiePolicyDialog isOpen={cookieOpen} close={() => setCookiePopup(false)} />
      </div>
    );
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

export default connector(UnauthorizedRoute);
