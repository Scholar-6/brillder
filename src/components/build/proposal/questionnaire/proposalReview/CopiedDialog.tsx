import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface DialogProps {
  isOpen: boolean;
  title: string;
  close(): void;
}

const CopiedDialog: React.FC<DialogProps> = props => {
  return (
    <Dialog
      open={props.isOpen} onClick={props.close} onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <div>
          <Avatar className="circle-check">
            <SpriteIcon name="copy" className="active text-white stroke-2" />
          </Avatar>
        </div>
        <div>
          <span className="bold">{`A copy of ${props.title} is ready for you to adapt!`}</span>
          {/* <span className="italic">Click refresh and see if we can get over it</span> */}
        </div>
      </div>
    </Dialog>
  );
};

export default CopiedDialog;
