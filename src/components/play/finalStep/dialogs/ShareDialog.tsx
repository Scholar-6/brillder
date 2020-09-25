import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import sprite from "assets/img/icons-sprite.svg";

interface ShareProps {
  isOpen: boolean;
  link(): void;
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
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#cancel-thick"} />
        </svg>
      </div>
      <div className="dialog-header">
        <div className="title">How would you like to share this brick?</div>
      </div>
      <div className="social-share-row">
        <svg className="svg active" onClick={props.link}>
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#link"} />
        </svg>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#email-feather"} />
        </svg>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#whatsapp"} />
        </svg>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#facebook"} />
        </svg>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#instagram"} />
        </svg>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#twitter"} />
        </svg>
      </div>
    </Dialog>
  );
}

export default ShareDialog;
