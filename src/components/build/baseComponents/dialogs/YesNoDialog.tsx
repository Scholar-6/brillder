import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";


interface DialogProps {
  isOpen: boolean;
  title: string;
  close(): void;
  submit(): void;
}

const YesNoDialog: React.FC<DialogProps> = (props) => {
  return (
    <BaseDialogWrapper open={props.isOpen} close={props.close} submit={props.submit}>
      <div className="dialog-header">
        <div>{props.title}</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={props.submit}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={props.close}>
          <span>No</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default YesNoDialog;
