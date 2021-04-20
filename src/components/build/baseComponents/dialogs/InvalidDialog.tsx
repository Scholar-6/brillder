import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface DialogProps {
  isOpen: boolean;
  label: string;
  close(): void;
}

const InvalidDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
      <div className="dialog-header" style={{marginBottom: 0}}>
      <ListItem>
        <ListItemText primary={props.label} className="bold" style={{ minWidth: '30vw' }} />
        <ListItemAvatar style={{padding: 0}}>
          <Avatar className="circle-orange">
            <SpriteIcon name="alert-triangle" className="active text-white stroke-2 w-3 m-b-02" />
          </Avatar>
        </ListItemAvatar>
      </ListItem>
        <div></div>
      </div>
    </Dialog>
  );
}

export default InvalidDialog;
