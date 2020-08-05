import React from "react";
import { useHistory } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, IconButton, Grid } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';

import './mainMenu.scss'
import actions from 'redux/actions/auth';
import { ReduxCombinedState } from "redux/reducers";


const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

const mapDispatch = (dispatch: any) => ({
  logout: () => dispatch(actions.logout()),
})

const connector = connect(mapState, mapDispatch);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);


function MainMenu(props: any) {
  const history = useHistory();
  const classes = useStyles();

  const logout = () => {
    props.logout();
    history.push('/choose-login');
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className="menu">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon /> <span style={{marginLeft: '7px', fontSize: '15px'}}>Menu</span>
          </IconButton>
          <Grid container justify="center" alignContent="center">
            <img alt="" src="/images/lflogo-White.png" style={{height: '51px'}}/>
          </Grid>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default connector(MainMenu);
