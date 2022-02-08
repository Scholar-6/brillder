import React from "react";

import "./FailedRequestDialog.scss";
import BaseDialogWrapper from "../dialogs/BaseDialogWrapper";


interface ShuffleAnswerDialogProps {
  isOpen: boolean;
  hide(): void;
  submit(): void;
  close(): void;
}

const ShuffleAnswerDialog: React.FC<ShuffleAnswerDialogProps> = (props) => {
  return (
    <BaseDialogWrapper open={props.isOpen} close={props.hide} submit={props.submit}>
      <div className="dialog-header">
        <div className="bold">Is this your answer?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange bold yes-button" onClick={props.submit}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray bold no-button" onClick={props.close}>
          <span>No, skip</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default ShuffleAnswerDialog;
