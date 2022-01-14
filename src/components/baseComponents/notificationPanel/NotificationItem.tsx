import React from "react";
import moment from "moment";
import { Swiper, SwiperSlide } from "swiper/react";

import SpriteIcon from "../SpriteIcon";
import sprite from "assets/img/icons-sprite.svg";
import {
  Notification,
  NotificationType,
  notificationTypeColors,
} from "model/notifications";
import { isPhone } from "services/phone";
import TeachIcon from "components/mainPage/components/TeachIcon";

interface Props {
  notification: Notification;
  move(n: Notification): void;
  markAsRead(notificationId: number): void;
}

const NotificationItem: React.FC<Props> = ({
  notification,
  markAsRead,
  move,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const renderElement = () => {
    return (
      <li
        className={expanded ? "expanded" : ""}
        key={notification.id}
        onClick={() => move(notification)}
      >
        <div
          className={
            "left-brick-circle svgOnHover " +
            notificationTypeColors[notification.type]
          }
        >
          {notification.type === NotificationType.BrickSubmittedForReview && (
            <SpriteIcon
              name="send"
              className="w60 h60 active text-theme-dark-blue send-icon-center"
            />
          )}
          {notification.type === NotificationType.AssignedToEdit && (
            <SpriteIcon
              name="edit-outline"
              className="w60 h60 active text-theme-dark-blue"
            />
          )}
          {notification.type === NotificationType.BrickPublished && (
            <SpriteIcon
              name="award"
              className="w60 h60 active text-theme-dark-blue stroke-2"
            />
          )}
          {notification.type === NotificationType.NewCommentOnBrick && (
            <SpriteIcon
              name="message-square-thick"
              className="w60 h60 active text-theme-dark-blue"
            />
          )}
          {notification.type === NotificationType.InvitedToPlayBrick && (
            <svg
              className="svg w60 h60 active text-theme-dark-blue"
              style={{ marginLeft: "0.2vw" }}
            >
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#play-thick"} />
            </svg>
          )}
          {notification.type === NotificationType.BrickAttemptSaved && (
            <svg
              className="svg w60 h60 active text-theme-dark-blue stroke-2"
              style={{ marginRight: "0vw" }}
            >
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#book-open"} />
            </svg>
          )}
          {notification.type === NotificationType.ReturnedToAuthor && (
            <svg
              className="svg w60 h60 active text-theme-dark-blue stroke-2"
              style={{ marginRight: "0vw" }}
            >
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#repeat"} />
            </svg>
          )}
          {notification.type === NotificationType.ReturnedToEditor && (
            <svg
              className="svg w60 h60 active text-theme-dark-blue stroke-2"
              style={{ marginRight: "0vw" }}
            >
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#repeat"} />
            </svg>
          )}
          {notification.type === NotificationType.StudentAssignedBrick && (
            <SpriteIcon
              name="file-plus"
              className="w60 h60 active text-theme-dark-blue"
            />
          )}
          {notification.type === NotificationType.RemindedToPlayBrick && (
            <SpriteIcon
              name="reminder"
              className="w60 h60 active text-theme-dark-blue stroke-2"
            />
          )}
          {notification.type === NotificationType.TeacherInvitation && <TeachIcon className="teach-icon-notif" />}
        </div>
        <div className="content-box">
          <div className="notification-detail">
            {isPhone() &&
            <p className="notification-time">
              {moment(notification.timestamp).fromNow()}
            </p>}
            <p
              className="notif-title"
              dangerouslySetInnerHTML={{ __html: notification.title }}
            />
            <p
              className="notif-desc"
              dangerouslySetInnerHTML={{ __html: notification.text }}
            />
          </div>
          {isPhone() && (
            <SpriteIcon
              name={expanded ? "arrow-up" : "arrow-down"}
              onClick={(e) => {
                setExpanded(!expanded);
                e.stopPropagation();
              }}
              className="np-expand-button"
            />
          )}
          {!isPhone() && (
            <div className="actions">
              <div className="notification-time">
                {moment(notification.timestamp).fromNow()}
              </div>
              <button
                aria-label="clear"
                className="btn btn-transparent delete-notification svgOnHover"
                onClick={(e) => {
                  markAsRead(notification.id);
                  e.stopPropagation();
                }}
              >
                <SpriteIcon name="cancel" className="w80 h80 active" />
              </button>
            </div>
          )}
        </div>
      </li>
    );
  };

  if (isPhone()) {
    return (
      <Swiper
        key={notification.id}
        slidesPerView={1}
        initialSlide={1}
        onReachBeginning={() => markAsRead(notification.id)}
        onReachEnd={() => markAsRead(notification.id)}
      >
        <SwiperSlide />
        <SwiperSlide>{renderElement()}</SwiperSlide>
        <SwiperSlide />
      </Swiper>
    );
  }
  return renderElement();
};

export default NotificationItem;
