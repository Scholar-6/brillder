import React from "react";
import Dialog from '@material-ui/core/Dialog';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface DesktopVersionProps {
  isOpen: boolean;
  secondaryLabel?: string;
  secondaryClass?: string;
  onClick(): void;
}

const DesktopVersionDialogV2: React.FC<DesktopVersionProps> = ({ isOpen, secondaryLabel, onClick }) => {
  return (
    <Dialog open={isOpen} onClick={onClick} className="dialog-box link-copied-dialog pointer">
      <div className="dialog-header">
        <div>
          <Avatar className="circle-check bg-theme-orange">
            <SpriteIcon name="life-buoy" className="active text-white" />
          </Avatar>
        </div>
        <div>
          <span className="bolder">You're going to need a bigger boat</span>
          <span className="bold">{secondaryLabel}</span>
          <span className="italic">Try a laptop or desktop computer.</span>
        </div>
      </div>
    </Dialog>
  );
}

export default DesktopVersionDialogV2;
