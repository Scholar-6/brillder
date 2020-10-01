import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface SubjectDialogProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const SimpleDialog: React.FC<SubjectDialogProps> = ({ isOpen, submit, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <div>Are you sure you want to delete this comment?</div>
      </div>
      <div className="dialog-footer">
      <button className="btn btn-md bg-theme-orange yes-button" onClick={submit}>
          <span>Yes, delete</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={close}>
          <span>No, keep</span>
        </button>
      </div>
    </Dialog>
  );
};

export default SimpleDialog;
