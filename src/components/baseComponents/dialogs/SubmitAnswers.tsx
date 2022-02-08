import React from "react";
import BaseDialogWrapper from "./BaseDialogWrapper";

interface DialogProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const SubmitAnswersDialog: React.FC<DialogProps> = (props) => {
  return (
    <BaseDialogWrapper open={props.isOpen} close={props.close} submit={props.submit} >
      <div className="dialog-header">
        <div className="bold">Submit answers?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button bold"
          onClick={props.submit}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button bold"
          onClick={props.close}>
          <span>Not yet!</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default SubmitAnswersDialog;
