import React from 'react';
import Dialog from '@material-ui/core/Dialog';


interface AssignPersonOrClassProps {
  isOpen: boolean;
  close(): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box dark-blue"
    >
      <div className="dialog-header">
        <div>Who would you like to assign this brick to?</div>
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

export default AssignPersonOrClassDialog;
