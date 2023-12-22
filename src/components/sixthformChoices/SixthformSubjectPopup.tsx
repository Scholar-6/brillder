import React, { Component } from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { SixthformSubject, UserSubjectChoice } from "services/axios/sixthformChoices";


interface SixthformSubjectProps {
  subject: SixthformSubject;
}


class SixthformSubjectPopup extends Component<SixthformSubjectProps> {
  renderCircle(subject: SixthformSubject) {
    let colorClass = 'subject-circle yellow-circle';
    if (subject.userChoice === UserSubjectChoice.Definetly) {
      colorClass = 'subject-circle green-circle';
    } else if (subject.userChoice === UserSubjectChoice.NotForMe) {
      colorClass = 'subject-circle red-circle';
    }
    return <SpriteIcon name="circle-filled" className={colorClass} />
  }
  
  render() {
    const { subject } = this.props;

    return (
      <div className="subject-sixth-popup" >

        <div className="subject-name font-24 bold">
          {this.renderCircle(subject)}
          {subject.name} {subject.score}
        </div>
        <div className="font-14">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
        <div className="second-row">
          <div className="box-v32 m-r">
            <div>
              <SpriteIcon name="user-custom-v3" />
            </div>
            <div className="font-12">Candidates</div>
            <div className="bold font-15">220,000</div>
          </div>
          <div className="box-v32">
            <div>
              <SpriteIcon name="facility-icon-hat" />
            </div>
            <div className="font-12">Facilitating Subject</div>
            <div className="bold font-15">STEM</div>
          </div>
          <div className="box-v32 m-l">
            <div>
              <SpriteIcon name="bricks-icon-v3" />
            </div>
            <div className="font-12">Often taken with</div>
            <div className="bold font-11">Accounting, Business</div>
          </div>
        </div>
        <div className="taste-container">
          <div className="label-container">
            <div>
              <div className="bold font-18">Take a Tester Brick!</div>
              <div className="font-14">Try out a Brick for this subject to see if it’s a good fit for you.</div>
            </div>
          </div>
          <div>
            <div className="brick-container">
              <div className="scroll-block" style={{ backgroundImage: `url(https://s3.eu-west-2.amazonaws.com/app.brillder.files.com/files/6c5bb9cb-28f0-4bb4-acc6-0169ef9ce9aa.png)` }}></div>
              <div className="bottom-description-color" />
              <div className="bottom-description font-8 bold">Introduction to Advanced Mathemathics</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SixthformSubjectPopup;
