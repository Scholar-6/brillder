import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "components/baseComponents/SpriteIcon";

import { Author } from "model/brick";

interface InvitationProps {
  isOpen: boolean;
  author: Author;
  close(): void;
}

const ReturnAuthorSuccessDialog: React.FC<InvitationProps> = props => {
  const { firstName, lastName } = props.author;

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
        <div>
          <Avatar className="circle-check">
            <SpriteIcon name="repeat" className="active text-white stroke-2" />
          </Avatar>
        </div>
        <div>
          <span className="bold">{`Over to you ${first} ${last}`}</span>
          <span className="italic">{`${first} ${last} will be able to review your suggestions`}</span>
        </div>
      </div>
    </Dialog>
  );
};

export default ReturnAuthorSuccessDialog;
