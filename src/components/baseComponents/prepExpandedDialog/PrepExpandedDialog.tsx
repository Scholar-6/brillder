import React from "react";
import Dialog from "@material-ui/core/Dialog";


interface PrepExpandedProps {
  isOpen: boolean;
  close(): void;
  onSubmit(): void;
}

const PrepExpandedDialog: React.FC<PrepExpandedProps> = (props) => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog-box">
      <div className="dialog-header">
        <div>Click the arrow to expand the Prep section first</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.onSubmit}>
          <span>Noted, show Prep now</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>Close</span>
        </button>
      </div>
    </Dialog>
  );
}

export default PrepExpandedDialog;
