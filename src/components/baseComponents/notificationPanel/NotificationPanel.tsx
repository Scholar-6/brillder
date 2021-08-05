import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Popover, IconButton, SvgIcon } from "@material-ui/core";
import { ReduxCombinedState } from "redux/reducers";
import { Notification, NotificationType } from "model/notifications";
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
import NotificationItem from "./NotificationItem";

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
      if (notification.type === NotificationType.BrickSubmittedForReview) {
        if (isPhone()) {
          this.setState({ needDesktopOpen: true });
        } else {
          history.push(map.backToWorkUserBased(this.props.user));
        }
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
            history.push(routes.playNewPrep(brick.id));
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
          history.push(routes.playCover(brick.id));
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
    const { notifications } = this.props;
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
          <div
            className={`notification-content ${
              notifications && notifications.length === 0 ? "empty" : ""
            }`}
          >
            {isPhone() && notifications && notifications.length > 0 && (
              <div className="notification-top">
                <div>
                  <div>{notifications?.length} Notifications</div>
                  <div className="n-secondary">
                    Swipe to clear
                    <SpriteIcon name="flaticon-swipe" />
                  </div>
                </div>
              </div>
            )}
            <ul className="notification-list" ref={this.state.scrollArea}>
              {/* eslint-disable-next-line */}
              {notifications && notifications.length != 0 ? (
                notifications.map((notification, i) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    move={this.move.bind(this)}
                    markAsRead={this.markAsRead.bind(this)}
                  />
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
            {notifications && notifications.length != 0 && (
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
            secondaryLabel=""
            onClick={() => this.setState({ needDesktopOpen: false })}
          />
        </Popover>
      </React.Suspense>
    );
  }
}

export default connector(NotificationPanel);
