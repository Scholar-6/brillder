import React, { Component } from "react";
import { MenuItem, Select } from '@material-ui/core';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyStage4Subject } from "services/axios/sixthformChoices";
import CheckBoxV2 from "../CheckBoxM1";
import CheckBoxV3 from "../CheckBoxM2";
import { isPhone } from "services/phone";

interface ThirdProps {
  subjectSelections: KeyStage4Subject[];
  setSubjectSelections(subjects: KeyStage4Subject[]): void;
}

class ThirdStepBTable extends Component<ThirdProps> {
  render() {
    if (isPhone()) {
      return (
        <div className="question-step1gcses24">
          <div className="question-top-step1">
            <div>
              <div className="bold font-23 question-text-3">
                What are your strengths?
              </div>
              <div className="height-2" />
              <div className="font-16">
                How are you doing in the subjects you’re<br /> taking? You can base your answer on your<br /> predicted grades, or on qualifications you’ve<br /> already completed.
              </div>
            </div>
          </div>
          <div className="phone-subjects">
            {this.props.subjectSelections.map((subject, index) => {
              if (subject.isVocational) {
                return (
                  <div key={index} className="subject-container-r33">
                    <div>
                      <div className="bold subject-top-r33 font-24">
                        {subject.name}
                      </div>
                      <div className="second-column-34 font-14">
                        <div
                          className={`center-column ${subject.predicedStrength == 'distinction' ? 'active' : ''}`}
                          onClick={() => {
                            subject.predicedStrength = 'distinction';
                            this.props.setSubjectSelections(this.props.subjectSelections);
                          }}>
                          Distinction
                        </div>
                        <div
                          className={`center-column ${subject.predicedStrength == 'merit' ? 'active' : ''}`}
                          onClick={() => {
                            subject.predicedStrength = 'merit';
                            this.props.setSubjectSelections(this.props.subjectSelections);
                          }}
                        >
                          Merit
                        </div>
                        <div
                          className={`center-column ${subject.predicedStrength == 'pass' ? 'active' : ''}`}
                          onClick={() => {
                            subject.predicedStrength = 'pass';
                            this.props.setSubjectSelections(this.props.subjectSelections);
                          }}
                        >
                          Pass
                        </div>
                        <div
                          className={`center-column ${subject.predicedStrength == 'fail' ? 'active' : ''}`}
                          onClick={() => {
                            subject.predicedStrength = 'fail';
                            this.props.setSubjectSelections(this.props.subjectSelections);
                          }}
                        >
                          Fail
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="subject-container-r33">
                    <div className="bold subject-top-r33 font-24">
                      {subject.name}
                    </div>
                    <div className="second-column-34 font-14">
                      <div className={`second-column center-column ${subject.predicedStrength >= 8 ? 'active' : ''}`} onClick={() => {
                        subject.predicedStrength = 8;
                        this.props.setSubjectSelections(this.props.subjectSelections);
                      }}>
                        Very well
                      </div>
                      <div
                        className={`third-column center-column ${(subject.predicedStrength >= 6 && subject.predicedStrength <= 7) ? 'active' : ''}`}
                        onClick={() => {
                          subject.predicedStrength = 6;
                          this.props.setSubjectSelections(this.props.subjectSelections);
                        }}
                      >
                        Well
                      </div>
                      <div
                        className={`fourth-column center-column ${(subject.predicedStrength >= 4 && subject.predicedStrength <= 5) ? 'active' : ''}`}
                        onClick={() => {
                          subject.predicedStrength = 4;
                          this.props.setSubjectSelections(this.props.subjectSelections);
                        }}
                      >
                        Ok
                      </div>
                      <div
                        className={`fifth-column center-column ${subject.predicedStrength <= 3 ? 'active' : ''}`}
                        onClick={() => {
                          subject.predicedStrength = 2;
                          this.props.setSubjectSelections(this.props.subjectSelections);
                        }}
                      >
                        Not so well
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="bold font-32 question-text-3">
          What are your strengths?
        </div>
        <div className="font-16">
          How are you doing in the subjects you’re taking? You can base your answer on your predicted grades, or on<br />
          qualifications you’ve already completed.
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
          </div>
          <div className="table-body">
            {this.props.subjectSelections.map((subject, index) => {
              if (subject.isVocational) {
                return (
                  <div key={index}>
                    <div className="bold first-column subject-box-r21 font-12">
                      <div className="subject-lozengue">{subject.name}</div>
                    </div>
                    <div className="second-column center-column">
                      <div className="radio-container">
                        <CheckBoxV3 currentChoice={subject.predicedStrength as string} correctChoice="distinction" setChoice={() => {
                          subject.predicedStrength = 'distinction';
                          this.props.setSubjectSelections(this.props.subjectSelections);
                        }} />
                      </div>
                    </div>
                    <div className="third-column center-column">
                      <div className="radio-container">
                        <CheckBoxV3 currentChoice={subject.predicedStrength as string} correctChoice="merit" setChoice={() => {
                          subject.predicedStrength = 'merit';
                          this.props.setSubjectSelections(this.props.subjectSelections);
                        }} />
                      </div>
                    </div>
                    <div className="fourth-column center-column">
                      <div className="radio-container">
                        <CheckBoxV3 currentChoice={subject.predicedStrength as string} correctChoice="pass" setChoice={() => {
                          subject.predicedStrength = 'pass';
                          this.props.setSubjectSelections(this.props.subjectSelections);
                        }} />
                      </div>
                    </div>
                    <div className="fifth-column center-column">
                      <div className="radio-container">
                        <CheckBoxV3 currentChoice={subject.predicedStrength as string} correctChoice="fail" setChoice={() => {
                          subject.predicedStrength = 'fail';
                          this.props.setSubjectSelections(this.props.subjectSelections);
                        }} />
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    <div className="bold first-column subject-box-r21 font-12">
                      <div className="subject-lozengue">{subject.name}</div>
                    </div>
                    <div className="second-column center-column">
                      <div className="radio-container">
                        <CheckBoxV2 minChoice={8} maxChoice={9} currentChoice={subject.predicedStrength as number} setChoice={() => {
                          subject.predicedStrength = 8;
                          this.props.setSubjectSelections(this.props.subjectSelections);
                        }} />
                      </div>
                    </div>
                    <div className="third-column center-column">
                      <div className="radio-container">
                        <CheckBoxV2 minChoice={6} maxChoice={7} currentChoice={subject.predicedStrength as number} setChoice={() => {
                          subject.predicedStrength = 6;
                          this.props.setSubjectSelections(this.props.subjectSelections);
                        }} />
                      </div>
                    </div>
                    <div className="fourth-column center-column">
                      <div className="radio-container">
                        <CheckBoxV2 minChoice={4} maxChoice={5} currentChoice={subject.predicedStrength as number} setChoice={() => {
                          subject.predicedStrength = 4;
                          this.props.setSubjectSelections(this.props.subjectSelections);
                        }} />
                      </div>
                    </div>
                    <div className="fifth-column center-column">
                      <div className="radio-container">
                        <CheckBoxV2 minChoice={1} maxChoice={3} currentChoice={subject.predicedStrength as number} setChoice={() => {
                          subject.predicedStrength = 2;
                          this.props.setSubjectSelections(this.props.subjectSelections);
                        }} />
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default ThirdStepBTable;
