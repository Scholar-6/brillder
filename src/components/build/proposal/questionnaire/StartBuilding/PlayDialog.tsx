import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  close(): void;
}

const PlayDialog: React.FC<DialogProps> = props => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
      <div className="dialog-header">
      </div>
    </Dialog>
  );
};

export default PlayDialog;
