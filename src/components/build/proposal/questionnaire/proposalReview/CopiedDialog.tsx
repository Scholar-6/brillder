import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import sprite from "assets/img/icons-sprite.svg";
import { stripHtml } from "components/build/questionService/ConvertService";

interface DialogProps {
  isOpen: boolean;
  title: string;
  close(): void;
}

const CopiedDialog: React.FC<DialogProps> = props => {
  const title = stripHtml(props.title);
  return (
    <Dialog
      open={props.isOpen} onClick={props.close} onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary={`A copy of ${title} is ready for you to adapt!`} className="bold" style={{ minWidth: '30vw' }} />
          <ListItemAvatar>
            <Avatar className="circle-check">
              <svg className="svg active" style={{marginLeft: 0, marginTop: '0.3vw', marginRight: '0.3vw'}}>
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#copy"} className="text-white" />
              </svg>
            </Avatar>
          </ListItemAvatar>
        </ListItem>
      </div>
    </Dialog>
  );
};

export default CopiedDialog;
