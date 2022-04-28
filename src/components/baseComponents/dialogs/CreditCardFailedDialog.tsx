import React from "react";
import Dialog from "@material-ui/core/Dialog";

import SpriteIcon from "../SpriteIcon";

interface DialogProps {
  isOpen: boolean;
  close(): void;
}

const CreditCardFailedDialog: React.FC<DialogProps> = ({ isOpen, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box custom-popup-d35">
      <div className="close-button svgOnHover" onClick={close}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="dialog-header">
        <div className="flex-center">
          <div className="red-circle-icon-d35">
            <SpriteIcon name="alert-triangle" />
          </div>
        </div>
        <div className="text-center custom-title-d35">Card Failed please try another card</div>
      </div>
    </Dialog>
  );
};

export default CreditCardFailedDialog;
