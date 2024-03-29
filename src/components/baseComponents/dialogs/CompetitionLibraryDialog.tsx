import React from "react";
import Dialog from "@material-ui/core/Dialog";
import SpriteIcon from "../SpriteIcon";
import { isPhone } from "services/phone";

interface DialogProps {
  isOpen: boolean;
  close(): void;
  submit(): void;
}

const CompetitionLibraryDialog: React.FC<DialogProps> = ({ isOpen, close, submit }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box custom-popup-d35">
      <div className="close-button svgOnHover" onClick={close}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="flex-center m-b-10">
        <div className="red-circle-icon-d35">
          <SpriteIcon name="alert-triangle" />
        </div>
      </div>
      <div className="dialog-header">
        <div className="bold" style={{ textAlign: 'center' }}>There is a competition running for this brick. {isPhone() ? '' : <br />} You cannot view your answers until it is over.</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-green yes-button" onClick={submit}>
          <span>Enter Competition</span>
        </button>
      </div>
    </Dialog>
  );
};

export default CompetitionLibraryDialog;
