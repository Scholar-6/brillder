import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const ArchiveWarningDialog: React.FC<DialogProps> = props => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
      <div className="dialog-header">
        <div>There are students who have not yet completed it.</div>
        <div>Are you sure you want to archive it.</div>
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

export default ArchiveWarningDialog;
