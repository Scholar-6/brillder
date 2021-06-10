import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { FormControlLabel, Radio } from "@material-ui/core";

interface SubjectDialogProps {
  isOpen: boolean;
  value?: boolean;
  submit(v: boolean): void;
}

const LineStyleDialog: React.FC<SubjectDialogProps> = ({ isOpen, value = false, submit }) => {
  return (
    <Dialog open={isOpen} onClose={() => submit(value)} className="dialog-box poem-dialog">
      <div className="dialog-header">
        <div>Will this be a poem, or text where line breaks matter?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={() => submit(true)}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={() => submit(false)}>
          <span>No</span>
        </button>
      </div>
    </Dialog>
  );
};

export default LineStyleDialog;
