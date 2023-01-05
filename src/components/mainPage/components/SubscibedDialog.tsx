import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import './SubscibedDialog.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface AddSubjectProps {
  isOpen: boolean;
  close(): void;
}

const SubscribedDialog: React.FC<AddSubjectProps> = (props) => {
  return (
    <Dialog
      open={props.isOpen} onClick={props.close} onClose={props.close}
      className="dialog-box link-copied-dialog welcome-premium"
    >
      <div className="container flex-center">
        <div className="circle-check flex-center">
          <SpriteIcon name="hero-sparkle" />
        </div>
      </div>
      <div className="dialog-header">
        Thank you for subscribing!
      </div>
      <div className="message">
        Your support means a lot to our small company.
      </div>
    </Dialog>
  );
}

export default SubscribedDialog;
