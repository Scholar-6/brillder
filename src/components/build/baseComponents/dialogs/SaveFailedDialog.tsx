import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";

import './SaveDialog.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface SkipTutorialDialogProps {
  open: boolean;
  close(): void;
}

const SaveFailedDialog: React.FC<SkipTutorialDialogProps> = ({
  open, close
}) => {
  return (
    <BaseDialogWrapper open={open} className="save-brick-dialog" close={close} submit={close}>
      <div className="dialog-header bold">
        <div className="flex-center">
          <SpriteIcon name="feather-wifi-off" className="wifi-off-big" />
        </div>
        <div className="flex-center bigger-text">
          Uh-oh, we've lost you!
        </div>
        <div className="flex-center italic smaller">
          Please check your internet connection,
        </div>
        <div className="flex-center italic smaller">
          or send us a help ticket via the button below.
        </div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange bold yes-button" onClick={close}>
          <span>Continue</span>
        </button>
      </div>
    </BaseDialogWrapper >
  );
}

export default SaveFailedDialog;
