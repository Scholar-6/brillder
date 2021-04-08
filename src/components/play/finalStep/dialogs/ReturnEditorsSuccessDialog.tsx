import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Editor } from "model/brick";

interface InvitationProps {
  isOpen: boolean;
  editors: Editor[] | undefined;
  close(): void;
}

const ReturnEditorsSuccessDialog: React.FC<InvitationProps> = props => {
  let getEditors2 = () => {
    let text = '';
    const { editors } = props;
    if (editors) {
      editors.forEach((e, i) => {
        if (i > 0 && editors.length - 1 === i) {
          text += ' & ' + e.firstName;
        } else if (i > 0) {
          text += ', ' + e.firstName;
        } else {
          text += e.firstName;
        }
      });
    }
    return text;
  }

  let getEditors = () => {
    let text = '';
    const { editors } = props;
    if (editors) {
      editors.forEach((e, i) => {
        if (i > 0 && editors.length - 1 === i) {
          text += ' & ' + e.firstName;
        } else {
          text += ', ' + e.firstName;
        }
      });
    }
    return text;
  }
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
          <span className="bold">{`Over to you${getEditors()}`}</span>
          <span className="italic">{`${getEditors2()} will be able to review your changes`}</span>
        </div>
      </div>
    </Dialog>
  );
};

export default ReturnEditorsSuccessDialog;
