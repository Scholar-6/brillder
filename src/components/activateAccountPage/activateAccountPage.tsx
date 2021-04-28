import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { History } from "history";
import axios from 'axios';

import "./activateAccountPage.scss";
import PolicyDialog from 'components/baseComponents/policyDialog/PolicyDialog';
import map from "components/map";
import { Redirect, useLocation } from "react-router-dom";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { isPhone } from "services/phone";
import DesktopActivateAccountPage from "./DesktopActivateAccountPage";
import { connect } from "react-redux";
import auth from "redux/actions/auth";
import { UserType } from "model/user";
import MobileEmailActivate from "./MobileEmailActivate";

export enum LoginState {
  ChooseLoginAnimation,
  ChooseLogin,
  ButtonsAnimation,
  Login
}

interface ActivateAccountProps {
  history: History;
  match: any;
  setDefaultUserProperties(defaultPreference?: UserType, defaultSubject?: number): void;
}

const ActivateAccountPage: React.FC<ActivateAccountProps> = (props) => {
  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }

  const [email, setEmail] = useState('');
  const [isPolicyOpen, setPolicyDialog] = useState(initPolicyOpen);
  const [valid, setValid] = React.useState<boolean>();

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token");


  React.useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/auth/verifyResetPassword/${token}`);
        setValid(true);
        setEmail(response.data.email);
        props.setDefaultUserProperties(response.data.defaultPreference, response.data.defaultSubject);
      } catch(e) {
        setValid(false);
        props.history.push(map.Login);
      }
    }

    verifyToken();
  }, [token, props.history, setValid]);

  if(!valid && valid !== false) {
    return <PageLoader content="Checking token..." />
  }

  if (!email) {
    return <div />;
  }

  if (!isPhone()) {
    return <DesktopActivateAccountPage history={props.history} token={token} match={props.match} email={email} />;
  }

  return (
    <Grid
      className="auth-page login-page"
      container
      item
      justify="center"
      alignItems="center"
    >
      {valid && token ? <>
        <MobileEmailActivate
          token={token}
          history={props.history}
          email={email}
          setPolicyDialog={setPolicyDialog}
        />
        <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
      </>
      : <Redirect to={map.Login} />}
    </Grid>
  );
};

const mapDispatch = (dispatch: any) => ({
  setDefaultUserProperties: (defaultPreference?: UserType, defaultSubject?: number) => dispatch(auth.setDefaultUserProperties(defaultPreference, defaultSubject)),
});

export default connect(() => {}, mapDispatch)(ActivateAccountPage);
