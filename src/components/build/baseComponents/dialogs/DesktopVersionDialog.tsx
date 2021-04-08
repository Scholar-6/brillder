import React from "react";
import Dialog from '@material-ui/core/Dialog';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface DesktopVersionProps {
  history: any;
}

const DesktopVersionDialog: React.FC<DesktopVersionProps> = ({ history }) => {
  return (
    <Dialog
      open={true}
      onClick={() => history.push('/home')}
      className="dialog-box link-copied-dialog poiter"
    >
      <div className="dialog-header">
        <div>
          <Avatar className="circle-check bg-theme-orange">
            <SpriteIcon name="life-buoy" className="active text-white" />
          </Avatar>
        </div>
        <div>
          <span className="bold">You're going to need a bigger boat</span>
          <span className="italic">Try a laptop or desktop computer for this page</span>
        </div>
      </div>
    </Dialog>
  );
}

export default DesktopVersionDialog;
