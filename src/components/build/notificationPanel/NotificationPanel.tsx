import React, { Component } from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { ReduxCombinedState } from 'redux/reducers';
import { Notification } from 'model/notifications';

const mapState = (state: ReduxCombinedState) => ({
  notifications: state.notifications.notifications
});

const connector = connect(mapState);

interface NotificationPanelProps {
  shown: boolean;
  notifications: Notification[];
}

class NotificationPanel extends Component<NotificationPanelProps> {
  render() {
    return (
      <List>
        {this.props.notifications.map((notification) => (
          <ListItem>
            <ListItemText primary={notification.title} secondary={notification.text} />
          </ListItem>
        ))}
      </List>
    );
  }
}

export default connector(NotificationPanel);