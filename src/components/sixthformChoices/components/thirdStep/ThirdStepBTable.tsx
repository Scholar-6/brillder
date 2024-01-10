import React, { Component } from "react";
import { MenuItem, Select } from '@material-ui/core';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyStage4Subject } from "services/axios/sixthformChoices";
import CheckBoxV2 from "../CheckBoxM1";

interface ThirdProps {
  subjectSelections: KeyStage4Subject[];
  setSubjectSelections(subjects: KeyStage4Subject[]): void;
}


class ThirdStepBTable extends Component<ThirdProps> {
  renderValue(subject: KeyStage4Subject) {
    return <Select
      className="selected-date"
      value={subject.predicedStrength}
      MenuProps={{ classes: { paper: 'select-time-list' } }}
      onChange={e => {
        subject.predicedStrength = e.target.value as any;
        this.props.setSubjectSelections(this.props.subjectSelections);
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((c, i) => <MenuItem value={c as any} key={i}>{c === 0 ? 'Value' : c}</MenuItem>)}
    </Select>
  }

  render() {
    return (
      <div>
        <div className="flex-center">
          <div className="bold font-32 question-text-3 question-title-sub-second">
            What are your strengths?
          </div>
          <div className="font-16 question-text-sub-second">
            Here are the subjects you selected. Now decide whether you think you are likely to do very well, well, okay (average) or poorly in each subject. If you prefer, with GCSEs, you can put your predicted grade (or, if you are doing this after your results, your actual grade).
          </div>
        </div>
        <div className="subjects-table">
          <div className="table-head bold font-16">
            <div className="first-column center-y">Subject</div>
            <div className="second-column center-column">
              <div>Very Well</div>
              <div className="hover-area font-14">
                <SpriteIcon name="help-icon-v4" className="info-icon" />
                <div className="hover-content">(e.g. an 8 or 9 at GCSE, or a<br /> distinction)</div>
                <div className="hover-arrow-bottom" />
              </div>
            </div>
            <div className="third-column center-column">
              <div>Well</div>
              <div className="hover-area font-14">
                <SpriteIcon name="help-icon-v4" className="info-icon" />
                <div className="hover-content">(e.g. a 6 or 7 at GCSE or a merit)</div>
                <div className="hover-arrow-bottom" />
              </div>
            </div>
            <div className="fourth-column center-column">
              <div>OK</div>
              <div className="hover-area font-14">
                <SpriteIcon name="help-icon-v4" className="info-icon" />
                <div className="hover-content">(e.g. 4 or 5 at GCSE or a pass)</div>
                <div className="hover-arrow-bottom" />
              </div>
            </div>
            <div className="fifth-column center-column">
              <div>Not so Well</div>
              <div className="hover-area font-14">
                <SpriteIcon name="help-icon-v4" className="info-icon" />
                <div className="hover-content">(you might struggle to get a 4 or a pass)</div>
                <div className="hover-arrow-bottom" />
              </div>
            </div>
            <div className="six-column center-column">
              <div>Prediction or Grade (If Known)</div>
            </div>
          </div>
          <div className="table-body">
            {this.props.subjectSelections.map((subject, index) => {
              return (
                <div key={index}>
                  <div className="bold first-column subject-box-r21 font-12">
                    <div className="subject-lozengue">{subject.name}</div>
                  </div>
                  <div className="second-column center-column">
                    <div className="radio-container">
                      <CheckBoxV2 minChoice={8} maxChoice={9} currentChoice={subject.predicedStrength} setChoice={() => {
                        subject.predicedStrength = 8;
                        this.props.setSubjectSelections(this.props.subjectSelections);
                      }} />
                    </div>
                  </div>
                  <div className="third-column center-column">
                    <div className="radio-container">
                      <CheckBoxV2 minChoice={6} maxChoice={7} currentChoice={subject.predicedStrength} setChoice={() => {
                        subject.predicedStrength = 6;
                        this.props.setSubjectSelections(this.props.subjectSelections);
                      }} />
                    </div>
                  </div>
                  <div className="fourth-column center-column">
                    <div className="radio-container">
                      <CheckBoxV2 minChoice={4} maxChoice={5} currentChoice={subject.predicedStrength} setChoice={(choice: number) => {
                        subject.predicedStrength = 4;
                        this.props.setSubjectSelections(this.props.subjectSelections);
                      }} />
                    </div>
                  </div>
                  <div className="fifth-column center-column">
                    <div className="radio-container">
                      <CheckBoxV2 minChoice={1} maxChoice={3} currentChoice={subject.predicedStrength} setChoice={() => {
                        subject.predicedStrength = 2;
                        this.props.setSubjectSelections(this.props.subjectSelections);
                      }} />
                    </div>
                  </div>
                  <div className="six-column">
                    {this.renderValue(subject)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default ThirdStepBTable;
