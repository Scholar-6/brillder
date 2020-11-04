import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";


interface DialogProps {
  isOpen: boolean;
  close(): void;
  submit(): void;
  hide(): void;
}

const ProposalInvalidDialog: React.FC<DialogProps> = (props) => {
  return (
    <BaseDialogWrapper open={props.isOpen} close={props.close} submit={props.hide}>
      <div className="dialog-header">
        <div>Your proposal is incomplete.</div>
        <div>Click through and fill in any fields marked in red.</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.hide}>
          <span>OK</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.submit}>
          <span>Save & Exit</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default ProposalInvalidDialog;
