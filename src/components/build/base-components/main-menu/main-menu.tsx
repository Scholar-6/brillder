import React from "react";
import { useHistory } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, Typography, IconButton } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
// @ts-ignore
import { connect } from 'react-redux';

import './main-menu.scss'
import actions from 'redux/actions/auth';


const mapState = (state: any) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    logout: () => dispatch(actions.logout()),
  }
}

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
    history.push('/pre-login');
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className="menu">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Menu
          </Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default connector(MainMenu);
