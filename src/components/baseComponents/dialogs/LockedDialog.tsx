import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface LockedProps {
  isOpen: boolean;
  label: string;
  close(): void;
}

const LockedDialog: React.FC<LockedProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClick={props.close}
      onClose={props.close}
      className="dialog-box link-copied-dialog locked-dialog"
    >
      <div className="dialog-header">
        <div className="circle-orange">
          <SpriteIcon name="lock" className="active text-white stroke-2" />
        </div>
        <p className="bold">{props.label}</p>
      </div>
    </Dialog>
  );
};

export default LockedDialog;
