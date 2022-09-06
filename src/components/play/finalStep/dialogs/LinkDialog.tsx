import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User } from 'model/user';

interface InviteProps {
  isOpen: boolean;
  link: string
  submit(): void;
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
      props.submit();
    }
  }

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue unlimited">
      <div className="close-button svgOnHover" onClick={props.close}>
        <SpriteIcon name="cancel-thick" className="active" />
      </div>
      <div className="dialog-header">
        <div className="link">{props.link}</div>
      </div>
      <input id="invite-link" style={{ opacity: 0, height: 0 }} value={props.link} />
      <div className="dialog-footer" style={{ justifyContent: 'center' }}>
        <button className="btn btn-md bg-theme-orange yes-button" style={{ width: 'auto' }} onClick={copyToClipboard}>
          <span className="bold">Copy Link</span>
        </button>
      </div>
    </Dialog>
  );
}

export default LinkDialog;
