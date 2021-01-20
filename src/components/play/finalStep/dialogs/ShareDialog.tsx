import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface ShareProps {
  isOpen: boolean;
  link(): void;
  invite(): void;
  close(): void;
}

const ShareDialog: React.FC<ShareProps> = props => {
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
        <div className="title">How would you like to share this brick?</div>
      </div>
      <div className="social-share-row">
        <SpriteIcon name="link" onClick={props.link} />
        <SpriteIcon name="user-plus" onClick={props.invite} />
        {/*
        <SpriteIcon name="email-feather" className="active" />
        <SpriteIcon name="whatsapp" className="active" />
        <SpriteIcon name="facebook" className="active" />
        <SpriteIcon name="instagram" className="active" />
        <SpriteIcon name="twitter" className="active" />
        */}
      </div>
    </Dialog>
  );
}

export default ShareDialog;
