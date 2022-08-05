import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import map from "components/map";

interface BuildRouteProps {
  user: User;
}

const BaseTermsRedirect: React.FC<BuildRouteProps> = ({ user }) => {
  if (user.username) {
    return <Redirect to={map.TermsOnlyAccept} />;
  }
  return <Redirect to={map.TermsSignUp} />;
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(BaseTermsRedirect);
