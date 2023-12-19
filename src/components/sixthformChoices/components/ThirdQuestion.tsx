import React, { Component, Key } from "react";
import { MenuItem, TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyStage4Subject, PredicetedStrength, SixthformSubject, getKeyStage4Subjects } from "services/axios/sixthformChoices";
import CheckBoxV2 from "./CheckBox";


enum SubjectGroupR21 {
  GCSE = 1,
  PracticalVocational,
}

enum SubStep {
  First,
  Second
}

interface ThirdProps {
  answer: any;
  moveNext(answer: any): void;
  moveBack(): void;
}

interface ThirdQuestionState {
  subStep: SubStep;
  typedSubject: string;
  subjectGroup: SubjectGroupR21;
  GCSESubjects: KeyStage4Subject[];
  limit: number;
  allSubjects: KeyStage4Subject[];
  vocationalSubjects: KeyStage4Subject[];
  subjectSelections: KeyStage4Subject[];
  selectedGSCESubjects: KeyStage4Subject[];
  otherGCSESubjects: KeyStage4Subject[];
}

class ThirdQuestion extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    this.state = {
      subStep: SubStep.First,
      typedSubject: '',
      subjectGroup: SubjectGroupR21.GCSE,
      GCSESubjects: [],
      limit: 16,
      vocationalSubjects: [],
      subjectSelections: [],
      allSubjects: [],
      otherGCSESubjects: [],
      selectedGSCESubjects: [],
    }

    this.loadSubjects();
  }

  async loadSubjects() {
    const subjects = await getKeyStage4Subjects();
    if (subjects) {
      let subjectSelections: KeyStage4Subject[] = [];

      if (this.props.answer && this.props.answer.answer && this.props.answer.answer.subjectSelections) {
        subjectSelections = this.props.answer.answer.subjectSelections;
      }

      const realSubjectSelections: KeyStage4Subject[] = [];
      subjectSelections.forEach((s: any) => {
        const found = subjects.find((ss: any) => ss.name === s.name);
        if (found) {
          found.selected = true;
          if (s.predicedStrength) {
            found.predicedStrength = s.predicedStrength;
          }
          realSubjectSelections.push(found);
        }
      });

      this.setState({
        allSubjects: subjects,
        subjectSelections: realSubjectSelections,
        GCSESubjects: subjects.filter(s => s.isGCSE && s.isPopular),
        vocationalSubjects: subjects.filter(s => s.isVocational && s.isPopular),
        otherGCSESubjects: subjects.filter(s => s.isGCSE && !s.isPopular)
      });
    }
  }

  renderProgressBar() {
    return (
      <div>
        <div className="progress-bar">
          <div className='start active' />
          <div className='active' />
          <div className='active' />
          <div />
          <div />
          <div className="end" />
        </div>
        <div className="font-16">
          STEP 3: SUBJECTS
        </div>
      </div>
    );
  }

  activateSubjectGroup(group: SubjectGroupR21) {
    this.setState({ subjectGroup: group });
  }

  renderSubjectLozenges(subjects: KeyStage4Subject[], canDelete: boolean, onClick: Function, onDelete?: Function) {
    return (
      <div className="subjects-lozenges bold font-12">
        {subjects.map((subject, index) => {
          return (
            <div className={`subject-lozenge ${subject.selected ? 'active' : ''}`} key={index} onClick={() => onClick(subject)}>
              <div className="subject-name">{subject.name}</div>
              {canDelete && (<SpriteIcon name="cancel" className="subject-delete" onClick={() => onDelete?.(subject)} />)}
            </div>
          )
        })}
      </div>
    );
  }

  renderValue(subject: KeyStage4Subject) {
    if (subject.predicedStrength === PredicetedStrength.veryWell) {
      return (
        <div className="result-container font-14">
          <div>
            9
          </div>
        </div>
      );
    } else if (subject.predicedStrength === PredicetedStrength.well) {
      return (
        <div className="result-container font-14">
          <div>
            7
          </div>
        </div>
      );
    } else if (subject.predicedStrength === PredicetedStrength.ok) {
      return (
        <div className="result-container font-14">
          <div>
            5
          </div>
        </div>
      );
    } else if (subject.predicedStrength === PredicetedStrength.notWell) {
      return (
        <div className="result-container font-14">
          <div>
            3
          </div>
        </div>
      );
    }

    return (
      <div className="result-container default font-14">
        <div>
          Value
        </div>
      </div>
    );
  }

  renderNextBtn() {
    let disabled = false;
    for (let subject of this.state.subjectSelections) {
      if (!subject.predicedStrength) {
        disabled = true;
        break;
      }
    }
    return (
      <button className={`absolute-contunue-btn font-24 ${disabled ? 'disabled' : ''}`} onClick={() => {
        if (!disabled) {
          this.props.moveNext({
            subjectSelections: this.state.subjectSelections
          });
        }
      }}>Continue</button>
    )
  }

  render() {
    if (this.state.subStep === SubStep.Second) {
      return (
        <div className="question">
          {this.renderProgressBar()}
          <div className="bold font-32 question-text-3">
            What are your relative strengths?
          </div>
          <div className="font-16">
            Here are the subjects you selected. Now decide whether you think you are likely to do very well, well, okay (average) or poorly in each subject. If you prefer, with GCSEs, you can put your predicted grade (or, if you are doing this after your results, your actual grade).
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
              {this.state.subjectSelections.map((subject, index) => {
                return (
                  <div>
                    <div className="bold first-column subject-box-r21 font-12">
                      <div className="subject-lozengue">{subject.name}</div>
                    </div>
                    <div className="second-column center-column">
                      <div className="radio-container">
                        <CheckBoxV2 currentChoice={PredicetedStrength.veryWell} choice={subject.predicedStrength} setChoice={(choice: number) => {
                          subject.predicedStrength = choice;
                          this.setState({ subjectSelections: this.state.subjectSelections });
                        }} />
                      </div>
                    </div>
                    <div className="third-column center-column">
                      <div className="radio-container">
                        <CheckBoxV2 currentChoice={PredicetedStrength.well} choice={subject.predicedStrength} setChoice={(choice: number) => {
                          subject.predicedStrength = choice;
                          this.setState({ subjectSelections: this.state.subjectSelections });
                        }} />
                      </div>
                    </div>
                    <div className="fourth-column center-column">
                      <div className="radio-container">
                        <CheckBoxV2 currentChoice={PredicetedStrength.ok} choice={subject.predicedStrength} setChoice={(choice: number) => {
                          subject.predicedStrength = choice;
                          this.setState({ subjectSelections: this.state.subjectSelections });
                        }} />
                      </div>
                    </div>
                    <div className="fifth-column center-column">
                      <div className="radio-container">
                        <CheckBoxV2 currentChoice={PredicetedStrength.notWell} choice={subject.predicedStrength} setChoice={(choice: number) => {
                          this.setState({ subjectSelections: this.state.subjectSelections });
                          subject.predicedStrength = choice;
                          this.setState({ subjectSelections: this.state.subjectSelections });
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
          <div className="absolute-back-btn" onClick={() => {
            this.setState({ subStep: SubStep.First });
          }}>
            <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-25">Previous</span>
          </div>
          {this.renderNextBtn()}
        </div>
      );
    }
    return (
      <div className="question">
        {this.renderProgressBar()}
        <div className="bold font-32 question-text-3">
          What qualifications are you studying for at present?
        </div>
        <div className="font-16">
          Select from the lists and sections below: academic subjects (usually GCSEs) and subjects which are more of a practical or vocational nature. If you have already achieved the qualification, select it also. If you are formally studying an instrument, you should look at practical and vocational too.
        </div>
        <div className="main-subjects-container">
          <div className="first-box-R21">
            <div>
              <div className="toggle-R21 font-12 bold">
                <div
                  className={this.state.subjectGroup === SubjectGroupR21.GCSE ? "active" : ""}
                  onClick={() => this.activateSubjectGroup(SubjectGroupR21.GCSE)}
                >
                  GCSE’s
                </div>
                <div
                  className={this.state.subjectGroup === SubjectGroupR21.PracticalVocational ? "active" : ""}
                  onClick={() => this.activateSubjectGroup(SubjectGroupR21.PracticalVocational)}
                >
                  Practical & Vocational Qualifications
                </div>
              </div>
              <div className="subjects-box-r21">
                {this.renderSubjectLozenges(
                  this.state.subjectGroup === SubjectGroupR21.GCSE ? this.state.GCSESubjects : this.state.vocationalSubjects,
                  false,
                  (subject: KeyStage4Subject) => {
                    if (this.state.subjectSelections.length >= this.state.limit) {
                      return;
                    }
                    const selections = this.state.subjectSelections;
                    const found = selections.find((s: any) => s.name === subject.name);
                    if (!found) {
                      subject.selected = true;
                      selections.push(subject);
                      this.setState({ subjectSelections: selections });
                    }
                  })}
              </div>
              {this.state.subjectGroup === SubjectGroupR21.GCSE &&
                <div className="subjects-typer-r21 font-14">
                  <Autocomplete
                    multiple={true}
                    value={this.state.selectedGSCESubjects}
                    options={this.state.otherGCSESubjects}
                    onChange={(e: any, vv: any) => {
                      let v = vv[0];
                      if (v) {
                        const subjects = this.state.GCSESubjects;
                        const found = subjects.find(s => s.name === v.name);
                        const selected = this.state.subjectSelections;
                        if (!found) {
                          v.selected = true;
                          subjects.push(v);
                          selected.push(v);
                          this.setState({ GCSESubjects: subjects, subjectSelections: selected, selectedGSCESubjects: [], typedSubject: '' });
                          return;
                        }
                      }
                      this.setState({ selectedGSCESubjects: [], typedSubject: '' });
                    }}
                    noOptionsText="Sorry, try typing something else"
                    className="subject-autocomplete font-14"
                    getOptionLabel={(option: any) => option.name}
                    renderOption={(loopSchool: any) => (
                      <React.Fragment>
                        <MenuItem>
                          {loopSchool.name}
                        </MenuItem>
                      </React.Fragment>
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label=""
                        className="font-14"
                        value={this.state.typedSubject}
                        onChange={() => this.setState({ typedSubject: params.inputProps.value })}
                        placeholder={
                          this.state.subjectGroup === SubjectGroupR21.GCSE
                            ? "If you are doing any other, rarer GCSEs, please add them here"
                            : "If you are doing any other, rarer practical and vocational subjects, please add them here"
                        }
                      />
                    )}
                  />
                </div>}
            </div>
          </div>
          <div className="second-box-R21">
            <div className="bold font-16 second-box-title">Your Subject Selections</div>
            {this.renderSubjectLozenges(this.state.subjectSelections, true, () => { }, (subject: KeyStage4Subject) => {
              const selections = this.state.subjectSelections;
              const found = selections.find((s: any) => s.name === subject.name);
              if (found) {
                subject.selected = false;
                let selected = selections.filter(s => s.name !== subject.name);
                this.setState({ subjectSelections: selected });
              }
            })}
          </div>
        </div>
        <div className="absolute-back-btn" onClick={() => {
          this.props.moveBack();
        }}>
          <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-25">Previous</span>
        </div>
        <button className="absolute-contunue-btn font-24" onClick={() => {
          this.setState({ subStep: SubStep.Second });
        }}>Continue</button>
      </div>
    );
  }
}

export default ThirdQuestion;
