import React from "react";
import BaseDialogWrapper from "./BaseDialogWrapper";

interface DialogProps {
  isOpen: boolean;
  close(): void;
  submit(): void;
}

const NoSubjectDialog: React.FC<DialogProps> = (props) => {
  return (
    <BaseDialogWrapper open={props.isOpen} close={props.close} submit={props.submit}>
      <div className="dialog-header">
        <div>SUBJECT is not listed on your profile yet.<br />Would you like to add it?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={props.submit}>
          <span>Yes, and start building</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>No</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default NoSubjectDialog;
