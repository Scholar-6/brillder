import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
// @ts-ignore
import { pulse } from "react-animations";
import styled, { keyframes } from "styled-components";
import sprite from "../../../../assets/img/icons-sprite.svg";

import { UserProfile } from "model/user";

interface SaveProfileProps {
  user: UserProfile;
  onClick(): void;
}

interface SaveProfileState {
  shouldPulse: boolean;
}

class SaveProfileButton extends Component<SaveProfileProps, SaveProfileState> {
  constructor(props: SaveProfileProps) {
    super(props);

    this.state = {
      shouldPulse: this.shouldPulse(props.user)
    }
  }

  shouldPulse(user: UserProfile) {
    if (user.firstName && user.lastName) {
      return true;
    }
    return false;
  }

  shouldComponentUpdate(props: SaveProfileProps) {
    const { user } = props;
    if (this.shouldPulse(user)) {
      if (this.state.shouldPulse === false) {
        this.setState({ shouldPulse: true });
        return true;
      }
      return false;
    } else {
      if (this.state.shouldPulse === true) {
        this.setState({ shouldPulse: false })
      }
      return false;
    }
  }

  renderButton(className: string) {
    return (
      <Avatar
        alt=""
        className="save-image"
        onClick={() => this.props.onClick()}
      >
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#save-icon"} className={className} />
        </svg>
      </Avatar>
    );
  }

  render() {
    const pulseAnimation = keyframes`${pulse}`;
    const PulsingDiv = styled.div`animation: 0.5s ${pulseAnimation};`;

    if (this.state.shouldPulse) {
      return (
        <PulsingDiv>
          {this.renderButton("text-theme-green")}
        </PulsingDiv>
      );
    }
    return this.renderButton("text-theme-dark-blue")
  }
}

export default SaveProfileButton;
