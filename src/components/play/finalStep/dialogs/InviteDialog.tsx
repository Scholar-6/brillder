import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import sprite from "assets/img/icons-sprite.svg";
import { Radio } from '@material-ui/core';

interface InviteProps {
  isOpen: boolean;
  link(): void;
  close(): void;
}

const InviteDialog: React.FC<InviteProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue unlimited"
    >
      <div className="close-button">
        <svg className="svg active" onClick={props.close}>
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#cancel-thick"} />
        </svg>
      </div>
      <div className="dialog-header">
        <div className="title left">Who would you like to invite to play this brick?</div>
        <div style={{marginTop: '1.8vh'}}></div>
        <input />
        <div style={{marginTop: '1.8vh'}}></div>
        <div className="title left">Grant editing access?</div>
        <div className="text left">Allow “Name” to comment on the build panels of your brick</div>
        <div className="title left">
          Yes <Radio className="white" style={{marginRight: '4vw'}} />  No <Radio className="white" />
        </div>
      </div>
      <div style={{marginTop: '1.8vh'}}></div>
      <div className="dialog-footer" style={{justifyContent: 'center'}}>
        <button className="btn btn-md bg-theme-orange yes-button" style={{width: 'auto', paddingLeft: '4vw'}} onClick={props.close}>
          Send Invite
          <svg className="svg active send-icon" onClick={props.close}>
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#send"} />
          </svg>
        </button>
      </div>
    </Dialog>
  );
}

export default InviteDialog;
