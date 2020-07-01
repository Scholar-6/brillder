import React from "react";
import { History } from 'history'
import { Redirect } from "react-router-dom";
import { Button, Grid } from "@material-ui/core";
import MailIcon from '@material-ui/icons/Mail';
import sprite from "../../../assets/img/icons-sprite.svg";

import './ChooseLoginPage.scss';
import { UserLoginType } from 'model/auth';


interface ChooseLoginProps {
  history: History
}

const ChooseLoginPage: React.FC<ChooseLoginProps> = (props) => {
  const moveToLogin = () => {
    props.history.push('/login?userType=' + userType)
  }

  function getUserTypeParam(param: string): UserLoginType {
    var url_string = window.location.href;
    var url = new URL(url_string);
    let userType = url.searchParams.get(param);
    if (userType) {
      return parseInt(userType);
    }
    return UserLoginType.None;
  }

  const userType = getUserTypeParam('userType');

  if (userType === UserLoginType.Builder || userType === UserLoginType.Student) {
    let userUrl = '';
    if (userType === UserLoginType.Builder) {
      userUrl = 'build';
    } else if (userType === UserLoginType.Student) {
      userUrl = 'play';
    }
    let googleLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/google/login/${userUrl}`;
    return (
      <Grid className="auth-page pre-login-page" container item justify="center" alignItems="center">
        <div className="back-col">
          <div className="back-box">
            <svg className="svg active back-button" onClick={() => props.history.push('/choose-user')}>
              <use href={sprite + "#arrow-down"} />
            </svg>
          </div>
        </div>
        <div className="first-col">
          <div className="first-item">
          </div>
          <div className="second-item">
            <Grid>
              <div className="logo-box">
                <img alt="Logo" src="/images/choose-login/logo.png" className="logo-image" />
              </div>
            </Grid>
            <div className="button-box">
              <Button className="email-button svgOnHover" onClick={moveToLogin}>
                <svg className="svg active">
                  <use href={sprite + "#email"} />
                </svg>
                <span>Register &nbsp;|&nbsp; Sign in with email</span>
              </Button>
              <Button className="google-button svgOnHover" href={googleLink}>
                <svg className="svg active">
                  <use href={sprite + "#gmail"} />
                </svg>
                <span>Register &nbsp;|&nbsp; Sign in with Google</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="second-col">
          <div className="first-item"></div>
          <div className="second-item"></div>
        </div>
      </Grid>
    );
  }

  return <Redirect to="/choose-user" />
}

export default ChooseLoginPage
