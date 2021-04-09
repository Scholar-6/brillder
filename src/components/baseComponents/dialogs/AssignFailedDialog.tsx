import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface DialogProps {
  isOpen: boolean;
  selectedItems: any[];
  brickTitle: string;
  close(): void;
}

const AssignFailedDialog: React.FC<DialogProps> = props => {
  let itemsText = '';

  const capitalize = (n: string) => {
    if (n && n.length > 1) {
      return n[0].toLocaleUpperCase() + n.substring(1);
    }
    return '';
  }

  let index = 0;
  for (let item of props.selectedItems) {
    if (item.classroom) {
      itemsText += capitalize(item.classroom.name);
    } else {
      const { student } = item;
      itemsText += capitalize(student.firstName) + ' ' + capitalize(student.lastName);
    }
    index += 1;
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
        <div>
          <Avatar className="circle-check bg-theme-orange">
            <SpriteIcon name="alert-triangle" className="active text-white stroke-2" />
          </Avatar>
        </div>
        <div>
          <span className="bold">{`You have already assigned ${props.brickTitle} to ${itemsText}.`}</span>
          {/* <span className="italic">{`${getEditors2()} will be able to review your changes`}</span> */}
        </div>
      </div>
    </Dialog>
  );
};

export default AssignFailedDialog;
