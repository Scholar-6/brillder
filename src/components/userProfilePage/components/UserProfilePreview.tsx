import React, { Component } from "react";

import "./UserProfilePreview.scss";
import LeonardoSvg from 'assets/img/leonardo.svg';
import TypingLabel from "components/baseComponents/TypingLabel";

interface PreiewState {
  imageAnimated: boolean;
  titleTyped: boolean;
  image: React.RefObject<any>;
}

interface PreviewProps {
  action(): void;
}

class UserProfilePreview extends Component<PreviewProps, PreiewState> {
  constructor(props: any) {
    super(props);

    this.state = {
      imageAnimated: false,
      titleTyped: false,
      image: React.createRef()
    }
  }

  startLabelAnimation() {
    this.setState({titleTyped: true});
  }

  componentDidMount() {
    setTimeout(() => {
      this.state.image.current.classList.add('small');
      setTimeout(() => {
        this.setState({imageAnimated: true});
      }, 450);
    }, 500);
  }

  render() {
    return (
      <div className="phone-preview-component user-profile-preview">
        <div ref={this.state.image} className="leonardo-image">
          <img alt="leonardo" src={LeonardoSvg} />
        </div>
        <div className="title">
          {this.state.imageAnimated ?
            <TypingLabel label="Polymath?" onEnd={this.startLabelAnimation.bind(this)} className="" /> : ""}
        </div>
        <div className="label">
          {this.state.titleTyped ?
            <TypingLabel
              label="Add subjects to your profile via the dropdown on the left"
              onEnd={this.props.action}
              className="" /> : ""}
        </div>
      </div>
    );
  }
}

export default UserProfilePreview;
