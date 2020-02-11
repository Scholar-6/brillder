import React from "react";
import { connect } from 'react-redux';
import actions from '../../redux/actions/auth';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, Typography, IconButton } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';

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
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Menu
          </Typography>
          <Button color="inherit" onClick={props.logout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default connector(MainMenu);
