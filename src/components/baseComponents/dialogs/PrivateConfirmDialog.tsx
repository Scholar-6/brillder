import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface SuccessDialogProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const PrivateConfirmDialog: React.FC<SuccessDialogProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClick={props.close}
      onClose={props.close}
      className="dialog-box link-copied-dialog text-dialog"
    >
      <div className="dialog-header">
        I am only sharing this brick with my own students and colleagues in my school or college consistent with the exemptions for education in the Copyright Designs and Patents Act, 1988.
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.submit}>
          <span>Confirm</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>Cancel</span>
        </button>
      </div>
    </Dialog>
  );
};

export default PrivateConfirmDialog;
