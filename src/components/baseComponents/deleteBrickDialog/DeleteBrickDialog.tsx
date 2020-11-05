import React from "react";
import axios from 'axios';
import actions from 'redux/actions/requestFailed';
import { connect } from 'react-redux';

import "./DeleteBrickDialog.scss";
import BaseDialogWrapper from "../dialogs/BaseDialogWrapper";


interface DeleteDialogProps {
  isOpen: boolean;
  brickId: number;
  close(): void;
  onDelete(brickId: number): void;
  requestFailed(e: string): void;
}

const DeleteBrickDialog: React.FC<DeleteDialogProps> = (props) => {
  const deleteBrick = () => {
    const { brickId } = props;
    axios.delete(
      process.env.REACT_APP_BACKEND_HOST + '/brick/' + brickId, { withCredentials: true }
    ).then(() => {
      props.onDelete(brickId);
    }).catch(() => {
      props.requestFailed('Can`t delete bricks');
    });
  }

  return (
    <BaseDialogWrapper open={props.isOpen} close={props.close} submit={deleteBrick}>
      <div className="dialog-header">
        <div>Permanently delete<br />this brick?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={deleteBrick}>
          <span>Yes, delete</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>No, keep</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(null, mapDispatch);

export default connector(DeleteBrickDialog);
