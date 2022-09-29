import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import './DeleteClassDialog.scss';

interface DeleteProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const DeleteClassDialog: React.FC<DeleteProps> = (props) => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box delete-class-dialog"
    >
      <div className="dialog-header" style={{marginBottom: '2vh'}}>
        <div className="title">Are you sure you want to delete this class?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.submit}>
          <span>Yes, delete</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>No, keep</span>
        </button>
      </div>
    </Dialog>
  );
}

export default DeleteClassDialog;
