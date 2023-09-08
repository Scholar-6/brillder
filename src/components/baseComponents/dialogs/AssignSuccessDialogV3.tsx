import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "../SpriteIcon";
import { stripHtml } from "components/build/questionService/ConvertService";

interface DialogProps {
  isOpen: boolean;
  classroomName: string;
  brickTitle: string;
  close(): void;
}

const AssignSuccessDialogV3: React.FC<DialogProps> = props => {
  const title = stripHtml(props.brickTitle);

  return (
    <Dialog
      open={props.isOpen} onClick={props.close} onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText
            primary={ `${title} has been assigned to ${props.classroomName}.`}
            className="bold" style={{ minWidth: '30vw' }}
          />
          <ListItemAvatar>
            <Avatar className="circle-check">
              <SpriteIcon name="file-plus" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
      </div>
    </Dialog>
  );
};

export default AssignSuccessDialogV3;
