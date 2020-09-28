import React, { Component } from "react";

import "./UserProfilePreview.scss";
import LeonardoSvg from 'assets/img/leonardo.svg';
import TypingLabel from "components/baseComponents/TypingLabel";



class UserProfilePreview extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      titleTyped: false,
    }
  }

  startLabelAnimation() {
    this.setState({titleTyped: true});
  }

  render() {
    return (
      <div className="phone-preview-component user-profile-preview">
        <div className="leonardo-image">
          <img alt="leonardo" src={LeonardoSvg} />
        </div>
        <div className="title">
          <TypingLabel label="Polymath?" onEnd={this.startLabelAnimation.bind(this)} className="" />
        </div>
        <div className="label">
          {this.state.titleTyped ? <TypingLabel label="Add subjects to your profile via the dropdown on the left" onEnd={()=>{}} className="" /> : ""}
        </div>
      </div>
    );
  }
}

export default UserProfilePreview;
