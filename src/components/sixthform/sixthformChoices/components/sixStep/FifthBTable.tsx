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

class FifthBTable extends Component<FirstQuestionProps> {
  render() {
    return (
      <div className="subjects-table">
        <div className="table-head bold font-16">
          <div className="first-column center-y bold"></div>
          <div className="second-column center-column">
            <div>Hardly at all</div>
          </div>
          <div className="third-column center-column">
            <div>A fair bit</div>
          </div>
          <div className="fourth-column center-column">
            <div>A lot</div>
          </div>
        </div>
        <div className="table-body">
          {this.props.seventhChoices.map((subject, index) => {
            return (
              <div key={index}>
                <div className="first-column subject-box-r21 font-12">
                  <div className="bold">{subject.name}</div>
                  <div>{subject.description}</div>
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

export default FifthBTable;
