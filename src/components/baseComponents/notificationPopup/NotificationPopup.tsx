import React from 'react';
import { connect } from 'react-redux';
import { Popper } from '@material-ui/core';
import { ReduxCombinedState } from 'redux/reducers';
import sprite from "assets/img/icons-sprite.svg";
import { Notification, notificationTypeColors, NotificationType } from 'model/notifications';
import moment from 'moment';
import './NotificationPopup.scss';

import map from 'components/map';
import actions from 'redux/actions/brickActions';
import notificationActions from 'redux/actions/notifications';
import { User } from 'model/user';
import { isMobile } from 'react-device-detect';
import SpriteIcon from '../SpriteIcon';
import DesktopVersionDialogV2 from 'components/build/baseComponents/dialogs/DesktopVersionDialogV2';
import { isPhone } from 'services/phone';
import routes from 'components/play/routes';

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications,
  shown: state.notifications.latestNotificationShown,
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(actions.forgetBrick()),
  fetchBrick: (id: number) => dispatch(actions.fetchBrick(id)),
  dismiss: () => dispatch(notificationActions.notificationLatestDismissed())
});

const connector = connect(mapState, mapDispatch);

interface NotificationPopupProps {
  anchorElement: any;
  history?: any;

  // redux
  user: User;
  notifications: Notification[] | null;
  shown: boolean;
  forgetBrick(): void;
  fetchBrick(brickId: number): Promise<void>;
  dismiss(): void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = props => {

  const [needDesktopOpen, setNeedDesktopOpen] = React.useState(false);

  if(!(props.notifications && props.notifications.length > 0) || !props.shown) {
    return <></>;
  }

  const notification = props.notifications[0];

  const move = async (notification: Notification) => {
    const { history } = props;
    if (history) {
      if (notification.type === NotificationType.BrickSubmittedForReview) {
        history.push(map.BackToWorkPage);
      }

      if (notification.brick && notification.brick.id) {
        const {type, brick} = notification;
        if (notification.type === NotificationType.BrickPublished) {
          history.push(routes.playCover(brick.id));
        } else if (type === NotificationType.NewCommentOnBrick) {
          if (notification.question && notification.question.id >= 1) {
            history.push(map.investigationQuestionSuggestions(brick.id, notification.question.id));
          } else {
            history.push(map.investigationSynthesisSuggestions(brick.id))
          }
        } else if (type === NotificationType.InvitedToPlayBrick) {
          if (isPhone()) {
            history.push(map.playIntro(brick.id));
          } else {
            history.push(routes.playCover(brick.id));
          }
        } else if (type === NotificationType.BrickAttemptSaved) {
          if (isMobile) {
            setNeedDesktopOpen(true);
          } else {
            history.push(map.postPlay(brick.id, notification.sender.id));
          }
        } else if (type === NotificationType.ReturnedToEditor) {
          history.push(map.InvestigationBuild(brick.id));
        } else if (type === NotificationType.AssignedToEdit) {
          props.forgetBrick();
          await props.fetchBrick(brick.id);
          history.push(map.Proposal(brick.id));
        } else if (type === NotificationType.ReturnedToAuthor) {
          props.forgetBrick();
          await props.fetchBrick(brick.id);
          history.push(map.Proposal(brick.id));
        } else if (
          type === NotificationType.RemindedToPlayBrick ||
          type === NotificationType.StudentAssignedBrick
        ) {
          if (isPhone()) {
            history.push(map.playIntro(brick.id));
          } else {
            history.push(routes.playCover(brick.id));
          }
        }
      }
    }
    props.dismiss();
  }

  return (
    <Popper
      open={props.shown}
      anchorEl={props.anchorElement}
      className={props.shown ? "notification-popup active":"notification-popup hidden"}
      placement="bottom-end"
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
            {notification.type === NotificationType.StudentAssignedBrick &&
              <SpriteIcon name="file-plus" className="w60 h60 active text-theme-dark-blue" />
            }
            {notification.type === NotificationType.RemindedToPlayBrick &&
              <SpriteIcon name="reminder" className="w60 h60 active text-theme-dark-blue stroke-2" />
            }
          </div>
          <div className="content-box" onClick={() => move(notification)}>
            <div className="notification-detail">
              <p className="notif-title" dangerouslySetInnerHTML={{__html: notification.title}} />
              <p className="notif-desc" dangerouslySetInnerHTML={{__html: notification.text}} />
            </div>
            <div className="actions">
              <button aria-label="clear" className="btn btn-transparent delete-notification svgOnHover" onClick={(e) => {
                props.dismiss();
                e.stopPropagation();
              }}>
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
    </Popper>
  );
}

export default connector(NotificationPopup);
