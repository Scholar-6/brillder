import React from "react";
import Dialog from "@material-ui/core/Dialog";
 
import SpriteIcon from "../SpriteIcon";

interface DialogProps {
  isOpen: boolean;
  close(): void;
  submit?(): void;
}

const LibrarySuggestSuccessDialog: React.FC<DialogProps> = ({ isOpen, close, submit }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box custom-popup-d35">
      <div className="dialog-header">
        <div className="flex-center">
          <div className="green-circle-icon-d35">
            <SpriteIcon name="check-custom" />
          </div>
        </div>
        <div className="text-center custom-title-d35">Thank you for your suggestion!</div>
        <div className="text-center custom-title-d35s">We will contact your library shortly.</div>
        <div className="text-center custom-title-d35s">In the meantime, please finish signing up. You will be able to add your library details later.</div>
        <div className="custom-text-d35d flex-center">
          <button className="btn btn-md bg-theme-dark-blue yes-button" onClick={submit}>
            <span>Continue</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default LibrarySuggestSuccessDialog;
