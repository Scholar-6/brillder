import React from "react";
import Dialog from "@material-ui/core/Dialog";


interface CloseProposalDialogProps {
  isOpen: boolean;
  close(): void;
  move(): void;
}

const CloseProposalDialog: React.FC<CloseProposalDialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
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
    </Dialog>
  );
}

export default CloseProposalDialog;
