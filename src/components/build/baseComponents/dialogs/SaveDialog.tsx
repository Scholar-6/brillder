import React from "react";
import Dialog from '@material-ui/core/Dialog';


interface SkipTutorialDialogProps {
  open: boolean;
  save(): void;
  close(): void;
}

const SaveDialog: React.FC<SkipTutorialDialogProps> = ({
  open, save, close
}) => {
  return (
    <Dialog open={open} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <div>Save and Exit?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={save}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={close}>
          <span>No</span>
        </button>
      </div>
    </Dialog>
  );
}

export default SaveDialog;
