import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";


interface CloseProposalDialogProps {
  isOpen: boolean;
  close(): void;
  move(): void;
}

const CloseProposalDialog: React.FC<CloseProposalDialogProps> = (props) => {
  const {close} = props;
  return (
    <BaseDialogWrapper open={props.isOpen} close={close} submit={props.move}>
      <div className="dialog-header">
        <div className="text-center">Exit?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.move}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>No</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default CloseProposalDialog;
