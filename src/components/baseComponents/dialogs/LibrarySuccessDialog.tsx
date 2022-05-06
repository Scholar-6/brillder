import React from "react";
import Dialog from "@material-ui/core/Dialog";
 
import SpriteIcon from "../SpriteIcon";

interface DialogProps {
  isOpen: boolean;
  close(): void;
}

const LibrarySuccessDialog: React.FC<DialogProps> = ({ isOpen, close }) => {
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
          You can now play bricks in the catalogue for free. Competition bricks will still require 2 credits to enter.
        </div>
      </div>
    </Dialog>
  );
};

export default LibrarySuccessDialog;