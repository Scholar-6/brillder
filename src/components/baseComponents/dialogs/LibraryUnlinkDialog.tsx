import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  close(): void;
  submit(): void;
}

const LibraryUnlinkDialog: React.FC<DialogProps> = ({ isOpen, close, submit }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box custom-popup-d35">
      <div className="dialog-header">
        <div className="custom-text-d35">
          Are you sure you want to unlink your library account?
        </div>

        <div className="dialog-footer" style={{marginTop: '2vw'}}>
          <button className="btn btn-md bg-theme-orange yes-button" onClick={submit}>
            <span>Yes</span>
          </button>
          <button className="btn btn-md bg-gray yes-button" onClick={close}>
            <span>No</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default LibraryUnlinkDialog;
