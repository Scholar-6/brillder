import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import './ShareDialog.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import SpriteHoverIcon from 'components/baseComponents/SpriteHoverIcon';

interface ShareProps {
  isOpen: boolean;
  link(): void;
  invite(): void;
  close(): void;
}

const ShareDialog: React.FC<ShareProps> = props => {
  const [linkHovered, setLinkHover] = React.useState(false);
  const [inviteHovered, setInviteHover] = React.useState(false);

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue unlimited"
    >
      <div className="close-button svgOnHover" onClick={props.close}>
        <SpriteIcon name="cancel-thick" className="active" />
      </div>
      <div className="dialog-header">
        <div className="title smaller">How would you like to share this brick?</div>
      </div>
      <div className="social-share-row">
        <div className="svgOnHover tooltip top" onClick={props.link}>
          <SpriteIcon name="link" className="active text-white" />
          <span className="tooltip-inner">Copy Link</span>
        </div>
        <div className="svgOnHover tooltip top" onClick={props.invite}>
          <SpriteIcon name="user-plus" className="active text-white" />
          <span className="tooltip-inner">Invite an existing user</span>
        </div>
      </div>
    </Dialog>
  );
}

export default ShareDialog;
