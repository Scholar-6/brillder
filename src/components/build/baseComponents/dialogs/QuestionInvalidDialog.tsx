import React from "react";
import Dialog from "@material-ui/core/Dialog";


interface DialogProps {
  isOpen: boolean;
  close(): void;
  submit(): void;
  hide(): void;
}

const QuestionInvalidDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
      <div className="dialog-header">
        <div>Some questions are incomplete.</div>
        <div>These are marked in red. Keep working?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.hide}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.submit}>
          <span>No, Save & Exit</span>
        </button>
      </div>
    </Dialog>
  );
}

export default QuestionInvalidDialog;
