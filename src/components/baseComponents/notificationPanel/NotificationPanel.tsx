import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Popover, IconButton, SvgIcon } from '@material-ui/core';
import { ReduxCombinedState } from 'redux/reducers';
import sprite from "assets/img/icons-sprite.svg";
import { Notification, notificationTypeColors, NotificationType } from 'model/notifications';
import moment from 'moment';
import './NotificationPanel.scss';

import map from 'components/map';
import actions from 'redux/actions/brickActions';
import { isMobile } from 'react-device-detect';
import { checkTeacherEditorOrAdmin } from 'components/services/brickService';
import { User } from 'model/user';
import SpriteIcon from '../SpriteIcon';

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(actions.forgetBrick()),
  fetchBrick: (id: number) => dispatch(actions.fetchBrick(id)),
});

const connector = connect(mapState, mapDispatch);

interface NotificationPanelProps {
  shown: boolean;
  handleClose(): void;
  anchorElement: any;
  history?: any;

  // redux
  user: User;
  notifications: Notification[] | null;
  forgetBrick(): void;
  fetchBrick(brickId: number): Promise<void>;
}

class NotificationPanel extends Component<NotificationPanelProps> {
  async move(notification: Notification) {
    const { history } = this.props;
    if (history) {
      if (notification.type === NotificationType.BrickPublished) {
        history.push(map.ViewAllPage);
      } else if (notification.type === NotificationType.BrickSubmittedForReview) {
        history.push(map.BackToWorkPage);
      }

      if (notification.brick && notification.brick.id) {
        const {brick} = notification;
        if (notification.type === NotificationType.NewCommentOnBrick) {
          if (notification.question && notification.question.id >= 1) {
            history.push(map.investigationQuestionSuggestions(brick.id, notification.question.id));
          }
        } else if (notification.type === NotificationType.InvitedToPlayBrick) {
          history.push(map.playIntro(brick.id));
        } else if (notification.type === NotificationType.BrickAttemptSaved) {
          history.push(map.postPlay(brick.id, this.props.user.id));
        } else if (notification.type === NotificationType.ReturnedToEditor) {
          history.push(map.InvestigationBuild(brick.id));
        } else if (notification.type === NotificationType.AssignedToEdit) {
          this.props.forgetBrick();
          await this.props.fetchBrick(notification.brick.id);
          history.push(map.ProposalReview);
        } else if (notification.type === NotificationType.ReturnedToAuthor) {
          this.props.forgetBrick();
          await this.props.fetchBrick(notification.brick.id);
          history.push(map.ProposalReview);
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
        <div className="notification-content">
            <ul className="notification-list">
              {/* eslint-disable-next-line */}
              {(this.props.notifications && this.props.notifications.length != 0) ? this.props.notifications.map((notification) => (
                <li key={notification.id}>
                  <div
                    className={"left-brick-circle svgOnHover " + notificationTypeColors[notification.type]}
                    onClick={() => this.move(notification)}
                  >
                    {notification.type === NotificationType.BrickSubmittedForReview &&
                      <SpriteIcon name="message-square" className="w60 h60 active text-theme-dark-blue" />
                    }
                    {notification.type === NotificationType.AssignedToEdit &&
                      <SpriteIcon name="edit-outline" className="w60 h60 active text-theme-dark-blue" />
                    }
                    {notification.type === NotificationType.BrickPublished &&
                      <SpriteIcon name="award" className="w60 h60 active text-theme-dark-blue stroke-2" />
                    }
                    {notification.type === NotificationType.NewCommentOnBrick &&
                      <SpriteIcon name="message-square-thick" className="w60 h60 active text-theme-dark-blue" />
                    }
                    {notification.type === NotificationType.InvitedToPlayBrick &&
                      <svg className="svg w60 h60 active text-theme-dark-blue" style={{marginLeft: '0.2vw'}}>
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#play-thick"} />
                      </svg>
                    }
                    {notification.type === NotificationType.BrickAttemptSaved &&
                      <svg className="svg w60 h60 active text-theme-dark-blue stroke-2" style={{marginRight: '0vw'}}>
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#book-open"} />
                      </svg>
                    }
                    {notification.type === NotificationType.ReturnedToAuthor &&
                      <svg className="svg w60 h60 active text-theme-dark-blue stroke-2" style={{marginRight: '0vw'}}>
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#repeat"} />
                      </svg>
                    }
                    {notification.type === NotificationType.ReturnedToEditor &&
                      <svg className="svg w60 h60 active text-theme-dark-blue stroke-2" style={{marginRight: '0vw'}}>
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#repeat"} />
                      </svg>
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
                        <SpriteIcon name="cancel" className="w80 h80 active" />
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
          {/* eslint-disable-next-line */}
          {(this.props.notifications && this.props.notifications.length != 0) &&
            <div className="clear-notification">
              <div className="bold">Clear All</div>
              <IconButton aria-label="clear-all" onClick={() => this.markAllAsRead()}>
                <SvgIcon>
                  <SpriteIcon name="circle-cancel" className="text-white" />
                </SvgIcon>
              </IconButton>
            </div>
          }
        </div>
      </Popover>
    );
  }
}

export default connector(NotificationPanel);
