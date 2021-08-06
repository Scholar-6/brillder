import React from "react";
import Dialog from "@material-ui/core/Dialog";


interface DialogProps {
  isOpen: boolean;
  close(): void;
  submit(): void;
}

const ReturnToEditorDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
      <div className="dialog-header">
        <div>Return to Editor?</div>
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
}

export default ReturnToEditorDialog;
