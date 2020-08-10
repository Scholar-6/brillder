import React, { Component } from "react";
import { User } from "model/user";
import { Notification } from 'model/notifications';

interface WelcomeProps {
  user: User;
  notifications: Notification[] | null;
}

interface WelcomeState {
  animatedName: string;
  animatedNotificationText: string;
  animationStarted: boolean;
}

class WelcomeComponent extends Component<WelcomeProps, WelcomeState> {
  constructor(props: any) {
    super(props);

    this.state = {
      animatedName: "",
      animatedNotificationText: '',
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

  runAnimation(props: WelcomeProps) {
    this.setState({ animationStarted: true })

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
            const firstPart = 'You have '.split("");
            const middlePart = `<b>${props.notifications.length}</b>`;
            let lastPart = [];
            if (props.notifications.length >= 1) {
              lastPart = ' new notification'.split("");
            } else {
              lastPart = ' new notifications'.split("");
            }
            notificationText = [...firstPart, middlePart, ...lastPart];
          }

          let count = 0;
          maxCount = notificationText.length - 1;
          let notificationsInterval = setInterval(() => {
            if (count >= maxCount) {
              clearInterval(notificationsInterval);
            }
            this.setState({ animatedNotificationText: this.state.animatedNotificationText + notificationText[count] });
            count++;
          }, 40);
        }, 500);
      }
      count++;
    }, 150);
  }

  render() {
    return (
      <div className="welcome-box">
        <div>WELCOME TO</div>
        <div className="smaller">BRILLDER,</div>
        <div className="welcome-name">{this.state.animatedName}</div>
        <div className="notifications-text" dangerouslySetInnerHTML={{ __html: this.state.animatedNotificationText }} />
      </div>
    );
  }
}

export default WelcomeComponent;
