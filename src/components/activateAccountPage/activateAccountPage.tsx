import React, { useState, useEffect } from "react";
import { History } from "history";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import queryString from 'query-string';
import { connect } from "react-redux";

import "./activateAccountPage.scss";
import map from "components/map";
import { isPhone } from "services/phone";
import { SetActivateUrl } from "localStorage/login";
import auth from "redux/actions/auth";
import { UserType } from "model/user";

import PageLoader from "components/baseComponents/loaders/pageLoader";
import DesktopActivateAccountPage from "./desktop/DesktopActivateAccountPage";
import ActivateAccountPhonePage from "./phone/ActivateAccountPhonePage";

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
  const [email, setEmail] = useState('');
  const [valid, setValid] = React.useState<boolean>();

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token");

  useEffect(() => {
    const values = queryString.parse(props.history.location.search);
    if (values.returnUrl) {
      SetActivateUrl(values.returnUrl as string);
    }
  }, []);

  useEffect(() => {
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
  /*eslint-disable-next-line*/
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
  return <ActivateAccountPhonePage history={props.history} match={props.match} token={token} email={email} />
};

const mapDispatch = (dispatch: any) => ({
  setDefaultUserProperties: (defaultPreference?: UserType, defaultSubject?: number) => dispatch(auth.setDefaultUserProperties(defaultPreference, defaultSubject)),
});

export default connect(() => {}, mapDispatch)(ActivateAccountPage);
