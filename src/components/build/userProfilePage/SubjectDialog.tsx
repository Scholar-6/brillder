import React from "react";
import { Grid, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

interface SubjectDialogProps {
  isOpen: boolean;
  close(): void;
}

const SubjectDialog: React.FC<SubjectDialogProps> = ({ isOpen, close }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog-box">
      <div className="dialog-header">
        <div>You need to assign at<br />least one subject to user</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={() => close()}>
          <span>Close</span>
        </button>
      </div>
    </Dialog>
  );
};

export default SubjectDialog;
