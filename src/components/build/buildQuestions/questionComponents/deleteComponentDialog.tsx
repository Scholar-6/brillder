import React from 'react';
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  removeIndex: number;
  submit(index: number): void;
  close(): void;
}

const DeleteComponentDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
      <div className="dialog-header">
        <div>Permanently delete<br />this component?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={() => {
            props.submit(props.removeIndex);
            props.close();
          }}>
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

export default DeleteComponentDialog;
