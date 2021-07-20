import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";

interface WrongLoginDialogProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const WrongLoginDialog: React.FC<WrongLoginDialogProps> = props => {
  return (
    <BaseDialogWrapper open={props.isOpen} close={props.close} submit={props.submit}>
      <div className="dialog-header">
        <div>We don’t appear to have a record of you yet.</div>
        <div>Sign up?</div>
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
};

export default WrongLoginDialog;
