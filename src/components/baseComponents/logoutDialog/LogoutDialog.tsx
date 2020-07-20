import React, { Component } from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';

import './LogoutDialog.scss';
import authActions from 'redux/actions/auth';


const mapDispatch = (dispatch: any) => {
  return { logout: () => dispatch(authActions.logout()) }
}

const mapState = () => { };

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
        className="dialog-box">
        <div className="dialog-header">
          <div>Are you sure</div>
          <div>you want to log out?</div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-orange yes-button"
            onClick={() => this.logout()}>
            <span>Yes</span>
          </button>
          <button className="btn btn-md bg-gray no-button"
            onClick={() => this.handleLogoutClose()}>
            <span>No</span>
          </button>
        </div>
      </Dialog>
    );
  }
}

const connector = connect(mapState, mapDispatch);

export default connector(LogoutDialog);
