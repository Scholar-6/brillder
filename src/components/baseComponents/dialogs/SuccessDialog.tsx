import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import sprite from "assets/img/icons-sprite.svg";

interface SuccessDialogProps {
  isOpen: boolean;
  header: string;
  label?: string;
  icon?: string;
  close(): void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClick={props.close}
      onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary={props.header} className="bold" style={{ minWidth: '30vw' }} />
          <ListItemAvatar>
            <Avatar className="circle-check">
              <svg className="svg active stroke-2" style={{marginBottom: '0.3vw'}}>
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#" + (props.icon ? props.icon : "ok")} />
              </svg>
            </Avatar>
          </ListItemAvatar>
        </ListItem>
        {props.label &&
        <ListItem>
          <ListItemText primary={props.label} className="italic" style={{ minWidth: '30vw' }} />
        </ListItem>}
      </div>
    </Dialog>
  );
};

export default SuccessDialog;
