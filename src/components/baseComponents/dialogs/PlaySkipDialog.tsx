import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  label: string;
  submit(): void;
  close(): void;
}

const PlaySkipDialog: React.FC<DialogProps> = ({ isOpen, label, submit, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <div>{label}?</div>
        <div>This will end your play attempt.</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={submit}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={close}>
          <span>No, keep playing</span>
        </button>
      </div>
    </Dialog>
  );
};

export default PlaySkipDialog;
