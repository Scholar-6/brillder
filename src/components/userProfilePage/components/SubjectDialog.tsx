import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface SubjectDialogProps {
  isOpen: boolean;
  close(): void;
}

const SubjectDialog: React.FC<SubjectDialogProps> = ({ isOpen, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary="Please choose at least one subject" className="bold" style={{ minWidth: '30vw' }} />
          <ListItemAvatar>
            <Avatar className="circle-check alert-icon">
              <SpriteIcon name="alert-triangle" className="active stroke-2 m-b-03" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
      </div>
    </Dialog>
  );
};

export default SubjectDialog;
