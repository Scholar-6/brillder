import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface SubjectDialogProps {
  isOpen: boolean;
  close(): void;
}

const SubjectDialog: React.FC<SubjectDialogProps> = ({ isOpen, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <div>You need to assign at<br />least one subject to user</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={close}>
          <span>Close</span>
        </button>
      </div>
    </Dialog>
  );
};

export default SubjectDialog;
