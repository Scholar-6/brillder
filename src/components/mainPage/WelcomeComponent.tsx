import React, { Component } from "react";
import { User } from "model/user";
import { Notification } from 'model/notifications';
import { checkTeacherEditorOrAdmin } from "components/services/brickService";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import { fileUrl } from "components/services/uploadFile";

enum FieldName {
  animatedNotificationText = "animatedNotificationText",
  animatedNotificationText2 = "animatedNotificationText2",
  animatedNotificationText3 = "animatedNotificationText3"
}

interface WelcomeProps {
  user: User;
  history: any;
  notifications: Notification[] | null;
  notificationClicked(): void;
}

interface WelcomeState {
  animatedName: string;
  animatedNotificationText: string;
  animatedNotificationText2: string;
  animatedNotificationText3: string;
  isTextClickable: boolean;
  animationStarted: boolean;
  interval: number | null;
  nameHovered: boolean;
}

class WelcomeComponent extends Component<WelcomeProps, WelcomeState> {
  constructor(props: any) {
    super(props);

    let interval = null;
    if (this.props.notifications) {
      interval = this.runAnimation(this.props);
    }

    this.state = {
      interval,
      animatedName: "",
      animatedNotificationText: '',
      animatedNotificationText2: '',
      animatedNotificationText3: '',
      isTextClickable: false,
      animationStarted: false,
      nameHovered: false
    } as any;
  }

  shouldComponentUpdate(props: WelcomeProps) {
    if (props.notifications && props.notifications !== this.props.notifications && !this.state.animationStarted) {
      this.runAnimation(props, true);
    }
    return true;
  }

  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  animateText(text: string[], fieldName: FieldName, callback?: Function) {
    let count = 0;
    const maxCount = text.length - 1;

    const notificationsInterval = setInterval(() => {
      if (count >= maxCount) {
        clearInterval(notificationsInterval);
        if (callback) {
          callback();
        }
      }
      this.setState({ ...this.state, [fieldName]: this.state[fieldName] + text[count] });
      count++;
    }, 40);
    this.setState({ interval: notificationsInterval });
    return;
  }

  getNotificationsText(notifications: Notification[]) {
    const firstPart = 'You have '.split("");
    const middlePart = `<b>${notifications.length}</b>`;
    let lastPart = [];
    if (notifications.length === 1) {
      lastPart = ' new notification'.split("");
    } else {
      lastPart = ' new notifications'.split("");
    }
    return [...firstPart, middlePart, ...lastPart];
  }

  runAnimation(props: WelcomeProps, setState?: boolean) {
    let count = 0;
    let nameToFill = props.user.firstName
      ? (props.user.firstName as string)
      : "NAME";
    let maxCount = nameToFill.length - 1;

    const setNameInterval = setInterval(() => {
      this.setState({
        ...this.state,
        animatedName: this.state.animatedName + nameToFill[count],
      });
      if (count >= maxCount) {
        clearInterval(setNameInterval);
        setTimeout(() => this.runNotificationAnimation(props), 500);
      }
      count++;
    }, 150);

    if (setState) {
      this.setState({
        interval: setNameInterval,
        animationStarted: true,
        animatedName: '',
        animatedNotificationText: '',
        animatedNotificationText2: '',
        animatedNotificationText3: '',
        isTextClickable: false
      });
    }
    return setNameInterval;
  }

  runNotificationAnimation(props: WelcomeProps) {
    let notificationText = 'You have no new notifications'.split("");
    if (props.notifications && props.notifications.length >= 1) {
      notificationText = this.getNotificationsText(props.notifications);
      this.animateText(notificationText, FieldName.animatedNotificationText, () => {
        this.setState({ isTextClickable: true, animationStarted: false });
      });
    } else {
      this.animateText(notificationText, FieldName.animatedNotificationText, () => {
        const haveAccess = checkTeacherEditorOrAdmin(this.props.user);
        if (haveAccess) {
          const text = '“Nothing strengthens authority so much as silence”'.split("");
          this.animateText(text, FieldName.animatedNotificationText2, () => {
            const text = '- Leonardo da Vinci'.split("");
            this.animateText(text, FieldName.animatedNotificationText3, () => {
              this.setState({ animationStarted: false });
            });
          });
        } else {
          const text = "“Why then the world's mine oyster...”".split("");
          this.animateText(text, FieldName.animatedNotificationText2, () => {
            const text = '- Shakespeare'.split("");
            this.animateText(text, FieldName.animatedNotificationText3, () => {
              this.setState({ animationStarted: false });
            });
          });
        }
      });
    }
  }

  getStyle() {
    if (this.props.user.firstName && this.props.user.firstName.length > 10) {
      return { fontSize: '1.8vw', letterSpacing: '0.15vw' }
    }
    return {};
  }

  render() {
    let className = "notifications-text";
    if (this.state.isTextClickable) {
      className += " clickable"
    }
    return (
      <div className="welcome-box">
        <div>WELCOME TO</div>
        <div className="smaller">BRILLDER,</div>
        <div
          className="welcome-name"
          onMouseEnter={() => this.setState({nameHovered: true})}
          onMouseLeave={() => this.setState({nameHovered: false})}
          onClick={()=> this.props.history.push(map.UserProfile)}
        >
          <div className="centered">
            {this.props.user.profileImage
              ? 
                <div className="profile-image-border">
                  <img alt="user-profile" src={fileUrl(this.props.user.profileImage)} />
                </div>
              : <SpriteIcon name="user-custom" />
            }
            {this.state.nameHovered && <div className="custom-tooltip">View Profile</div>}
          </div>
          <span style={this.getStyle()}>{this.state.animatedName}</span>
        </div>
        <div
          className={className}
          onClick={this.props.notificationClicked}
          dangerouslySetInnerHTML={{ __html: this.state.animatedNotificationText }}
        />
        <div className="notifications-text-2" dangerouslySetInnerHTML={{ __html: this.state.animatedNotificationText2 }} />
        <div className="notifications-text-3" dangerouslySetInnerHTML={{ __html: this.state.animatedNotificationText3 }} />

        {this.state.animatedNotificationText3 &&
        <div className="link-to-landing" onClick={() => this.props.history.push(map.ViewAllPage + '?mySubject=true&searchString=Christmas12')}>
          <SpriteIcon name="star" />
          Play the 12 bricks of Christmas
        </div>}
      </div>
    );
  }
}

export default WelcomeComponent;
