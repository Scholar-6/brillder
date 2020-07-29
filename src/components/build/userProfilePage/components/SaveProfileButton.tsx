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
  isValid: boolean;
  shouldPulse: boolean;
}

class SaveProfileButton extends Component<SaveProfileProps, SaveProfileState> {
  constructor(props: SaveProfileProps) {
    super(props);

    this.state = {
      isValid: this.isValid(props.user),
      shouldPulse: this.isValid(props.user)
    }
  }

  isValid(user: UserProfile) {
    if (user.firstName && user.lastName) {
      return true;
    }
    return false;
  }

  shouldComponentUpdate(props: SaveProfileProps) {
    const { user } = props;

    // check pulsing
    if (this.isValid(user)) {
      if (this.state.shouldPulse === false) {
        this.setState({ shouldPulse: true });
        return true;
      }
    } else {
      if (this.state.shouldPulse === true) {
        this.setState({ shouldPulse: false })
      }
    }

    // check validation
    if (this.isValid(user)) {
      if (!this.state.isValid) {
        this.setState({ isValid: true });
        return true;
      }
    } else {
      if (this.state.isValid) {
        this.setState({ isValid: false });
        return true;
      }
    }
    return false;
  }

  renderButton() {
    let className = "save-image";
    if (this.state.isValid) {
      className += " valid";
    }
    return (
      <Avatar
        alt=""
        className={className}
        onClick={() => this.props.onClick()}
      >
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#save-icon"} />
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
          {this.renderButton()}
        </PulsingDiv>
      );
    }
    return this.renderButton()
  }
}

export default SaveProfileButton;
