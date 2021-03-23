import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";


interface SkipTutorialDialogProps {
  open: boolean;
  save(): void;
  close(): void;
}

const SaveDialog: React.FC<SkipTutorialDialogProps> = ({
  open, save, close
}) => {
  return (
    <BaseDialogWrapper open={open} close={close} submit={save}>
      <div className="dialog-header">
        <div>Stop building for now?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={save}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={close}>
          <span>No</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default SaveDialog;
