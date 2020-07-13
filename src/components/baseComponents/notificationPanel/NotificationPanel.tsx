import React, { Component } from 'react';
import axios from 'axios';
// @ts-ignore
import { connect } from 'react-redux';
import { List, ListItem, ListItemText, Popover, ListItemSecondaryAction, IconButton, SvgIcon, Card, CardContent, CardHeader, Button, ListItemIcon, ListItemAvatar, Grid, CardActions } from '@material-ui/core';
import { ReduxCombinedState } from 'redux/reducers';
import sprite from "../../../assets/img/icons-sprite.svg";
import { Notification, notificationTypeColors } from 'model/notifications';
import notificationActions from 'redux/actions/notifications';
import { Dispatch } from 'redux';
import moment from 'moment';
import './NotificationPanel.scss';

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
        anchorReference={this.props.anchorElement ? "anchorEl" : "none"}
        anchorEl={this.props.anchorElement}
        className="notification-box"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Card className="notification-content">
          <CardContent>
            <List className="notification-list">
              {(this.props.notifications &&
                this.props.notifications.length != 0) ?
                this.props.notifications.map((notification) => (
                  <ListItem key={notification.id}>
                    <ListItemIcon className="left-brick-circle">
                      <SvgIcon fontSize="large">
                        <svg>
                          <circle cx="50%" cy="50%" r="50%" fill={notificationTypeColors[notification.type]} />
                        </svg>
                      </SvgIcon>
                    </ListItemIcon>
                    <ListItemText className="notification-detail" primary={notification.title} secondary={notification.text} />
                    <Grid direction="column">
                      <Grid className="notification-time">{moment(notification.timestamp).fromNow()}</Grid>
                      <IconButton aria-label="clear" className="delete-notification" onClick={() => this.markAsRead(notification.id)}>
                        <SvgIcon>
                          <svg className="svg">
                            <use href={sprite + "#cancel"} />
                          </svg>
                        </SvgIcon>
                      </IconButton>
                    </Grid>
                  </ListItem>
                )) :
                (
                  <ListItem>
                    <ListItemText primary="Looks like you don't have any notifications..." />
                  </ListItem>
                )
              }
            </List>
          </CardContent>
          {(this.props.notifications &&
            this.props.notifications.length != 0) &&
            <CardActions className="clear-notification">
              <div>Clear All</div>
              <IconButton aria-label="clear-all" onClick={() => this.markAllAsRead()}>
                <SvgIcon>
                  <svg className="svg text-white">
                    <use href={sprite + "#circle-cancel"} />
                  </svg>
                </SvgIcon>
              </IconButton>
            </CardActions>}
        </Card>
      </Popover>
    );
  }
}

export default connector(NotificationPanel);