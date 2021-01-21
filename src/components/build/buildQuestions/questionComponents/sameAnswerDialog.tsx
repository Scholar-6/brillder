import React from 'react';
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  close(): void;
}

const SameAnswerDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} className="dialog-box" onClose={props.close}>
      <div className="dialog-header">
        <div className="bold">Looks like some answers are the same</div>
        <div>Correct answers could be marked wrong. Please make sure answers are different</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-gray yes-button" onClick={props.close}>
          <span>Ok</span>
        </button>
      </div>
    </Dialog>
  );
}

export default SameAnswerDialog;
