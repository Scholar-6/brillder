import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Popover, IconButton, SvgIcon, Card, CardContent, CardActions } from '@material-ui/core';
import { ReduxCombinedState } from 'redux/reducers';
import sprite from "assets/img/icons-sprite.svg";
import { Notification, notificationTypeColors, NotificationType } from 'model/notifications';
import moment from 'moment';
import './NotificationPanel.scss';

import map from 'components/map';
import { isMobile } from 'react-device-detect';
import { checkTeacherEditorOrAdmin } from 'components/services/brickService';
import { User } from 'model/user';

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
});

const connector = connect(mapState);

interface NotificationPanelProps {
  user: User;
  shown: boolean;
  notifications: Notification[] | null;
  handleClose(): void;
  anchorElement: any;
  history?: any;
}

class NotificationPanel extends Component<NotificationPanelProps> {
  move(notification: Notification) {
    const { history } = this.props;
    if (history) {
      if (notification.type === NotificationType.BrickPublished) {
        history.push(map.ViewAllPage);
      } else if (notification.type === NotificationType.AssignedToEdit || notification.type === NotificationType.BrickSubmittedForReview) {
        if (notification.type === NotificationType.AssignedToEdit) {
          window.location.href = map.BackToWorkBuildTab;
        } else {
          history.push(map.BackToWorkPage);
        }
      } else if (notification.type === NotificationType.NewCommentOnBrick) {
        if (notification.brick && notification.brick.id >= 1 && notification.question && notification.question.id >= 1) {
          history.push(map.investigationQuestionSuggestions(notification.brick.id, notification.question.id));
        }
      } else if (notification.type === NotificationType.InvitedToPlayBrick) {
        if (notification.brick && notification.brick.id >= 1) {
          history.push(map.playIntro(notification.brick.id));
        }
      }
    }
  }

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

  renderQuotes() {
    if (isMobile) { return ""; }
    let canSee = checkTeacherEditorOrAdmin(this.props.user);
    if (canSee) {
      return (
        <em>“Nothing strengthens authority so much as silence”<br />- Leonardo da Vinci</em>
      );
    }
    return (
      <em>“Why then the world's mine oyster...”<br />- Shakespeare</em>
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
            <ul className="notification-list">
              {/* eslint-disable-next-line */}
              {(this.props.notifications && this.props.notifications.length != 0) ? this.props.notifications.map((notification) => (
                <li key={notification.id}>
                  <div className={"left-brick-circle svgOnHover " + notificationTypeColors[notification.type]}
                    onClick={() => this.move(notification)}>
                    {notification.type === NotificationType.Generic ?
                      ""
                      :
                      ""
                    }
                    {notification.type === NotificationType.BrickSubmittedForReview ?
                      <svg className="svg w60 h60 active text-theme-dark-blue">
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#message-square"} />
                      </svg>
                      :
                      ""
                    }
                    {notification.type === NotificationType.AssignedToEdit ?
                      <svg className="svg w60 h60 active text-theme-dark-blue">
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#edit-outline"}/>
                      </svg>
                      :
                      ""
                    }
                    {notification.type === NotificationType.BrickPublished ?
                      <svg className="svg w60 h60 active text-theme-dark-blue">
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#award"} />
                      </svg>
                      :
                      ""
                    }
                    {notification.type === NotificationType.NewCommentOnBrick ?
                      <svg className="svg w60 h60 active text-theme-dark-blue">
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#message-square-thick"} />
                      </svg>
                      :
                      ""
                    }
                    {notification.type === NotificationType.InvitedToPlayBrick ?
                      <svg className="svg w60 h60 active text-theme-dark-blue" style={{marginLeft: '0.2vw'}}>
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#play-thick"} />
                      </svg>
                      :
                      ""
                    }
                  </div>
                  <div className="content-box" onClick={() => this.move(notification)}>
                    <div className="notification-detail">
                      <p className="notif-title">{notification.title}</p>
                      <p className="notif-desc">{notification.text}</p>
                    </div>
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
                </li>
              )) :
                (
                  <li>
                    <div className="notification-detail-single">
                      You have no new notifications
                      <br />
                      {this.renderQuotes()}
                    </div>
                  </li>
                )
              }
            </ul>
          </CardContent>
          {/* eslint-disable-next-line */}
          {(this.props.notifications && this.props.notifications.length != 0) &&
            <CardActions className="clear-notification">
              <div className="bold">Clear All</div>
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
