import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { IconButton, SvgIcon } from "@material-ui/core";
import { ReduxCombinedState } from "redux/reducers";
import {
  Notification,
  NotificationType,
} from "model/notifications";

import map from "components/map";
import actions from "redux/actions/brickActions";
import { isMobile } from "react-device-detect";
import { checkTeacherEditorOrAdmin } from "components/services/brickService";
import { User } from "model/user";
import SpriteIcon from "../SpriteIcon";
import DesktopVersionDialogV2 from "components/build/baseComponents/dialogs/DesktopVersionDialogV2";
import { isPhone } from "services/phone";
import routes from "components/play/routes";
import { Brick } from "model/brick";
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

interface MainNotificationPanelProps {
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

interface MainNotificationsState {
  needDesktopOpen: boolean;
  scrollArea: React.RefObject<HTMLUListElement>;
  canScroll: boolean;
}

class MainNotificationPanel extends Component<
  MainNotificationPanelProps,
  MainNotificationsState
> {
  constructor(props: MainNotificationPanelProps) {
    super(props);
    this.state = {
      scrollArea: React.createRef(),
      needDesktopOpen: false,
      canScroll: false,
    };
  }

  async moveToProposal(brick: Brick) {
    if (isPhone()) {
      this.setState({ needDesktopOpen: true });
    } else {
      this.props.forgetBrick();
      await this.props.fetchBrick(brick.id);
      this.props.history.push(map.Proposal(brick.id));
    }
  }

  async move(notification: Notification) {
    const { history } = this.props;
    if (history) {
      if (notification.type === NotificationType.BrickSubmittedForReview) {
        if (isPhone()) {
          this.setState({ needDesktopOpen: true });
        } else {
          history.push(map.BackToWorkPage);
        }
      }

      if (notification.brick && notification.brick.id) {
        const { type, brick } = notification;
        if (notification.type === NotificationType.BrickPublished) {
          history.push(routes.playCover(brick.id));
        } else if (type === NotificationType.NewCommentOnBrick) {
          if (isPhone()) {
            this.setState({ needDesktopOpen: true });
          } else {
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
          if (isPhone()) {
            this.setState({ needDesktopOpen: true });
          } else {
            history.push(map.InvestigationBuild(brick.id));
          }
        } else if (type === NotificationType.AssignedToEdit) {
          this.moveToProposal(brick);
        } else if (type === NotificationType.ReturnedToAuthor) {
          this.moveToProposal(brick);
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
    /* mocking 
    const {notifications} = this.props;
    if (notifications) {
      //notifications.length = 0;
      notifications.splice(0,notifications.length)
      console.log(notifications);
      this.setState({needDesktopOpen: false});
    }
    */
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
    let haveNotification = false;
    if (this.props.notifications && this.props.notifications.length !== 0) {
      haveNotification = true;
    }

    let className = "main-notification-box";
    if (this.props.shown) {
      className += " active";
    } else {
      className += " hidden";
    }
    if (haveNotification) {
      className += " notifications";
    } else {
      className += " no-notifications";
    }

    return (
      <div className={className}>
        <div className="notification-content">
          <ul className="notification-list" ref={this.state.scrollArea}>
            {this.props.notifications &&
            this.props.notifications.length !== 0 ? (
              this.props.notifications.map((notification, i) => (
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
          {this.props.notifications && this.props.notifications.length !== 0 && (
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
                <IconButton aria-label="clear-all">
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
      </div>
    );
  }
}

export default connector(MainNotificationPanel);
