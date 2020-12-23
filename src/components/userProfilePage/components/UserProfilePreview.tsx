import React, { Component } from "react";

import "./UserProfilePreview.scss";
import LeonardoSvg from 'assets/img/leonardo.svg';
import TypingLabel from "components/baseComponents/TypingLabel";
import { User } from "model/user";
import { fileUrl } from "components/services/uploadFile";

interface PreiewState {
  imageAnimated: boolean;
  titleTyped: boolean;
  image: React.RefObject<any>;
}

interface Data {
  user: User;
}

interface PreviewProps {
  data: Data;
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
    this.setState({ titleTyped: true });
  }

  componentDidMount() {
    setTimeout(() => {
      const { current } = this.state.image;
      if (current) {
        current.classList.add('small');
      }
      setTimeout(() => {
        this.setState({ imageAnimated: true });
      }, 450);
    }, 500);
  }

  render() {
    const { user } = this.props.data;
    let showProfile = false;
    console.log(user.bio);
    if (user.profileImage && user.bio) {
      showProfile = true;
    }
    return (
      <div className="phone-preview-component user-profile-preview">
        <div ref={this.state.image} className="leonardo-image">
          {
            showProfile
              ? <img alt="profile-image" className="profile-image" src={fileUrl(user.profileImage)} />
              : <img alt="leonardo" src={LeonardoSvg} />
          }
        </div>
        { showProfile
          ? <div className="label">{user.bio}</div>
          :
          <div>
            <div className="title">
              {this.state.imageAnimated &&
                <TypingLabel label="Polymath?" onEnd={this.startLabelAnimation.bind(this)} className="" />}
            </div>
            <div className="label">
              {this.state.titleTyped &&
                <TypingLabel
                  label="Add subjects to your profile via the dropdown on the left"
                  onEnd={this.props.action}
                  className="" />}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default UserProfilePreview;
