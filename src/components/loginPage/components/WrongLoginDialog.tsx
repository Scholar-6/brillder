import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface WrongLoginDialogProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const WrongLoginDialog: React.FC<WrongLoginDialogProps> = ({ isOpen, close, submit }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <div>We don't appear to have a record of you yet. Sign up</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={submit}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-theme-orange no-button" onClick={close}>
          <span>No</span>
        </button>
      </div>
    </Dialog>
  );
};

export default WrongLoginDialog;
