

import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  title: string;
  submit(): void;
  close(): void;
}

const ActivateAccountDialog: React.FC<DialogProps> = props => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
      <div className="dialog-header">
        {props.title}
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={props.submit}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={props.close}>
          <span>No</span>
        </button>
      </div>
    </Dialog>
  );
};

export default ActivateAccountDialog;
