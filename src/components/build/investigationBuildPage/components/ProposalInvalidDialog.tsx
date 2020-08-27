import React from "react";
import Dialog from "@material-ui/core/Dialog";


interface DialogProps {
  isOpen: boolean;
  close(): void;
  submit(): void;
  hide(): void;
}

const ProposalInvalidDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
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
    </Dialog>
  );
}

export default ProposalInvalidDialog;
