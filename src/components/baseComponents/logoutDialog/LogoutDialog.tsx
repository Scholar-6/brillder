import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';

import './LogoutDialog.scss';
import authActions from 'redux/actions/auth';


const mapDispatch = (dispatch: any) => {
  return { logout: () => dispatch(authActions.logout()) }
}

interface LogoutComponentProps {
  isOpen: boolean;
  history: any;
  close(): void;
  logout(): void;
}

const LogoutDialog: React.FC<LogoutComponentProps> = (props) => {
  const logout = () => {
    props.logout();
    props.history.push('/choose-login');
  }

  const handleLogoutClose = () => props.close();

  return (
    <Dialog
      open={props.isOpen}
      onClose={() => handleLogoutClose()}
      className="dialog-box">
      <div className="dialog-header">
        <div>Are you sure</div>
        <div>you want to log out?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={() => logout()}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={() => handleLogoutClose()}>
          <span>No</span>
        </button>
      </div>
    </Dialog>
  );
}

const connector = connect(null, mapDispatch);

export default connector(LogoutDialog);
