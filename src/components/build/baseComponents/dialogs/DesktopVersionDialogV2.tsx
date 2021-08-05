import React from "react";
import Dialog from '@material-ui/core/Dialog';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import './DesktopVersionDialog.scss';

interface DesktopVersionProps {
  isOpen: boolean;
  secondaryLabel?: string;
  secondaryClass?: string;
  onClick(): void;
}

const DesktopVersionDialogV2:React.FC<DesktopVersionProps> = ({isOpen, secondaryLabel, onClick}) => {
  return (
    <Dialog open={isOpen} onClick={onClick} className="desktop-version-dialog dialog-box link-copied-dialog pointer">
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary="You're going to need a bigger boat!" className="bold" style={{ minWidth: '30vw' }} />
          <ListItemAvatar style={{padding: 0}}>
            <Avatar className="circle-orange">
              <SpriteIcon name="life-buoy" className="active text-white stroke-2" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
        <ListItemText primary={secondaryLabel} className="italic" style={{ minWidth: '30vw', margin: 0 }} />
        <ListItemText primary="Try a laptop or desktop computer." className="italic" style={{ minWidth: '30vw', margin: 0 }} />
      </div>
    </Dialog>
  );
}

export default DesktopVersionDialogV2;
