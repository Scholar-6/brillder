import React from 'react';
import { connect } from 'react-redux';

import './LogoutDialog.scss';
import authActions from 'redux/actions/auth';
import map from 'components/map';
import BaseDialogWrapper from '../dialogs/BaseDialogWrapper';

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
    props.history.push(map.Login);
  }

  return (
    <BaseDialogWrapper open={props.isOpen} close={props.close} submit={logout}>
      <div className="dialog-header">
        <div>Are you sure</div>
        <div>you want to log out?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={logout}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={props.close}>
          <span>No</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

const connector = connect(null, mapDispatch);

export default connector(LogoutDialog);
