import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import sprite from "assets/img/icons-sprite.svg";

interface InviteProps {
  isOpen: boolean;
  link: string
  close(): void;
}

const InviteDialog: React.FC<InviteProps> = props => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue">
      <div className="close-button">
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#cancel"} />
        </svg>
      </div>
      <div className="dialog-header">
        <div>{props.link}</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.close}>
          <span>Copy link</span>
        </button>
      </div>
    </Dialog>
  );
}

export default InviteDialog;
