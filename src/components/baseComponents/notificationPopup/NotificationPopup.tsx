import React from 'react';
import { connect } from 'react-redux';
import { Popover } from '@material-ui/core';
import { ReduxCombinedState } from 'redux/reducers';
import sprite from "assets/img/icons-sprite.svg";
import { Notification, notificationTypeColors, NotificationType } from 'model/notifications';
import moment from 'moment';
import './NotificationPopup.scss';

import actions from 'redux/actions/brickActions';
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

interface NotificationPopupProps {
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

const NotificationPopup: React.FC<NotificationPopupProps> = props => {
  if(!(props.notifications && props.notifications.length > 0) || Date.now() - new Date(props.notifications![0].timestamp).valueOf() > 300000) {
    return <></>;
  }

  const notification = props.notifications[0];

  return (
    <Popover
      open={props.shown}
      onClose={props.handleClose}
      anchorReference={props.anchorElement ? "anchorEl" : "none"}
      anchorEl={props.anchorElement}
      className={props.shown ? "notification-popup active":"notification-popup hidden"}
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
        <div className="notification-container">
          <div
            className={"left-brick-circle svgOnHover " + notificationTypeColors[notification.type]}
          >
            {notification.type === NotificationType.BrickSubmittedForReview &&
              <SpriteIcon name="send" className="w60 h60 active text-theme-dark-blue send-icon-center" />
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
          <div className="content-box">
            <div className="notification-detail">
              <p className="notif-title">{notification.title}</p>
              <p className="notif-desc">{notification.text}</p>
            </div>
            <div className="actions">
              <button aria-label="clear" className="btn btn-transparent delete-notification svgOnHover" onClick={props.handleClose}>
                <SpriteIcon name="arrow-up" className="w80 h80 active" />
              </button>
              <div className="notification-time">{moment(notification.timestamp).fromNow()}</div>
            </div>
          </div>
        </div>
      </div>
    </Popover>
  );
}

export default connector(NotificationPopup);
