import React, { Component } from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import { List, ListItem, ListItemText, Popover, ListItemSecondaryAction, IconButton, SvgIcon, ListSubheader } from '@material-ui/core';
import { ReduxCombinedState } from 'redux/reducers';
import sprite from "../../../assets/img/icons-sprite.svg";
import { Notification } from 'model/notifications';

const mapState = (state: ReduxCombinedState) => ({
  notifications: state.notifications.notifications
});

const connector = connect(mapState);

interface NotificationPanelProps {
  shown: boolean;
  notifications: Notification[];
  handleClose(): void;
  anchorElement: Element | ((el: Element) => Element);
}

class NotificationPanel extends Component<NotificationPanelProps> {
  render() {
    return (
      <Popover
        open={this.props.shown}
        onClose={this.props.handleClose}
        anchorEl={this.props.anchorElement}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List
          subheader={
            <ListSubheader component="div">
              Notifications
            </ListSubheader>
          }
        >
          {this.props.notifications && this.props.notifications.map((notification) => (
            <ListItem>
              <ListItemText primary={notification.title} secondary={notification.text} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <SvgIcon className="svg svg-default">
                    <use href={sprite + "#eye-on"} />
                  </SvgIcon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Popover>
    );
  }
}

export default connector(NotificationPanel);