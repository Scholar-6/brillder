import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const SubmitAnswersDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
      <div className="dialog-header">
        <div>Submit answers?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.submit}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>Not yet!</span>
        </button>
      </div>
    </Dialog>
  );
}

export default SubmitAnswersDialog;
