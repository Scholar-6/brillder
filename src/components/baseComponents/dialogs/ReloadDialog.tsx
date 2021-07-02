import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface SubjectDialogProps {
  isOpen: boolean;
  close(): void;
  reload(): void;
}

const ReloadDialog: React.FC<SubjectDialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
      <div className="dialog-header">
        <div>We just need to check your id again.</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={props.reload}>
          <span>Reload</span>
        </button>
      </div>
    </Dialog>
  );
};

export default ReloadDialog;
