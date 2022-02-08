import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface SuccessDialogProps {
  isOpen: boolean;
  label?: string;
  className?: string;
  close(): void;
}

const TextDialog: React.FC<SuccessDialogProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClick={props.close}
      onClose={props.close}
      className="dialog-box link-copied-dialog text-dialog"
    >
      <div className={"dialog-header " + props.className}>
        {props.label}
      </div>
    </Dialog>
  );
};

export default TextDialog;
