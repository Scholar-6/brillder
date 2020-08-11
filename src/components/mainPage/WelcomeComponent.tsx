import React, { Component } from "react";
import { User } from "model/user";
import { Notification } from 'model/notifications';
import { checkTeacherEditorOrAdmin } from "components/services/brickService";

enum FieldName {
  animatedNotificationText = "animatedNotificationText",
  animatedNotificationText2 = "animatedNotificationText2",
  animatedNotificationText3 = "animatedNotificationText3"
}

interface WelcomeProps {
  user: User;
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
}

class WelcomeComponent extends Component<WelcomeProps, WelcomeState> {
  constructor(props: any) {
    super(props);

    this.state = {
      animatedName: "",
      animatedNotificationText: '',
      animatedNotificationText2: '',
      animatedNotificationText3: '',
      isTextClickable: false,
      animationStarted: false
    } as any;

    if (this.props.notifications) {
      this.runAnimation(this.props);
    }
  }

  shouldComponentUpdate(props: WelcomeProps) {
    if (props.notifications && props.notifications !== this.props.notifications && !this.state.animationStarted) {
      this.runAnimation(props);
    }
    return true;
  }

  animateText(text: string[], fieldName: FieldName, callback?: Function) {
    let count = 0;
    const maxCount = text.length - 1;

    let notificationsInterval = setInterval(() => {
      if (count >= maxCount) {
        clearInterval(notificationsInterval);
        if (callback) {
          callback();
        }
      }
      this.setState({ ...this.state, [fieldName]: this.state[fieldName] + text[count] });
      count++;
    }, 40);
    return;
  }

  getNotificationsText(notifications: Notification[]) {
    const firstPart = 'You have '.split("");
    const middlePart = `<b>${notifications.length}</b>`;
    let lastPart = [];
    if (notifications.length >= 1) {
      lastPart = ' new notification'.split("");
    } else {
      lastPart = ' new notifications'.split("");
    }
    return [...firstPart, middlePart, ...lastPart];
  }

  runAnimation(props: WelcomeProps) {
    this.setState({ animationStarted: true, isTextClickable: false })

    let count = 0;
    let nameToFill = props.user.firstName
      ? (props.user.firstName as string)
      : "NAME";
    let maxCount = nameToFill.length - 1;

    let setNameInterval = setInterval(() => {
      this.setState({
        ...this.state,
        animatedName: this.state.animatedName + nameToFill[count],
      });
      if (count >= maxCount) {
        clearInterval(setNameInterval);

        setTimeout(() => {
          let notificationText = 'You have no new notifications'.split("");
          if (props.notifications && props.notifications.length >= 1) {
            notificationText = this.getNotificationsText(props.notifications);
            this.animateText(notificationText, FieldName.animatedNotificationText, () => {
              this.setState({isTextClickable: true});
            });
          } else {
            this.animateText(notificationText, FieldName.animatedNotificationText, ()=> {
              const haveAccess = checkTeacherEditorOrAdmin(this.props.user);
              if (haveAccess) {
                const text = '"Nothing strengthens authority so much as silence"'.split("");
                this.animateText(text, FieldName.animatedNotificationText2, () => {
                  const text = '- Leonardo'.split("");
                  this.animateText(text, FieldName.animatedNotificationText3);
                });
              } else {
                const text = "Why then the world's mine oyster...".split("");
                this.animateText(text, FieldName.animatedNotificationText2, () => { 
                  const text = '- Shakespeare'.split("");
                  this.animateText(text, FieldName.animatedNotificationText3);
                });
              }
            });
          }
        }, 500);
      }
      count++;
    }, 150);
  }

  render() {
    let className="notifications-text";
    if (this.state.isTextClickable) {
      className += " clickable"
    }
    return (
      <div className="welcome-box">
        <div>WELCOME TO</div>
        <div className="smaller">BRILLDER,</div>
        <div className="welcome-name">{this.state.animatedName}</div>
        <div
          className={className}
          onClick={this.props.notificationClicked}
          dangerouslySetInnerHTML={{ __html: this.state.animatedNotificationText }}
        />
        <div className="notifications-text-2" dangerouslySetInnerHTML={{ __html: this.state.animatedNotificationText2 }} />
        <div className="notifications-text-3" dangerouslySetInnerHTML={{ __html: this.state.animatedNotificationText3 }} />
      </div>
    );
  }
}

export default WelcomeComponent;
