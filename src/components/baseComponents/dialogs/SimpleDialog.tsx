import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface SubjectDialogProps {
  isOpen: boolean;
  label: string;
  close(): void;
}

const SimpleDialog: React.FC<SubjectDialogProps> = ({ isOpen, label, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <div>{label}</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={close}>
          <span>Close</span>
        </button>
      </div>
    </Dialog>
  );
};

export default SimpleDialog;
