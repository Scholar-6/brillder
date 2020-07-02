import React, { Component } from 'react';
import { Grid, Button } from '@material-ui/core';
// @ts-ignore
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';

import './LogoutDialog.scss';
import authActions from 'redux/actions/auth';


const mapDispatch = (dispatch: any) => {
  return { logout: () => dispatch(authActions.logout()) }
}

const mapState = () => {};

interface LogoutComponentProps {
  isOpen: boolean;
  history: any;
  close(): void;
  logout(): void;
}

class LogoutDialog extends Component<LogoutComponentProps> {
  logout() {
    this.props.logout();
    this.props.history.push('/choose-login');
  }

  handleLogoutClose = () => this.props.close();

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.handleLogoutClose()}
        className="logout-dialog"
      >
        <div className="logout-dialog-header">
          <div>Are you sure you want</div>
          <div>to log out?</div>
        </div>
        <Grid container direction="row" className="logout-buttons" justify="center">
          <Button className="yes-button" onClick={() => this.logout()}>Yes</Button>
          <Button className="no-button" onClick={() => this.handleLogoutClose()}>No</Button>
        </Grid>
      </Dialog>
    );
  }
}

const connector = connect(mapState, mapDispatch);

export default connector(LogoutDialog);
