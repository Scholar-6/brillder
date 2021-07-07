import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Popover, IconButton, SvgIcon } from "@material-ui/core";
import { ReduxCombinedState } from "redux/reducers";
import sprite from "assets/img/icons-sprite.svg";
import {
  Notification,
  notificationTypeColors,
  NotificationType,
} from "model/notifications";
import moment from "moment";
import "./NotificationPanel.scss";

import map from "components/map";
import actions from "redux/actions/brickActions";
import { isMobile } from "react-device-detect";
import { checkTeacherEditorOrAdmin } from "components/services/brickService";
import { User } from "model/user";
import SpriteIcon from "../SpriteIcon";
import DesktopVersionDialogV2 from "components/build/baseComponents/dialogs/DesktopVersionDialogV2";
import { isPhone } from "services/phone";
import routes from "components/play/routes";
import notifications from "redux/actions/notifications";

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications,
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(actions.forgetBrick()),
  fetchBrick: (id: number) => dispatch(actions.fetchBrick(id)),
});

const connector = connect(mapState, mapDispatch);

const MobileTheme = React.lazy(() => import("./themes/MobileTheme"));

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

interface NotificationsState {
  needDesktopOpen: boolean;
  scrollArea: React.RefObject<HTMLUListElement>;
  canScroll: boolean;
}

class NotificationPanel extends Component<
  NotificationPanelProps,
  NotificationsState
> {
  constructor(props: NotificationPanelProps) {
    super(props);
    this.state = {
      scrollArea: React.createRef(),
      needDesktopOpen: false,
      canScroll: false,
    };
  }

  async move(notification: Notification) {
    const { history } = this.props;
    if (history) {
      if (
        notification.type === NotificationType.BrickSubmittedForReview
      ) {
        history.push(map.BackToWorkPage);
      }

      if (notification.brick && notification.brick.id) {
        const { type, brick } = notification;
        if (notification.type === NotificationType.BrickPublished) {
          history.push(routes.playCover(brick.id));
        } else if (type === NotificationType.NewCommentOnBrick) {
          if (notification.question && notification.question.id >= 1) {
            history.push(
              map.investigationQuestionSuggestions(
                brick.id,
                notification.question.id
              )
            );
          } else {
            history.push(map.investigationSynthesisSuggestions(brick.id));
          }
        } else if (type === NotificationType.InvitedToPlayBrick) {
          if (isPhone()) {
            history.push(map.playIntro(brick.id));
          } else {
            history.push(routes.playCover(brick.id));
          }
        } else if (type === NotificationType.BrickAttemptSaved) {
          if (isMobile) {
            this.setState({ needDesktopOpen: true });
          } else {
            history.push(map.postPlay(brick.id, notification.sender.id));
          }
        } else if (type === NotificationType.ReturnedToEditor) {
          history.push(map.InvestigationBuild(brick.id));
        } else if (type === NotificationType.AssignedToEdit) {
          this.props.forgetBrick();
          await this.props.fetchBrick(brick.id);
          history.push(map.Proposal(brick.id));
        } else if (type === NotificationType.ReturnedToAuthor) {
          this.props.forgetBrick();
          await this.props.fetchBrick(brick.id);
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
  }

  checkScroll() {
    const { canScroll } = this.state;
    const { current } = this.state.scrollArea;
    if (current) {
      if (current.scrollHeight > current.clientHeight) {
        if (!canScroll) {
          this.setState({ canScroll: true });
        }
      } else {
        if (canScroll) {
          this.setState({ canScroll: false });
        }
      }
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.checkScroll();
    }, 200);
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.checkScroll();
    }, 200);
  }

  scrollUp() {
    const { current } = this.state.scrollArea;
    if (current) {
      current.scrollBy(0, -window.screen.height / 30);
    }
  }

  scrollDown() {
    const { current } = this.state.scrollArea;
    if (current) {
      current.scrollBy(0, window.screen.height / 30);
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
    if (isMobile) {
      return "";
    }
    let canSee = checkTeacherEditorOrAdmin(this.props.user);
    if (canSee) {
      return (
        <em>
          “Nothing strengthens authority so much as silence”
          <br />- Leonardo da Vinci
        </em>
      );
    }
    return (
      <em>
        “Why then the world's mine oyster...”
        <br />- Shakespeare
      </em>
    );
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        {isPhone() && <MobileTheme />}
        <Popover
          open={this.props.shown}
          onClose={this.props.handleClose}
          anchorReference={this.props.anchorElement ? "anchorEl" : "none"}
          anchorEl={this.props.anchorElement}
          className={
            this.props.shown
              ? "notification-box active"
              : "notification-box hidden"
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div className="notification-content">
            {isPhone() && (
              <div className="notification-top">
                <div>
                  <div>{this.props.notifications?.length} Notifications</div>
                  <div className="n-secondary">
                    Swipe right to clear
                    <SpriteIcon name="flaticon-swipe" />
                  </div>
                </div>
              </div>
            )}
            <ul className="notification-list" ref={this.state.scrollArea}>
              {/* eslint-disable-next-line */}
              {this.props.notifications &&
              this.props.notifications.length != 0 ? (
                this.props.notifications.map((notification) => (
                  <li
                    key={notification.id}
                    onClick={() => this.move(notification)}
                  >
                    <div
                      className={
                        "left-brick-circle svgOnHover " +
                        notificationTypeColors[notification.type]
                      }
                    >
                      {notification.type ===
                        NotificationType.BrickSubmittedForReview && (
                        <SpriteIcon
                          name="send"
                          className="w60 h60 active text-theme-dark-blue send-icon-center"
                        />
                      )}
                      {notification.type ===
                        NotificationType.AssignedToEdit && (
                        <SpriteIcon
                          name="edit-outline"
                          className="w60 h60 active text-theme-dark-blue"
                        />
                      )}
                      {notification.type ===
                        NotificationType.BrickPublished && (
                        <SpriteIcon
                          name="award"
                          className="w60 h60 active text-theme-dark-blue stroke-2"
                        />
                      )}
                      {notification.type ===
                        NotificationType.NewCommentOnBrick && (
                        <SpriteIcon
                          name="message-square-thick"
                          className="w60 h60 active text-theme-dark-blue"
                        />
                      )}
                      {notification.type ===
                        NotificationType.InvitedToPlayBrick && (
                        <svg
                          className="svg w60 h60 active text-theme-dark-blue"
                          style={{ marginLeft: "0.2vw" }}
                        >
                          {/*eslint-disable-next-line*/}
                          <use href={sprite + "#play-thick"} />
                        </svg>
                      )}
                      {notification.type ===
                        NotificationType.BrickAttemptSaved && (
                        <svg
                          className="svg w60 h60 active text-theme-dark-blue stroke-2"
                          style={{ marginRight: "0vw" }}
                        >
                          {/*eslint-disable-next-line*/}
                          <use href={sprite + "#book-open"} />
                        </svg>
                      )}
                      {notification.type ===
                        NotificationType.ReturnedToAuthor && (
                        <svg
                          className="svg w60 h60 active text-theme-dark-blue stroke-2"
                          style={{ marginRight: "0vw" }}
                        >
                          {/*eslint-disable-next-line*/}
                          <use href={sprite + "#repeat"} />
                        </svg>
                      )}
                      {notification.type ===
                        NotificationType.ReturnedToEditor && (
                        <svg
                          className="svg w60 h60 active text-theme-dark-blue stroke-2"
                          style={{ marginRight: "0vw" }}
                        >
                          {/*eslint-disable-next-line*/}
                          <use href={sprite + "#repeat"} />
                        </svg>
                      )}
                      {notification.type ===
                        NotificationType.StudentAssignedBrick && (
                        <SpriteIcon
                          name="file-plus"
                          className="w60 h60 active text-theme-dark-blue"
                        />
                      )}
                      {notification.type ===
                        NotificationType.RemindedToPlayBrick && (
                        <SpriteIcon
                          name="reminder"
                          className="w60 h60 active text-theme-dark-blue stroke-2"
                        />
                      )}
                    </div>
                    <div className="content-box">
                      <div className="notification-detail">
                        <p
                          className="notif-title"
                          dangerouslySetInnerHTML={{
                            __html: notification.title,
                          }}
                        />
                        <p
                          className="notif-desc"
                          dangerouslySetInnerHTML={{
                            __html: notification.text,
                          }}
                        />
                      </div>
                      {!isPhone() &&
                      <div className="actions">
                        <div className="notification-time">
                          {moment(notification.timestamp).fromNow()}
                        </div>
                        <button
                          aria-label="clear"
                          className="btn btn-transparent delete-notification svgOnHover"
                          onClick={(e) => {
                            this.markAsRead(notification.id);
                            e.stopPropagation();
                          }}
                        >
                          <SpriteIcon
                            name="cancel"
                            className="w80 h80 active"
                          />
                        </button>
                      </div>}
                    </div>
                  </li>
                ))
              ) : (
                <li className="no-hover">
                  <div className="notification-detail-single">
                    You have no new notifications
                    <br />
                    {this.renderQuotes()}
                  </div>
                </li>
              )}
            </ul>
            {/* eslint-disable-next-line */}
            {this.props.notifications && this.props.notifications.length != 0 && (
              <div className="clear-notification">
                <div className="scroll-buttons">
                  <SpriteIcon
                    name="arrow-up"
                    onClick={this.scrollUp.bind(this)}
                  />
                  <SpriteIcon
                    name="arrow-down"
                    onClick={this.scrollDown.bind(this)}
                  />
                </div>
                <div
                  className="clear-all-button"
                  onClick={() => this.markAllAsRead()}
                >
                  <div className="bold clickable">Clear All</div>
                  <IconButton aria-label="clear-all" className="clear-icon">
                    <SvgIcon>
                      <SpriteIcon name="circle-cancel" className="text-white" />
                    </SvgIcon>
                  </IconButton>
                </div>
              </div>
            )}
          </div>
          <DesktopVersionDialogV2
            isOpen={this.state.needDesktopOpen}
            secondaryLabel="Brick summaries have not yet been optimised for mobile devices."
            onClick={() => this.setState({ needDesktopOpen: false })}
          />
        </Popover>
      </React.Suspense>
    );
  }
}

export default connector(NotificationPanel);
