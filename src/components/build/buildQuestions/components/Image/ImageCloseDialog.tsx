import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  open: boolean;
  submit(): void;
  close(): void;
}

const ImageCloseDialog: React.FC<DialogProps> = ({ open, submit, close }) => {
  return (
    <Dialog open={open} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <div>Your changes will not be saved unless you press the upload button</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={submit}>
          <span>Proceed</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={close}>
          <span>Return</span>
        </button>
      </div>
    </Dialog>
  );
};

export default ImageCloseDialog;
