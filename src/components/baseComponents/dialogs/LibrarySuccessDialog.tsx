import React from "react";
import Dialog from "@material-ui/core/Dialog";

import SpriteIcon from "../SpriteIcon";

interface DialogProps {
  isOpen: boolean;
  close(): void;
  submit(): void;
}

const LibrarySuccessDialog: React.FC<DialogProps> = ({ isOpen, close, submit }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box custom-popup-d35">
      <div className="dialog-header">
        <div className="flex-center">
          <div className="green-circle-icon-d35">
            <SpriteIcon name="check-custom" />
          </div>
        </div>
        <div className="text-center custom-title-d35">Library Linked!</div>
        <div className="custom-text-d35">
          You now have free access to our entire catalogue.
        </div>
        <div className="dialog-footer">
          <button className="btn margin-top-d324 btn-md bg-theme-green yes-button" onClick={submit}>
            <span>Continue</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default LibrarySuccessDialog;
