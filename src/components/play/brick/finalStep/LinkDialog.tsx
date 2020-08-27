import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import sprite from "assets/img/icons-sprite.svg";

interface InviteProps {
  isOpen: boolean;
  link: string
  close(): void;
}

const LinkDialog: React.FC<InviteProps> = props => {
  const copyToClipboard = () => {
    var linkEl = document.getElementById('invite-link') as HTMLInputElement;
    if (linkEl) {
      linkEl.select();
      linkEl.setSelectionRange(0, 99999);
      document.execCommand('copy');
      props.close();
    }
  }

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue">
      <div className="close-button">
        <svg className="svg active" onClick={props.close}>
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#cancel"} />
        </svg>
      </div>
      <div className="dialog-header">
        <div>{props.link}</div>
      </div>
      <input id="invite-link" style={{ opacity: 0, height: 0 }} value={props.link} />
      <div className="dialog-footer" style={{justifyContent: 'center'}}>
        <button className="btn btn-md bg-theme-orange yes-button" style={{width: 'auto'}} onClick={copyToClipboard}>
          <span>Copy link</span>
        </button>
      </div>
    </Dialog>
  );
}

export default LinkDialog;
