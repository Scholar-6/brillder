import React from 'react';
import Dialog from '@material-ui/core/Dialog';


interface CommingSoonProps {
  isOpen: boolean;
  close(): void;
}

const CommingSoonDialog: React.FC<CommingSoonProps> = (props) => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box"
    >
      <div className="dialog-header">
        <div>Coming soon! If you have any suggestions for this feature,</div>
        <div>send us a message via the 'Help' ('?') button in the bottom</div>
        <div>left of this screen</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.close}>
          <span>Ok</span>
        </button>
      </div>
    </Dialog>
  );
}

export default CommingSoonDialog;
