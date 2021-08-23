import React, { Component } from "react";

import './SaveProfileButton.scss';
import {isValid} from '../service';
import { UserProfile } from "model/user";
import SpriteIcon from "components/baseComponents/SpriteIcon";

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
      isValid: isValid(props.user),
      shouldPulse: false
    }
  }

  shouldComponentUpdate(props: SaveProfileProps) {
    const { user } = props;

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
    let className = "save-image";
    if (this.state.isValid) {
      className += " valid";
    }
    if (this.state.shouldPulse) {
      className += " save-pulse";
    }
    return (
      <button type="button" className={className} onClick={this.props.onClick}>
        <SpriteIcon name="feather-cloud-upload" className="active" />
      </button>
    );
  }
}

export default SaveProfileButton;
