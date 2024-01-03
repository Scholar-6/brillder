import React, { Component } from "react";
import { MenuItem, TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyStage4Subject, PredicetedStrength, SixthformSubject, getKeyStage4Subjects } from "services/axios/sixthformChoices";
import CheckBoxV2 from "../CheckBox";
import ThirdStepC1 from "./ThirdStepC1";
import ThirdStepC2 from "./ThirdStepC2";
import ThirdStepC3 from "./ThirdStepC3";
import ThirdStepC4 from "./ThirdStepC4";
import ThirdStepD from "./ThirdStepD";
import ThirdStepE from "./ThirdStepE";
import { FirstChoice } from "../FirstStep";


enum SubjectGroupR21 {
  GCSE = 1,
  PracticalVocational,
}

enum SubStep {
  First,
  Second,
  ThirdC1,
  ThirdC2,
  ThirdC3,
  ThirdC4,
  ThirdD,
  ThirdE
}

interface ThirdProps {
  firstAnswer: any;
  answer: any;
  subjects: SixthformSubject[];
  saveThirdAnswer(answer: any): void;
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

  firstPairResults: any[];
  secondPairResults: any[];
  fifthSubStepRes: any | null;

  ePairResults: any[];
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

      firstPairResults: [],
      secondPairResults: [],

      ePairResults: [],

      fifthSubStepRes: null
    }

    this.loadSubjects();
  }

  getAnswer() {
    return {
      subjectSelections: this.state.subjectSelections,
      firstPairResults: this.state.firstPairResults,
      secondPairResults: this.state.secondPairResults,
      fifthSubStepRes: this.state.fifthSubStepRes,
      ePairResults: this.state.ePairResults
    };
  }

  async loadSubjects() {
    const subjects = await getKeyStage4Subjects();
    if (subjects) {
      let subjectSelections: KeyStage4Subject[] = [];

      let firstPairResults: any[] = [];
      let secondPairResults: any[] = [];
      let fifthSubStepRes: any = null;
      let ePairResults: any[] = [];

      if (this.props.answer && this.props.answer.answer) {
        const { answer } = this.props.answer;
        if (answer.subjectSelections) {
          subjectSelections = answer.subjectSelections;
        }
        if (answer.firstPairResults) {
          firstPairResults = answer.firstPairResults;
        }
        if (answer.secondPairResults) {
          secondPairResults = answer.secondPairResults;
        }
        if (answer.fifthSubStepRes) {
          fifthSubStepRes = answer.fifthSubStepRes;
        }

        if (answer.ePairResults) {
          ePairResults = answer.ePairResults;
        }
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
        otherGCSESubjects: subjects.filter(s => s.isGCSE && !s.isPopular),
        firstPairResults,
        secondPairResults,
        ePairResults
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
    return (
      <button className={`absolute-contunue-btn font-24 ${disabled ? 'disabled' : ''}`} onClick={() => {
        console.log('move next')
        this.props.moveNext({
          subjectSelections: this.state.subjectSelections
        });
      }}>Continue to Step 4</button>
    )
  }

  render() {
    if (this.state.subStep === SubStep.ThirdE) {
      return (
        <div className="question">
          {this.renderProgressBar()}
          <div className="bold font-32 question-text-3">
            New Subjects
          </div>
          <div className="font-16">
            Here are five VAPs which you may need to understand a little better before.
          </div>
          <ThirdStepE
            pairAnswers={this.state.fifthSubStepRes}
            onChange={fifthSubStepRes => this.setState({ fifthSubStepRes })}
          />
          <div className="font-16 bottom-text-r23">You can try a taster lesson/ topic / brick  in any of the above subjects you are interested in.</div>
          <div className="absolute-back-btn" onClick={() => {
            this.setState({ subStep: SubStep.ThirdD });
          }}>
            <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-25">Previous</span>
          </div>
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.props.moveNext({
              subjectSelections: this.state.subjectSelections
            });
          }}>I’ve matched all the definitions - how did I do?</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.ThirdD) {
      return (
        <div className="question">
          {this.renderProgressBar()}
          <div className="bold font-32 question-text-3">
            New Subjects
          </div>
          <div className="font-16">
            A lot of changes are happening within vocational education. For 16-19 year-olds there will be a steady reduction in the availability of BTEC and Diploma courses in Vocational, Applied & Practical subjects (VAPs), and a rapid rolling out of T-levels.
          </div>
          <ThirdStepD
            subjects={this.props.subjects} answer={this.state.fifthSubStepRes}
            onChange={fifthSubStepRes => this.setState({ fifthSubStepRes })}
          />
          <div className="font-16 bottom-text-r23">You can try a taster lesson/ topic / brick  in any of the above subjects you are interested in.</div>
          <div className="absolute-back-btn" onClick={() => {
            // all courses and A-levels can go to C1 else D
            let choice = this.props.firstAnswer.answer.choice;
            if (choice === FirstChoice.ShowMeAll) {
              this.setState({ subStep: SubStep.ThirdC4 });
            } else {
              this.setState({ subStep: SubStep.Second });
            }
          }}>
            <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-25">Previous</span>
          </div>
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: SubStep.ThirdE });
          }}>I’ve matched all the definitions - how did I do?</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.ThirdC4) {
      return (
        <div className="question">
          {this.renderProgressBar()}
          <div className="bold font-32 question-text-3">
            New Subjects
          </div>
          <div className="font-16">
            Now consider whether you are genuinely interested in any of these subjects - all of which can be commenced in the sixth form. (Note that it’s also the case that none of these A Levels are absolutely essential if you wanted to study them at university.)
          </div>
          <ThirdStepC4
            subjects={this.props.subjects} answer={this.state.fifthSubStepRes}
            onChange={fifthSubStepRes => this.setState({ fifthSubStepRes })}
          />
          <div className="font-16 bottom-text-r23">You can try a taster lesson/ topic / brick  in any of the above subjects you are interested in.</div>
          <div className="absolute-back-btn" onClick={() => {
            this.setState({ subStep: SubStep.ThirdC2 });
          }}>
            <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-25">Previous</span>
          </div>
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: SubStep.ThirdC4 });
          }}>I’ve matched all the definitions - how did I do?</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.ThirdC3) {
      return (
        <div className="question">
          {this.renderProgressBar()}
          <div className="bold font-32 question-text-3">
            New Subjects
          </div>
          <div className="font-16">
            Now think about whether you are genuinely interested in taking any of these subjects. Sort them br dragging them into one of the three categories:
          </div>
          <ThirdStepC3
            subjects={this.props.subjects} answer={this.state.fifthSubStepRes}
            onChange={fifthSubStepRes => this.setState({ fifthSubStepRes })}
          />
          <div className="font-16 bottom-text-r23">You can try a taster lesson/ topic / brick  in any of the above subjects you are interested in.</div>
          <div className="absolute-back-btn" onClick={() => {
            this.setState({ subStep: SubStep.ThirdC2 });
          }}>
            <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-25">Previous</span>
          </div>
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: SubStep.ThirdC4 });
          }}>I’ve matched all the definitions - how did I do?</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.ThirdC2) {
      return (
        <div className="question step3question5">
          {this.renderProgressBar()}
          <div className="bold font-32 question-text-3">
            New Subjects
          </div>
          <div className="font-16">
            Here are a few more subjects which are often new to students who begin them in the sixth form: Match the correct courses to the comments of students who chose them.
          </div>
          <ThirdStepC2
            pairAnswers={this.state.secondPairResults}
            onChange={(secondPairResults: any[]) => {
              this.setState({ secondPairResults });
            }}
          />
          <div className="absolute-back-btn" onClick={() => {
            this.setState({ subStep: SubStep.ThirdC1 });
          }}>
            <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-25">Previous</span>
          </div>
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: SubStep.ThirdC3 });
          }}>I’ve matched all the definitions - how did I do?</button>
        </div>
      );
    }
    if (this.state.subStep === SubStep.ThirdC1) {
      return (
        <div className="question">
          {this.renderProgressBar()}
          <div className="bold font-32 question-text-3">
            New Subjects
          </div>
          <div className="font-16">
            Some popular and highly regarded subjects are often not studied before the sixth form. It’s important you understand what they involve and reflect on whether any could be a fit for you.<br />
            Here are six subjects which most students begin for the first time in the sixth form. First of all, can you work out what these subjects consist of? Match the subject description to the correct subject.
          </div>
          <ThirdStepC1
            pairAnswers={this.state.firstPairResults}
            onChange={(firstPairResults: any[]) => {
              this.setState({ firstPairResults });
            }}
          />
          <div className="absolute-back-btn" onClick={() => {
            this.setState({ subStep: SubStep.Second });
          }}>
            <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-25">Previous</span>
          </div>
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: SubStep.ThirdC2 });
          }}>I’ve matched all the definitions - how did I do?</button>
        </div>
      );
    }
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
                  <div key={index}>
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
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            // all courses and A-levels can go to C1 else D
            let choice = this.props.firstAnswer.answer.choice;
            if (choice === FirstChoice.ALevel || choice === FirstChoice.ShowMeAll) {
              this.setState({ subStep: SubStep.ThirdC1 });
            } else {
              this.setState({ subStep: SubStep.ThirdD });
            }
          }}>Continue</button>
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
          this.props.saveThirdAnswer(this.getAnswer());
          this.setState({ subStep: SubStep.Second });
        }}>Continue</button>
      </div>
    );
  }
}

export default ThirdQuestion;
