import React from 'react';
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  close(): void;
}

const SameCategoryDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} className="dialog-box" onClose={props.close}>
        <div className="dialog-header">
          <div className="bold">Some Category Headings are the same</div>
          <div>This will confuse students. Please make sure they are all different</div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-gray yes-button" onClick={props.close}>
            <span>Ok</span>
          </button>
        </div>
      </Dialog>
  );
}

export default SameCategoryDialog;
