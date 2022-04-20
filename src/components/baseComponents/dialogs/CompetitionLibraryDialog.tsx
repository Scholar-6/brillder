import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  close(): void;
}

const CompetitionLibraryDialog: React.FC<DialogProps> = ({ isOpen, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <div className="bold" style={{textAlign: 'center'}}>There is a competition running for this brick. You cannot view your answers until it is over</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-green yes-button" onClick={close}>
          <span>Ok</span>
        </button>
      </div>
    </Dialog>
  );
};

export default CompetitionLibraryDialog;
