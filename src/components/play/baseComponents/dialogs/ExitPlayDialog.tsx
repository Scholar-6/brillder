import React from "react";
import Dialog from "@material-ui/core/Dialog";

import map from "components/map";

interface InvitationProps {
  isOpen: boolean;
  subjectId?: number;
  history: any;
  close(): void;
}

const ExitPlayDialog: React.FC<InvitationProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <div>Exit? Your attempt will not be saved.</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={() => {
          props.history.push(map.ViewAllPage + `?subjectId=${props.subjectId}`);
          props.close();
        }}>
          <span>Yes, Exit</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={props.close}>
          <span>No, keep learning</span>
        </button>
      </div>
    </Dialog>
  );
};

export default ExitPlayDialog;
