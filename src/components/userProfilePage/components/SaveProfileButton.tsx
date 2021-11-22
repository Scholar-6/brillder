import React, { Component } from "react";

import './SaveProfileButton.scss';
import {isValid} from '../service';
import { UserProfile } from "model/user";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isMobile } from "react-device-detect";

interface SaveProfileProps {
  user: UserProfile;
  disabled: boolean;
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
      isValid: isValid(props.user),
      shouldPulse: false
    }
  }

  shouldComponentUpdate(props: SaveProfileProps) {
    const { user } = props;

    if (this.props.disabled !== props.disabled) {
      return true;
    }

    // check pulsing
    if (isValid(user)) {
      if (this.state.isValid === false && this.state.shouldPulse === false) {
        this.setState({ shouldPulse: true });
        return true;
      }
    } else {
      if (this.state.shouldPulse === true) {
        this.setState({ shouldPulse: false })
      }
    }

    // check validation
    if (isValid(user)) {
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

  render() {
    console.log(this.props.disabled, this.state.isValid);
    let className = "save-image";
    if (this.state.isValid && !this.props.disabled) {
      className += " valid";
    }
    console.log(this.props.disabled);
    if (this.state.shouldPulse) {
      className += " save-pulse";
    }
    return (
      <button type="button" className={className} onClick={() => {
        if (!this.props.disabled) {
          this.props.onClick();
        }}}>
        <SpriteIcon name="feather-cloud-upload" className="active" />
        {!isMobile && <span className="css-custom-tooltip bold">Save Changes</span>}
      </button>
    );
  }
}

export default SaveProfileButton;
