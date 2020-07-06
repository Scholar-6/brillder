import React, { Component } from 'react';
import axios from 'axios';
// @ts-ignore
import { connect } from 'react-redux';
import { List, ListItem, ListItemText, Popover, ListItemSecondaryAction, IconButton, SvgIcon, Card, CardContent, CardHeader, Button } from '@material-ui/core';
import { ReduxCombinedState } from 'redux/reducers';
import sprite from "../../../assets/img/icons-sprite.svg";
import { Notification } from 'model/notifications';
import notificationActions from 'redux/actions/notifications';
import { Dispatch } from 'redux';

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
  markAsRead(id: number) {
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/notifications/markAsRead/${id}`,
      {},
      { withCredentials: true }
    );
  }

  markAllAsRead() {
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/notifications/unread/markAsRead`,
      {},
      { withCredentials: true }
    );
  }

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
        <Card>
          <CardHeader
            title="Notifications"
            action={
              <Button
                onClick={() => this.markAllAsRead()}
              >Mark All Read</Button>
            }
          />
          <CardContent>
            <List>
              {this.props.notifications && this.props.notifications.map((notification) => (
                <ListItem key={notification.id}>
                  <ListItemText primary={notification.title} secondary={notification.text} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => this.markAsRead(notification.id)}>
                      <SvgIcon className="svg svg-default">
                        <use href={sprite + "#eye-on"} />
                      </SvgIcon>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Popover>
    );
  }
}

export default connector(NotificationPanel);