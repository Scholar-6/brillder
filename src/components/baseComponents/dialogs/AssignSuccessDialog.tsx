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
  selectedItems: any[];
  brickTitle: string;
  close(): void;
}

const AssignSuccessDialog: React.FC<DialogProps> = props => {
  let itemsText = '';
  const title = stripHtml(props.brickTitle);

  const capitalize = (n: string) => {
    if (n && n.length > 1) {
      return n[0].toLocaleUpperCase() + n.substring(1);
    }
    return '';
  }

  let index = 0;
  for (let item of props.selectedItems) {
    if (item.isStudent) {
      itemsText += capitalize(item.firstName) + ' ' + capitalize(item.lastName);
    } else {
      itemsText += capitalize(item.name);
    }
    index+= 1;
    if (index === props.selectedItems.length - 1) {
      itemsText += ' and ';
    } else if (index < props.selectedItems.length - 1) {
      itemsText += ', ';
    }
  }

  return (
    <Dialog
      open={props.isOpen} onClick={props.close} onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText
            primary={ `${title} has been assigned to ${itemsText}.`}
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

export default AssignSuccessDialog;
