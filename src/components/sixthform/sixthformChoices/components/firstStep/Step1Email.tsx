import React from "react";
import { connect } from "react-redux";

import BackButtonSix from "../BackButtonSix";
import { ReduxCombinedState } from "redux/reducers";
import { User } from "model/user";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export enum ChoiceEnum {
  Never = 1,
  Sometimes,
  ALot
}

interface ThirdProps {
  user: User;
  email: string;
  emailCorrected: boolean;
  moveBack(email: string, emailCorrected: boolean): void;
  moveNext(email: string, emailCorrected: boolean): void;
}

const Step1Email: React.FC<ThirdProps> = (props) => {
  const [email, setEmail] = React.useState(props.email);
  const [emailCorrected, setCorrected] = React.useState(props.emailCorrected);

  const renderEmailBox = () => {
    if (emailCorrected) {
      return (
        <div className="step1-name-box just-email">
          <div className="font-16">
            Fill in the email address you'd like to use.
          </div>
          <div className="step1-input-row email-part-s1 font-16">
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your Email" />
          </div>
        </div>
      );
    }
    return (
      <div className="step1-name-box">
        <div className="font-16">
          Is this correct? If not, a school or college wanting to enrol you will not<br/>
          be able to communicate with you.
        </div>
        <div className="step1-btn-row">
          <div className="btn " onClick={() => {
            setCorrected(true);
          }}>No</div>
          <div className="btn " onClick={() => {
            props.moveNext(email, emailCorrected);
          }}>Yes</div>
        </div>
      </div>
    );
  }

  return (
    <div className="question question-6 question-3-watching question-1-name">
      <img src="/images/choicesTool/Step1R25.png" className="step3watching-img-v2" />
      <div className="font-32 bold">Email</div>
      <div className="font-16">
        We have your personal email down as <span className="text-orange">{props.user.email}</span> (using info from sign up)
      </div>
      {renderEmailBox()}
      <div className="help-without absolute-name-s1 absolute-name-s2 font-16">
        <div>
          <SpriteIcon name="help-without" />
        </div>
        <div className="text-dark-gray-s1">
          Our guarantee: We store your data with complete <span className="bold">NEVER</span> sell your data. With your permission, we only share it with a school or college which you tell us is connected to your education.
        </div>
      </div>
      <BackButtonSix onClick={() => props.moveBack(email, emailCorrected)} />
      <button
        className="absolute-contunue-btn font-24"
        onClick={() => props.moveNext(email, emailCorrected)}>Continue</button>
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user
});

export default connect(mapState)(Step1Email);
