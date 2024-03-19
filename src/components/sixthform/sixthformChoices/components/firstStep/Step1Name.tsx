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
  firstName: string;
  lastName: string;
  nameCorrected: boolean;
  moveBack(firstName: string, lastName: string, newName: boolean): void;
  moveNext(firstName: string, lastName: string, newName: boolean): void;
}

const Step1Name: React.FC<ThirdProps> = (props) => {
  const [firstName, setFirstName] = React.useState(props.firstName);
  const [lastName, setLastName] = React.useState(props.lastName);
  const [newName, setNewName] = React.useState(props.nameCorrected);

  const renderFullNameBox = () => {
    if (newName) {
      return (
        <div className="step1-name-box">
          <div className="font-16">
            Alright, kindly tell us your full name
          </div>
          <div className="step1-input-row font-16">
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
          </div>
        </div>
      );
    }
    return (
      <div className="step1-name-box">
        <div className="font-16">
          Is this correct? If not, a school or college wanting to enrol you will not be able to.
        </div>
        <div className="step1-btn-row">
          <div className="btn " onClick={() => {
            setNewName(true);
          }}>No</div>
          <div className="btn " onClick={() => {
            props.moveNext(firstName, lastName, newName);
          }}>Yes</div>
        </div>
      </div>
    );
  }

  return (
    <div className="question question-6 question-3-watching question-1-name">
      <img src="/images/choicesTool/Step1R25.png" className="step3watching-img-v2" />
      <div className="font-32 bold">Your Names</div>
      <div className="font-16">We have you down as <span className="text-orange capitalize">{props.user.firstName} {props.user.lastName}</span> (using info from sign up)</div>
      {renderFullNameBox()}
      <div className="help-without absolute-name-s1 font-16">
        <div>
          <SpriteIcon name="help-without" />
        </div>
        <div className="text-dark-gray-s1">
          Remember: We <span className="bold">NEVER</span> sell your data. With your permission, we only share it with a school or college which you tell us is connected to your education.
        </div>
      </div>
      <BackButtonSix onClick={() => {
        props.moveBack(firstName, lastName, newName);
      }} />
      <button
        className="absolute-contunue-btn font-24"
        onClick={() => {
          props.moveNext(firstName, lastName, newName);
        }}>Continue</button>
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user
});

export default connect(mapState)(Step1Name);
