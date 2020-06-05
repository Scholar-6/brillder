import React from "react";
import { Button, Grid, Hidden } from "@material-ui/core";
import { History } from 'history';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './MobileChooseUserPage.scss';
import { UserLoginType } from 'model/auth';


interface ChooseUserProps {
  history: History;
  openMessage(): void;
  selectLoginType(loginType: UserLoginType): void;
}

const MobileChooseUserPage:React.FC<ChooseUserProps> = (props) => {
  return (
    <Hidden only={['md', 'sm', 'lg', 'xl']}>
      <div className="mobile-choose-user">
        <Grid container direction="row" className="first-mobile-row">
          <div className="first-col"></div>
          <div className="second-col"></div>
        </Grid>
        <Grid container direction="row" className="second-mobile-row">
          <div className="first-col"></div>
          <div className="second-col"></div>
        </Grid>
        <Grid container direction="row" className="third-mobile-row">
          <div className="first-col"></div>
          <div className="second-col"></div>
        </Grid>
      </div>
      <div style={{position: 'fixed', top: 0, height: '100%', width: '100%'}}>
        <Grid container justify="center">
          <img alt="Logo" src="/images/choose-login/logo.png" className="logo-mobile-image" />
          <Grid container justify="center">
            <img alt="Logo" src="/images/choose-user/brillder-red-text.svg" className="logo-mobile-text-image" />
          </Grid>
        </Grid>
        <Grid container justify="center">
          <ExpandMoreIcon className="mobile-arrow" />
        </Grid>
        <Grid container direction="row">
          <Grid container item xs={12} justify="center">
            <Button onClick={() => props.selectLoginType(UserLoginType.Student)} className="user-type-mobile-btn">
              <span className="user-type-name">L e a r n</span>
            </Button>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid container item xs={12} justify="center">
            <Button onClick={() => { props.selectLoginType(UserLoginType.Teacher); props.openMessage(); }} className="user-type-mobile-btn">
              <span className="user-type-name">T e a c h</span>
            </Button>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid container item xs={12} justify="center">
            <Button onClick={() => props.selectLoginType(UserLoginType.Builder)} className="user-type-mobile-btn">
              <span className="user-type-name">B u i l d</span>
            </Button>
          </Grid>
        </Grid>
      </div>
    </Hidden>
  );
}

export default MobileChooseUserPage;
