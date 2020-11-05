import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";


interface SkipTutorialDialogProps {
  open: boolean;
  close(): void;
  skip(): void;
}

const SkipTutorialDialog: React.FC<SkipTutorialDialogProps> = ({
  open, skip, close
}) => {
  return (
    <BaseDialogWrapper open={open} close={close} submit={skip}>
      <div className="dialog-header">
        <div>Skip tutorial?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={skip}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={close}>
          <span>No</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default SkipTutorialDialog;
