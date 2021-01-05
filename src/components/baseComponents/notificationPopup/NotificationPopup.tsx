import React from 'react';
import { connect } from 'react-redux';
import { Popover } from '@material-ui/core';
import { ReduxCombinedState } from 'redux/reducers';
import sprite from "assets/img/icons-sprite.svg";
import { Notification, notificationTypeColors, NotificationType } from 'model/notifications';
import moment from 'moment';
import './NotificationPopup.scss';

import map from 'components/map';
import actions from 'redux/actions/brickActions';
import { User } from 'model/user';
import { isMobile } from 'react-device-detect';
import SpriteIcon from '../SpriteIcon';
import DesktopVersionDialogV2 from 'components/build/baseComponents/dialogs/DesktopVersionDialogV2';

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

  const [needDesktopOpen, setNeedDesktopOpen] = React.useState(false);

  if(!(props.notifications && props.notifications.length > 0) || Date.now() - new Date(props.notifications![0].timestamp).valueOf() > 300000) {
    return <></>;
  }

  const notification = props.notifications[0];

  const move = async (notification: Notification) => {
    const { history } = props;
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
          } else {
            history.push(map.investigationSynthesisSuggestions(brick.id))
          }
        } else if (notification.type === NotificationType.InvitedToPlayBrick) {
          history.push(map.playIntro(brick.id));
        } else if (notification.type === NotificationType.BrickAttemptSaved) {
          if (isMobile) {
            setNeedDesktopOpen(true);
          } else {
            history.push(map.postPlay(brick.id, props.user.id));
          }
        } else if (notification.type === NotificationType.ReturnedToEditor) {
          history.push(map.InvestigationBuild(brick.id));
        } else if (notification.type === NotificationType.AssignedToEdit) {
          props.forgetBrick();
          await props.fetchBrick(notification.brick.id);
          history.push(map.ProposalReview);
        } else if (notification.type === NotificationType.ReturnedToAuthor) {
          props.forgetBrick();
          await props.fetchBrick(notification.brick.id);
          history.push(map.ProposalReview);
        }
      }
    }
  }

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
            onClick={() => move(notification)}
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
          <div className="content-box" onClick={() => move(notification)}>
            <div className="notification-detail">
              <p className="notif-title">{notification.title}</p>
              <p className="notif-desc">{notification.text}</p>
            </div>
            <div className="actions">
              <button aria-label="clear" className="btn btn-transparent delete-notification svgOnHover" onClick={props.handleClose}>
                <SpriteIcon name="cancel" className="w80 h80 active" />
              </button>
              <div className="notification-time">{moment(notification.timestamp).fromNow()}</div>
            </div>
          </div>
        </div>
      </div>
      <DesktopVersionDialogV2
        isOpen={needDesktopOpen}
        secondaryLabel="Brick summaries have not yet been optimised for mobile devices."
        onClick={() => setNeedDesktopOpen(false)}
      />
    </Popover>
  );
}

export default connector(NotificationPopup);
