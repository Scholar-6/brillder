import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import './ShareDialog.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import SpriteHoverIcon from 'components/baseComponents/SpriteHoverIcon';

interface ShareProps {
  isOpen: boolean;
  isPrivatePreview?: boolean;
  realLink: string;
  link(): void;
  invite(): void;
  close(): void;
}

const ShareDialog: React.FC<ShareProps> = props => {
  const [linkHovered, setLinkHover] = React.useState(false);
  const [inviteHovered, setInviteHover] = React.useState(false);
  const [whatsappHovered, setWhatsappHover] = React.useState(false);

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
        <div>
          <SpriteHoverIcon name="link" onClick={props.link} onHover={() => setLinkHover(true)} onBlur={() => setLinkHover(false)} />
          {linkHovered && <div className="custom-tooltip copy-tooltip bold">Copy Link</div>}
        </div>
        {!props.isPrivatePreview &&
          <div>
            <div  onMouseLeave={() => setWhatsappHover(false)} onMouseEnter={() => setWhatsappHover(true)} onClick={() => {
              const a = document.createElement('a');
              a.target = "_blank";
              a.href = "whatsapp://send?text=https://app.brillder.com" + props.realLink;
              console.log(props.realLink);
              a.click();
            }}>
            <SpriteIcon name='whatsapp' />
            </div>
            {whatsappHovered && <div className="custom-tooltip whatsapp-tooltip bold">WhatsApp</div>}
          </div>}
        {!props.isPrivatePreview &&
          <div>
            <SpriteHoverIcon name="user-plus" onClick={props.invite} onBlur={() => setInviteHover(false)} onHover={() => setInviteHover(true)} />
            {inviteHovered && <div className="custom-tooltip invite-tooltip bold">Invite an existing user</div>}
          </div>}
      </div>
    </Dialog>
  );
}

export default ShareDialog;
