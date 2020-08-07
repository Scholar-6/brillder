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
}

class WelcomeComponent extends Component<WelcomeProps, WelcomeState> {
  constructor(props: any) {
    super(props);

    this.state = {
      animatedName: "",
      animatedNotificationText: ''
    } as any;
  }

  shouldComponentUpdate(props: WelcomeProps) {
    if (props.notifications && props.notifications != this.props.notifications) {
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

          let notificationText = 'You have no new notifications';
          if (props.notifications) {
            notificationText = `You have ${props.notifications.length} new notifications`;
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
        }
        count++;
      }, 150);
    }
    return true;
  }


  render() {
    return (
      <div className="welcome-box">
        <div>WELCOME TO</div>
        <div className="smaller">BRILLDER,</div>
        <div className="welcome-name">{this.state.animatedName}</div>
        <div className="notifications-text">{this.state.animatedNotificationText}</div>
      </div>
    );
  }
}

export default WelcomeComponent;
