import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { IconButton, SvgIcon } from '@material-ui/core';
import { ReduxCombinedState } from 'redux/reducers';
import sprite from "assets/img/icons-sprite.svg";
import { Notification, notificationTypeColors, NotificationType } from 'model/notifications';
import moment from 'moment';

import map from 'components/map';
import actions from 'redux/actions/brickActions';
import { isMobile } from 'react-device-detect';
import { checkTeacherEditorOrAdmin } from 'components/services/brickService';
import { User } from 'model/user';
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

class MainNotificationPanel extends Component<MainNotificationPanelProps, MainNotificationsState> {
  constructor(props: MainNotificationPanelProps) {
    super(props);
    this.state = {
      scrollArea: React.createRef(),
      needDesktopOpen: false,
      canScroll: false
    }
  }

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
          } else {
            history.push(map.investigationSynthesisSuggestions(brick.id))
          }
        } else if (notification.type === NotificationType.InvitedToPlayBrick) {
          history.push(map.playIntro(brick.id));
        } else if (notification.type === NotificationType.BrickAttemptSaved) {
          if (isMobile) {
            this.setState({needDesktopOpen: true});
          } else {
            history.push(map.postPlay(brick.id, this.props.user.id));
          }
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

  checkScroll() {
    const {canScroll} = this.state;
    const {current} = this.state.scrollArea;
    if (current) {
      if (current.scrollHeight > current.clientHeight) {
        if (!canScroll) {
          this.setState({canScroll: true});
        }
      } else {
        if (canScroll) {
          this.setState({canScroll: false});
        }
      }
    }
  }

  componentDidMount() {
    setTimeout(() => { this.checkScroll(); }, 200);
  }

  componentDidUpdate() {
    setTimeout(() => { this.checkScroll(); }, 200);
  }

  scrollUp() {
    const {current} = this.state.scrollArea;
    if (current) {
      current.scrollBy(0, -window.screen.height / 30);
    }
  }

  scrollDown() {
    const {current} = this.state.scrollArea;
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
    let haveNotification = false;
    if (this.props.notifications && this.props.notifications.length !== 0) {
      haveNotification = true;
    }

    let className = "main-notification-box";
    if (this.props.shown) {
      className += ' active';
    } else {
      className += ' hidden';
    }
    if (haveNotification) {
      className += ' notifications';
    } else {
      className += ' no-notifications';
    }

    return (
      <div className={className}>
        <div className="notification-content">
            <ul className="notification-list" ref={this.state.scrollArea}>
              {(this.props.notifications && this.props.notifications.length !== 0) ? this.props.notifications.map((notification) => (
                <li key={notification.id} onClick={() => this.move(notification)}>
                  <div className={"left-brick-circle svgOnHover " + notificationTypeColors[notification.type]}>
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
                  </div>
                  <div className="content-box">
                    <div className="notification-detail">
                      <p className="notif-title">{notification.title}</p>
                      <p className="notif-desc">{notification.text}</p>
                    </div>
                    <div className="actions">
                      <div className="notification-time">{moment(notification.timestamp).fromNow()}</div>
                      <button aria-label="clear" className="btn btn-transparent delete-notification svgOnHover" onClick={(e) => {
                        this.markAsRead(notification.id);
                        e.stopPropagation();
                      }}>
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
          {(this.props.notifications && this.props.notifications.length !== 0) &&
            <div className="clear-notification">
              <div className="scroll-buttons">
                <SpriteIcon name="arrow-up" onClick={this.scrollUp.bind(this)} />
                <SpriteIcon name="arrow-down" onClick={this.scrollDown.bind(this)} />
              </div>
              <div className="bold">Clear All</div>
              <IconButton aria-label="clear-all" onClick={() => this.markAllAsRead()}>
                <SvgIcon>
                  <SpriteIcon name="circle-cancel" className="text-white" />
                </SvgIcon>
              </IconButton>
            </div>
          }
        </div>
        <DesktopVersionDialogV2
          isOpen={this.state.needDesktopOpen}
          secondaryLabel="Brick summaries have not yet been optimised for mobile devices."
          onClick={() => this.setState({needDesktopOpen: false})}
        />
      </div>
    );
  }
}

export default connector(MainNotificationPanel);
