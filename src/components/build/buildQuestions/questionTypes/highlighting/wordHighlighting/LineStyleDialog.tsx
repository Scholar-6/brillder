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
        <FormControlLabel
          checked={value === true}
          control={<Radio onClick={() => submit(true)} className={"filter-radio custom-color"} />}
          label="Yes"
        />
        <FormControlLabel
          checked={value === false}
          control={<Radio onClick={() => submit(false)} className={"filter-radio custom-color"} />}
          label="No"
        />
      </div>
    </Dialog>
  );
};

export default LineStyleDialog;
