import React, { Component } from "react";
import CheckBox from "../CheckBox";

interface FirstQuestionProps {
  seventhChoices: any[];
  onChoiceChange(): void;
}

export enum SeventhChoice {
  Never = 1,
  Sometimes,
  ALot
}

class SecondTable extends Component<FirstQuestionProps> {
  render() {
    return (
      <div className="subjects-table">
        <div className="table-head bold font-16">
          <div className="first-column center-y bold"></div>
          <div className="second-column center-column">
            <div>never or hardly ever</div>
          </div>
          <div className="third-column center-column">
            <div>sometimes</div>
          </div>
          <div className="fourth-column center-column">
            <div>a lot</div>
          </div>
        </div>
        <div className="table-body">
          {this.props.seventhChoices.map((subject, index) => {
            return (
              <div key={index}>
                <div className="first-column bold subject-box-r21 font-12">
                  <div className="blue-background-s6">{subject.label}</div>
                </div>
                <div className="second-column center-column">
                  <div className="radio-container">
                    <CheckBox choice={SeventhChoice.Never} currentChoice={subject.choice} setChoice={() => {
                      subject.choice = SeventhChoice.Never;
                      this.props.onChoiceChange();
                    }} />
                  </div>
                </div>
                <div className="third-column center-column">
                  <div className="radio-container">
                  <CheckBox choice={SeventhChoice.Sometimes} currentChoice={subject.choice} setChoice={() => {
                      subject.choice = SeventhChoice.Sometimes;
                      this.props.onChoiceChange();
                    }} />
                  </div>
                </div>
                <div className="fourth-column center-column">
                  <div className="radio-container">
                  <CheckBox choice={SeventhChoice.ALot} currentChoice={subject.choice} setChoice={() => {
                      subject.choice = SeventhChoice.ALot;
                      this.props.onChoiceChange();
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SecondTable;
