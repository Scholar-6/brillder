import React, { Component } from "react";
import CheckBox from "../CheckBox";

interface FirstQuestionProps {
  seventhChoices: any[];
  onChoiceChange(): void;
}

export enum SeventhChoice {
  NotReally = 1,
  QuiteTrue,
  VeryTrue
}

class SixthStepSixthTable extends Component<FirstQuestionProps> {
  render() {
    return (
      <div className="subjects-table">
        <div className="table-head bold font-16">
          <div className="first-column center-y bold">I love...</div>
          <div className="second-column center-column">
            <div>Not really true</div>
          </div>
          <div className="third-column center-column">
            <div>Quite true</div>
          </div>
          <div className="fourth-column center-column">
            <div>Very true!</div>
          </div>
        </div>
        <div className="table-body">
          {this.props.seventhChoices.map((subject, index) => {
            return (
              <div key={index}>
                <div className="bold first-column subject-box-r21 font-12">
                  {subject.label}
                </div>
                <div className="second-column center-column">
                  <div className="radio-container">
                    <CheckBox choice={SeventhChoice.NotReally} currentChoice={subject.choice} setChoice={() => {
                      subject.choice = SeventhChoice.NotReally;
                      this.props.onChoiceChange();
                    }} />
                  </div>
                </div>
                <div className="third-column center-column">
                  <div className="radio-container">
                  <CheckBox choice={SeventhChoice.QuiteTrue} currentChoice={subject.choice} setChoice={() => {
                      subject.choice = SeventhChoice.QuiteTrue;
                      this.props.onChoiceChange();
                    }} />
                  </div>
                </div>
                <div className="fourth-column center-column">
                  <div className="radio-container">
                  <CheckBox choice={SeventhChoice.VeryTrue} currentChoice={subject.choice} setChoice={() => {
                      subject.choice = SeventhChoice.VeryTrue;
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

export default SixthStepSixthTable;
