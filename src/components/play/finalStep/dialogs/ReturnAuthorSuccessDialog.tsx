import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import sprite from "assets/img/icons-sprite.svg";
import { Author } from "model/brick";

interface InvitationProps {
  isOpen: boolean;
  author: Author;
  close(): void;
}

const ReturnAuthorSuccessDialog: React.FC<InvitationProps> = props => {
  const {firstName, lastName} = props.author;

  const capitalize = (n: string) => {
    if (n && n.length > 1) {
      return n[0].toLocaleUpperCase() + n.substring(1);
    }
    return '';
  }

  const first = capitalize(firstName);
  const last = capitalize(lastName);

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary={`Over to you ${first} ${last}`} className="bold" style={{ minWidth: '30vw' }} />
          <ListItemAvatar>
            <Avatar className="circle-check">
              <svg className="svg active">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#repeat"} className="text-white stroke-2" />
              </svg>
            </Avatar>
          </ListItemAvatar>
        </ListItem>
        <ListItem>
          <ListItemText primary={`${first} ${last} will be able to review your suggestions`} className="italic" style={{ minWidth: '30vw' }} />
        </ListItem>
      </div>
    </Dialog>
  );
};

export default ReturnAuthorSuccessDialog;
