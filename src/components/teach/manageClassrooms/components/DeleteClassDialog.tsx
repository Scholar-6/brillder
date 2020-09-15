import React from 'react';
import Dialog from '@material-ui/core/Dialog';

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
      className="dialog-box light-blue assign-class-dialog"
    >
      <div className="dialog-header" style={{marginBottom: '2vh'}}>
        <div className="title" style={{fontSize: '2.5vw'}}>Delete Class?</div>
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
