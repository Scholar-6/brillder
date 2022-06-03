import React from "react";
import Dialog from "@material-ui/core/Dialog";

import SpriteIcon from "../SpriteIcon";

interface DialogProps {
  isOpen: boolean;
  close(): void;
}

const LibraryFailedDialog: React.FC<DialogProps> = ({ isOpen, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box custom-popup-d35">
      <div className="dialog-header">
        <div className="flex-center">
          <div className="red-circle-icon-d35">
            <SpriteIcon name="alert-triangle" />
          </div>
        </div>
        <div className="text-center custom-title-d35">Authentification unsuccessful</div>
        <div className="custom-text-d35">
          Please try again or click the help button in the bottom left to send us a ticket.
        </div>
      </div>
    </Dialog>
  );
};

export default LibraryFailedDialog;
