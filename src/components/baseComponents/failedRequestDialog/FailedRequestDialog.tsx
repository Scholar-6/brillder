import React from "react";
import Dialog from "@material-ui/core/Dialog";

import "./FailedRequestDialog.scss";


interface DeleteDialogProps {
  isOpen: boolean;
  close(): void;
}

const FailedRequestDialog: React.FC<DeleteDialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
      <div className="dialog-header">
        <div>Sorry, we've run into a brick wall. Click refresh and see if we can get over it.</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.close}>
          <span>Close</span>
        </button>
      </div>
    </Dialog>
  );
}

export default FailedRequestDialog;
