import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


interface AddSubjectProps {
  isOpen: boolean;
  close(): void;
}

const SubscribedDialog: React.FC<AddSubjectProps> = (props) => {
  return (
    <Dialog
      open={props.isOpen} onClick={props.close} onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText
            primary="Welcome to Brillder Premium!"
            className="bold" style={{ minWidth: '30vw' }}
          />
          <ListItemAvatar>
            <Avatar className="circle-check">
              <SpriteIcon name="hero-sparkle" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
      </div>
    </Dialog>
  );
}

export default SubscribedDialog;
