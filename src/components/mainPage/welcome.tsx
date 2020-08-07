import React, { Component } from "react";
import { User } from "model/user";

interface WelcomeProps {
  user: User;
}

interface WelcomeState {
  animatedName: string;
  animatedNotificationText: string;
}

class WelcomeComponent extends Component<WelcomeProps, WelcomeState> {
  constructor(props: any) {
    super(props);

    let notificationText = 'You have no new notifications';

    this.state = {
      animatedName: "",
      animatedNotificationText: ''
    } as any;

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
