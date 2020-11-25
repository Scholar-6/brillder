import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const AdaptBrickDialog: React.FC<DialogProps> = ({ isOpen, submit, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <div className="bold" style={{textAlign: 'center'}}>Adapt brick?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={submit}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={close}>
          <span>No</span>
        </button>
      </div>
    </Dialog>
  );
};

export default AdaptBrickDialog;
