import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import sprite from "assets/img/icons-sprite.svg";
import { Editor } from "model/brick";

interface InvitationProps {
  isOpen: boolean;
  editors: Editor[] | undefined;
  close(): void;
}

const ReturnEditorsSuccessDialog: React.FC<InvitationProps> = props => {
  let getEditors2 = () => {
    let text = '';
    const {editors} = props;
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
    const {editors} = props;
    if (editors) {
      if (editors.length === 1) {
        text+= ' ' + editors[0].firstName;
      } else {
        editors.forEach((e, i) => {
          if (i > 0 && editors.length - 1 === i) {
            text += ' & ' + e.firstName;
          } else {
            text += ', ' + e.firstName;
          }
        });
      }
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
        <ListItem>
          <ListItemText primary={`Over to you${getEditors()}`} className="bold" style={{ minWidth: '30vw' }} />
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
          <ListItemText primary={`${getEditors2()} will be able to review your changes`} className="italic" style={{ minWidth: '30vw' }} />
        </ListItem>
      </div>
    </Dialog>
  );
};

export default ReturnEditorsSuccessDialog;
