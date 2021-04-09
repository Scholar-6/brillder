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
        <div>
          <Avatar className="circle-check bg-theme-orange">
            <SpriteIcon name="alert-triangle" className="active text-white stroke-2" />
          </Avatar>
        </div>
        <div>
          <span className="bold">Please choose at least one subject</span>
          {/* <span className="italic">Publisher will be able to publish this brick</span> */}
        </div>
      </div>
    </Dialog>
  );
};

export default SubjectDialog;
