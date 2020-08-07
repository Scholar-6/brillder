import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { List, ListItem, ListItemText, Popover, IconButton, SvgIcon, Card, CardContent, ListItemIcon, CardActions } from '@material-ui/core';
import { ReduxCombinedState } from 'redux/reducers';
import sprite from "assets/img/icons-sprite.svg";
import { Notification, notificationTypeColors } from 'model/notifications';
import moment from 'moment';
import './NotificationPanel.scss';

const mapState = (state: ReduxCombinedState) => ({
  notifications: state.notifications.notifications
});

const connector = connect(mapState);

interface NotificationPanelProps {
  shown: boolean;
  notifications: Notification[] | null;
  handleClose(): void;
  anchorElement: any;
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
              {/* eslint-disable-next-line */}
              {(this.props.notifications && this.props.notifications.length != 0) ? this.props.notifications.map((notification) => (
                <ListItem key={notification.id}>
                  <ListItemIcon className="left-brick-circle">
                    <SvgIcon fontSize="large">
                      <svg>
                        <circle cx="50%" cy="50%" r="50%" fill={notificationTypeColors[notification.type]} />
                      </svg>
                    </SvgIcon>
                  </ListItemIcon>
                  <div className="content-box">
                    <ListItemText className="notification-detail" primary={notification.title} secondary={notification.text} />
                    <div className="actions">
                      <div className="notification-time">{moment(notification.timestamp).fromNow()}</div>
                      <button aria-label="clear" className="btn btn-transparent delete-notification svgOnHover" onClick={() => this.markAsRead(notification.id)}>
                        <svg className="svg w80 h80 active">
                          {/*eslint-disable-next-line*/}
                          <use href={sprite + "#cancel"} />
                        </svg>
                      </button>
                    </div>
                  </div>
                </ListItem>
              )) :
                (
                  <ListItem>
                    <div className="content-box">
                      <ListItemText className="notification-detail-single" primary="Looks like you don't have any notifications..." />
                    </div>
                  </ListItem>
                )
              }
            </List>
          </CardContent>
          {/* eslint-disable-next-line */}
          {(this.props.notifications && this.props.notifications.length != 0) &&
            <CardActions className="clear-notification">
              <div>Clear All</div>
              <IconButton aria-label="clear-all" onClick={() => this.markAllAsRead()}>
                <SvgIcon>
                  <svg className="svg text-white">
                    {/*eslint-disable-next-line*/}
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
