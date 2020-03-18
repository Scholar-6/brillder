import React from "react";
import update from 'immutability-helper';
import { Button, Grid, Hidden } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import { History } from 'history';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './ChooseUserPage.scss';
import { UserLoginType } from 'model/auth';

interface ChooseUserProps {
  history: History
}

const ChooseUserPage:React.FC<ChooseUserProps> = (props) => {
  const [userType, setUserType] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const selectLoginType = (type: UserLoginType) => {
    setUserType(update(userType, { $set: type }));
    if (type === UserLoginType.Builder || type === UserLoginType.Student) {
      props.history.push(`/choose-login?userType=${type}`);
    }
  }

  const openMessage = () => {
    setOpen(update(open, { $set: true }))
  }

  const handleClose = () => {
    setOpen(update(open, { $set: false }))
  }

  const renderLogo = () => {
    return (
      <Grid container style={{height:'100%'}} justify="center" alignItems="center">
        <img alt="Logo" src="/images/BrixLogo.png" className="logo-image" />
      </Grid>
    );
  }

  const renderButtons = () => {
    return (
      <Grid container style={{height:'100%'}} justify="center" alignItems="center">
        <div style={{width: "100%"}}>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => { selectLoginType(UserLoginType.Student); }} className="user-type-btn">
                <span className="user-type-name">L e a r n</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => { selectLoginType(UserLoginType.Teacher); openMessage(); }} className="user-type-btn">
                <span className="user-type-name">T e a c h</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => selectLoginType(UserLoginType.Builder)} className="user-type-btn">
                <span className="user-type-name">B u i l d</span>
              </Button>
            </Grid>
          </Grid>
        </div>
      </Grid>
    );
  }

  return (
    <Grid className="choose-user-page" style={{ height: '100%' }}>
      <Hidden only={['xs']}>
        <Grid container direction="row" className="first-row">
          <div className="first-col"></div>
          <div className="second-col"></div>
          <div className="third-col"></div>
        </Grid>
        <Grid container direction="row" className="second-row">
          <div className="first-col">
            {renderLogo()}
          </div>
          <div className="second-col">
            {renderButtons()}
          </div>
        </Grid>
        <Grid container direction="row" className="third-row">
          <div className="first-col"></div>
          <div className="second-col"></div>
          <div className="third-col"></div>
        </Grid>
      </Hidden>
      <Hidden only={['md', 'sm', 'lg', 'xl']} >
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
          <Grid justify="center">
            <img alt="Logo" src="/images/BrixLogo.png" className="logo-mobile-image" />
          </Grid>
          <ExpandMoreIcon className="mobile-arrow" />
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => { selectLoginType(UserLoginType.Student); }} className="user-type-mobile-btn">
                <span className="user-type-name">L e a r n</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => { selectLoginType(UserLoginType.Teacher); openMessage(); }} className="user-type-mobile-btn">
                <span className="user-type-name">T e a c h</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => selectLoginType(UserLoginType.Builder)} className="user-type-mobile-btn">
                <span className="user-type-name">B u i l d</span>
              </Button>
            </Grid>
          </Grid>
          </div>
      </Hidden>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom', horizontal: 'center',
        }}
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        message={`You cannot login as this type of user yet.`}
        action={
          <React.Fragment></React.Fragment>
        }
      />
    </Grid>
  );
}

export default ChooseUserPage
