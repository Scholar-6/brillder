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
          <CardContent>
            <List>
              {(this.props.notifications &&
                this.props.notifications.length != 0) ?
                this.props.notifications.map((notification) => (
                  <ListItem key={notification.id}>
                    <Grid container direction="row" alignItems="center" spacing={2}>
                      <Grid item>
                        <ListItemIcon>
                          <SvgIcon fontSize="large">
                            <svg>
                              <circle cx="50%" cy="50%" r="50%" fill={notificationTypeColors[notification.type]} />
                            </svg>
                          </SvgIcon>
                        </ListItemIcon>
                      </Grid>
                      <Grid item>
                        <ListItemText primary={notification.title} secondary={notification.text} />
                      </Grid>
                      <Grid item direction="column">
                        <Grid>{moment(notification.timestamp).fromNow()}</Grid>
                        <Grid>
                          <IconButton onClick={() => this.markAsRead(notification.id)}>
                            <SvgIcon>
                              <svg className="svg">
                                <use href={sprite + "#cancel"} />
                              </svg>
                            </SvgIcon>
                          </IconButton>
                        </Grid>
                      </Grid>
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
          <CardActions>
            <div>Clear All</div>
            <IconButton onClick={() => this.markAllAsRead()}>
              <SvgIcon>
                <svg className="svg">
                  <use href={sprite + "#cancel"} />
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