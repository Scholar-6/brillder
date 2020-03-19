import React from "react";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { IconButton } from "material-ui";
// @ts-ignore
import { Hidden } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { useHistory } from 'react-router-dom';
import PhonePreview from 'components/build/baseComponents/phonePreview/PhonePreview';
import ExitButton from '../../components/ExitButton';

import './welcome.scss';


function Welcome() {
  const history = useHistory();

  const next = () => {
    history.push('/build/new-brick/brick-title');
  };

  return (
    <div className="tutorial-page welcome-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <Grid justify="center" container item xs={12} sm={9} md={10} lg={7}>
            <ExitButton />
            <div className="left-card">
              <Grid className="tutorial-logo-container" container direction="row" justify="center" alignItems="center">
                <Grid container direction="row" alignItems="center" justify="center" style={{ height: "100%" }}>
                  <Grid container justify="center" item xs={12} style={{ height: "100%" }}>
                    <img src="/images/BrixLogo.png" alt="brix-logo" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container direction="row" className="welcome-fotter">
                <Grid item xs={12} style={{ position: "relative", height: '100%' }}>
                  <h2 className="tutorial-logo-text">
                    A &nbsp; S C H O L A R &nbsp; 6 &nbsp; T E C H &nbsp; P R O D U C T
                  </h2>
                  <h2 className="welcome-upper-text">Welcome to Brix.</h2>
                  <h1 className="welcome-bottom-text">Start Building </h1>
                  <div className="welcome-next-container">
                    <IconButton className="welcome-next-button" onClick={next} aria-label="next">
                      <ArrowForwardIosIcon className="welcome-next-icon" />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Hidden only={['xs', 'sm']}>
          <PhonePreview link={window.location.origin + '/logo-page'} />
        </Hidden>
      </Grid>
    </div>
  );
}

export default Welcome
