import React, { Component } from "react";
import { ListItemText, MenuItem, TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyStage4Subject, getKeyStage4Subjects } from "services/axios/sixthformChoices";


enum SubjectGroupR21 {
  GCSE = 1,
  PracticalVocational,
}

interface ThirdProps {
  moveNext(): void;
  moveBack(): void;
}

interface ThirdQuestionProps {
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

class ThirdQuestion extends Component<ThirdProps, ThirdQuestionProps> {
  constructor(props: ThirdProps) {
    super(props);

    this.state = {
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
      this.setState({
        allSubjects: subjects,
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

  render() {
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
        }}>Continue</button>
      </div>
    );
  }
}

export default ThirdQuestion;
