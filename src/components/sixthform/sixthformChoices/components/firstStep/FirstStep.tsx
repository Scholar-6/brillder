import React, { Component } from "react";
import { ListItemText, MenuItem, TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

import { enterPressed } from "components/services/key";
import StepCourseSelect, { FirstChoice } from "./StepCourseSelect";
import { KeyStage4Subject, getKeyStage4Subjects } from "services/axios/sixthformChoices";
import WelcomePage from "./welcomePage/WelcomePage";
import FirstStepWelcome from "./FirstStepWelcome";
import CheckBoxV2 from "../CheckBox";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getSixthformSchools } from "services/axios/sixthformChoices";
import BackButtonSix from "../BackButtonSix";
import ThirdStepBTable from "./ThirdStepBTable";


enum SubStep {
  Welcome = 1,
  Start,
  First,
  Second,
  Third,
  Fourth
}

enum SubjectGroupR21 {
  GCSE = 1,
  PracticalVocational,
}

enum SixthformChoice {
  SixthForm = 1,
  Forbid
}

interface SecondQuestionProps {
  answer: any;
  saveAnswer(answer: any): void;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
}

interface SecondQuestionState {
  subStep: SubStep;
  currentSchool: string;
  schools: any[];
  schoolName: string;
  schoolId: number;
  sixthformChoice: any;

  typedSubject: string;
  subjectGroup: SubjectGroupR21;
  GCSESubjects: KeyStage4Subject[];
  GCSESexpanded: boolean;
  limit: number;
  allSubjects: KeyStage4Subject[];
  vocationalSubjects: KeyStage4Subject[];
  subjectSelections: KeyStage4Subject[];
  selectedGSCESubjects: KeyStage4Subject[];
  otherGCSESubjects: KeyStage4Subject[];
  showMinWarning: boolean;
  showMathWarning: boolean;
  seenMathWarining: boolean;

  subjectType: FirstChoice;
}

class FirstStep extends Component<SecondQuestionProps, SecondQuestionState> {
  constructor(props: SecondQuestionProps) {
    super(props);

    let subStep = SubStep.Welcome;

    let currentSchool = '';
    let sixthformChoice = null;
    let schoolName = '';

    let subjectType = FirstChoice.ShowMeAll;

    if (props.answer) {
      let answer = props.answer.answer;
      currentSchool = answer.currentSchool;
      sixthformChoice = answer.sixthformChoice;
      schoolName = answer.schoolName;
      subStep = answer.subStep;
    }

    this.state = {
      subStep,
      schoolId: 0,
      currentSchool,
      sixthformChoice,
      schoolName,
      schools: [],

      typedSubject: '',
      subjectGroup: SubjectGroupR21.GCSE,
      GCSESubjects: [],
      GCSESexpanded: false,
      limit: 16,
      vocationalSubjects: [],
      subjectSelections: [],
      allSubjects: [],
      otherGCSESubjects: [],
      selectedGSCESubjects: [],
      showMinWarning: false,
      showMathWarning: false,
      seenMathWarining: false,

      subjectType,
    };

    this.loadSchools();
  }

  async loadSchools() {
    const schools = await getSixthformSchools();
    if (schools) {
      this.setState({ schools });
    }
    this.loadSubjects();
  }

  async loadSubjects() {
    const subjects = await getKeyStage4Subjects();
    if (subjects) {
      let subjectSelections: KeyStage4Subject[] = [];

      for (let subject of subjects) {
        subject.predicedStrength = 0;
      }

      if (this.props.answer && this.props.answer.answer) {
        const { answer } = this.props.answer;
        if (answer.subjectSelections) {
          subjectSelections = answer.subjectSelections;
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
        } else { }
      });

      for (let s of realSubjectSelections) {
        if (!s.predicedStrength) {
          s.predicedStrength = 0;
        }
      }


      const sortByName = (a: KeyStage4Subject, b: KeyStage4Subject) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }

      this.setState({
        allSubjects: subjects,
        subjectSelections: realSubjectSelections,
        GCSESubjects: subjects.filter(s => s.isGCSE && s.isPopular).sort(sortByName).sort(sortByName),
        vocationalSubjects: subjects.filter(s => s.isVocational && s.isPopular).sort(sortByName),
        otherGCSESubjects: subjects.filter(s => s.isGCSE && !s.isPopular).sort(sortByName)
      });
    }
  }

  renderDatabaseSchool() {
    return (
      <div className={`check-box-container container ${this.state.sixthformChoice === SixthformChoice.SixthForm ? "bold" : ""}`}>
        <div className="main-box" onClick={() => this.setState({ sixthformChoice: SixthformChoice.SixthForm })}>
          Write the name of your chosen institution in the search box and press enter.
          <SpriteIcon name={this.state.sixthformChoice === SixthformChoice.SixthForm ? 'radio-btn-active' : 'radio-btn-blue'} />
        </div>
        <div className="current-school-autocomplete font-24">
          <Autocomplete
            freeSolo
            options={this.state.schools}
            inputValue={this.state.schoolName}
            onChange={(e: any, v: any) => {
              if (v && v.name) {
                this.setState({ schoolName: v.name, sixthformChoice: SixthformChoice.SixthForm, schoolId: v.id })
              }
            }}
            noOptionsText="Sorry, try typing something else"
            className="subject-autocomplete"
            getOptionLabel={(option: any) => option.name}
            renderOption={(loopSchool: any) => (
              <React.Fragment>
                <MenuItem >
                  <ListItemText>
                    {loopSchool.name}
                  </ListItemText>
                </MenuItem>
              </React.Fragment>
            )}
            renderInput={(params: any) => {
              return (
                <TextField
                  {...params}
                  variant="standard"
                  label=""
                  value={this.state.schoolName}
                  onChange={(e) => {
                    // check if name is in the list
                    let schoolId = 0;
                    for (let s of this.state.schools) {
                      if (s.name === e.target.value) {
                        schoolId = s.id;
                        break;
                      }
                    }
                    this.setState({ schoolName: e.target.value, sixthformChoice: SixthformChoice.SixthForm, schoolId });
                  }}
                  placeholder="Type to start browsing our database"
                />);
            }}
          />
        </div>
      </div>
    );
  }

  getAnswer() {
    return {
      subStep: this.state.subStep,
      currentSchool: this.state.currentSchool,
      sixthformChoice: this.state.sixthformChoice,
      schoolName: this.state.schoolName,
      subjectType: this.state.subjectType
    }
  }

  moveBack() {
    this.props.moveBack(this.getAnswer());
  }

  moveNext() {
    this.props.moveNext(this.getAnswer());
  }

  activateSubjectGroup(group: SubjectGroupR21) {
    this.setState({ subjectGroup: group });
  }

  renderSubjectLozenges(subjects: KeyStage4Subject[], canDelete: boolean, onClick: Function) {
    return (
      <div className="subjects-lozenges bold font-12">
        {subjects.map((subject, index) => {
          return (
            <div className={`subject-lozenge ${subject.selected ? 'active' : ''}`} key={index} onClick={() => onClick(subject)}>
              <div className="subject-name">{subject.name}</div>
              {canDelete && (<SpriteIcon name="cancel" className="subject-delete" />)}
            </div>
          )
        })}
      </div>
    );
  }

  renderSubjectsBox() {
    if (this.state.subjectGroup === SubjectGroupR21.GCSE && this.state.GCSESexpanded) {
      let subjects = [...this.state.otherGCSESubjects, ...this.state.GCSESubjects];
      return (
        <div className="subjects-typer-r21 font-14">
          <Autocomplete
            multiple={true}
            value={this.state.selectedGSCESubjects}
            options={subjects}
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
                onKeyDown={(e: any) => {
                  let pressed = enterPressed(e);
                  if (pressed) {
                    const value = e.target.value;
                    this.state.subjectSelections.push({
                      id: -1,
                      name: value,
                      isGCSE: true,
                      isVocational: false,
                      isPopular: false,
                      selected: true,
                    } as any);
                    this.setState({ subjectSelections: this.state.subjectSelections, typedSubject: '' });
                  }
                }}
                onChange={() => this.setState({ typedSubject: params.inputProps.value })}
                placeholder="If you are doing any other, rarer GCSEs, please add them here"
              />
            )}
          />
        </div>
      );
    } else {
      if (this.state.subjectGroup === SubjectGroupR21.PracticalVocational) {
        return (
          <div className="subjects-typer-r21 font-14">
            <Autocomplete
              multiple={true}
              value={this.state.selectedGSCESubjects}
              options={this.state.vocationalSubjects}
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
                  onKeyDown={(e: any) => {
                    let pressed = enterPressed(e);
                    if (pressed) {
                      const value = e.target.value;
                      this.state.subjectSelections.push({
                        id: -1,
                        name: value,
                        isGCSE: false,
                        isVocational: true,
                        isPopular: false,
                        selected: true,
                      } as any);
                      this.setState({ subjectSelections: this.state.subjectSelections, typedSubject: '' });
                    }
                  }}
                  onChange={() => this.setState({ typedSubject: params.inputProps.value })}
                  placeholder="If you are doing any other, rarer practical and vocational subjects, please add them here"
                />
              )}
            />
          </div>
        );
      }
    }
  }

  renderExpandButton() {
    if (this.state.subjectGroup === SubjectGroupR21.GCSE && !this.state.GCSESexpanded) {
      return <div
        className="expand-subjects-button subjects-typer-r21 font-14 text-center"
        onClick={() => this.setState({ GCSESexpanded: !this.state.GCSESexpanded })}
      >
        Click here if you’re doing subjects which are not on this list
      </div>
    }
  }

  renderThirdStepAButton() {
    let className = "absolute-contunue-btn font-24";
    let disabled = false;

    if (this.state.subjectSelections.length < 3) {
      className += " disabled";
      disabled = true;
    }

    return (
      <button className={className} onClick={() => {
        if (disabled) {
          this.setState({ showMinWarning: true });
        } else {
          let mathFound = this.state.subjectSelections.find(s => s.name == "Maths" || s.name == "English Language");
          if (!mathFound && !this.state.seenMathWarining) {
            disabled = true;
            this.setState({ showMathWarning: true });
          } else {
            this.props.saveAnswer(this.getAnswer());
            this.setState({subStep: SubStep.Third});
          }
        }
      }}>Continue</button>
    );
  }

  renderThirdStepBButton() {
    let className = "absolute-contunue-btn font-24";
    let disabled = false;

    let found = this.state.subjectSelections.find(s => !s.predicedStrength);
    if (found) {
      className += " disabled";
      disabled = true;
    }

    return (
      <button className={className} disabled={disabled} onClick={() => {
        this.props.saveAnswer(this.getAnswer());
        this.setState({subStep: SubStep.Fourth});
      }}>Continue</button>
    );
  }

  render() {
    let disabled = false;

    if (this.state.subStep === SubStep.Fourth) {
      return <StepCourseSelect
        choice={this.state.subjectType}
        onChoiceChange={(subjectType: FirstChoice) => {
          this.setState({ subjectType });
          const answer = this.getAnswer();
          answer.subjectType = subjectType;
          this.props.saveAnswer(answer);
        }}
        moveNext={() => this.props.moveNext(this.getAnswer())}
        moveBack={() => this.setState({ subStep: SubStep.Third })}
      />
    } else if (this.state.subStep === SubStep.Third) {
      return (
        <div className="question">
          <img src="/images/choicesTool/ThirdStepR2.png" className="third-step-img" />
          <ThirdStepBTable
            subjectSelections={this.state.subjectSelections}
            setSubjectSelections={subjectSelections => this.setState({ subjectSelections })}
          />
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.Second })} />
          {this.renderThirdStepBButton()}
        </div>
      );
    } else if (this.state.subStep === SubStep.Second) {
      return (
        <div className="question question3-first">
          <img src="/images/choicesTool/ThirdStepR1.png" className="third-step-img" />
          <div className="bold font-32 question-text-3">
            What qualifications are you currently doing?
          </div>
          <div className="font-16">
            Choose your GCSEs below, including ones in which you’ve already gained a qualification.<br />
            Then choose any Vocational and Practical qualifications (e.g. musical performance).
          </div>
          <div className="main-subjects-container">
            <div className="first-box-R21">
              <div>
                <div className="toggle-R21 font-12 bold">
                  <div
                    className={this.state.subjectGroup === SubjectGroupR21.GCSE ? "active" : ""}
                    onClick={() => this.activateSubjectGroup(SubjectGroupR21.GCSE)}
                  >
                    GCSEs
                  </div>
                  <div
                    className={this.state.subjectGroup === SubjectGroupR21.PracticalVocational ? "active" : ""}
                    onClick={() => this.activateSubjectGroup(SubjectGroupR21.PracticalVocational)}
                  >
                    Practical & Vocational Qualifications
                  </div>
                </div>
                <div className="subjects-box-s6-r21">
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
                          let passedValidation = true;

                          if (subject.name === "Combined Science (Single Award)") {
                            const found2 = selections.find((s: any) =>
                              s.name === "Combined Science (Double Award)" || s.name === "Biology" || s.name === "Chemistry" || s.name === "Physics"
                            );
                            if (found2) {
                              passedValidation = false;
                            }
                          } else if (subject.name === "Combined Science (Double Award)") {
                            const found2 = selections.find((s: any) =>
                              s.name === "Combined Science (Single Award)" || s.name === "Biology" || s.name === "Chemistry" || s.name === "Physics"
                            );
                            if (found2) {
                              passedValidation = false;
                            }
                          } else if (subject.name === "Biology" || subject.name === "Chemistry" || subject.name === "Physics") {
                            const found2 = selections.find((s: any) =>
                              s.name === "Combined Science (Single Award)" || s.name === "Combined Science (Double Award)"
                            );
                            if (found2) {
                              passedValidation = false;
                            }
                          }

                          if (passedValidation) {
                            subject.selected = true;
                            selections.push(subject);
                            this.setState({ subjectSelections: selections });
                          }
                        } else {
                          subject.selected = false;
                          let selected = selections.filter(s => s.name !== subject.name);
                          this.setState({ subjectSelections: selected });
                        }
                      })}
                  </div>
                  {this.state.subjectGroup === SubjectGroupR21.GCSE && this.state.GCSESexpanded && <div>
                    <div className="expanded-label">
                      <div className="line-r21" />
                      <div className="expanded-text font-12">More GCSEs</div>
                      <div className="line-r21" />
                    </div>
                    <div className="subjects-box-r21">
                      {this.renderSubjectLozenges(this.state.otherGCSESubjects, false,
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
                  </div>}
                  {this.state.subjectGroup === SubjectGroupR21.GCSE && this.renderSubjectsBox()}
                </div>
                {this.renderExpandButton()}
              </div>
            </div>
            <div className="second-box-R21">
              <div className="flex-center second-box-text">
                <div className="bold font-16 second-box-title">Your Subject Selections</div>
                <div className="max-label font-12">Max: 16 subjects</div>
              </div>
              {this.renderSubjectLozenges(this.state.subjectSelections, true, (subject: KeyStage4Subject) => {
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
          {this.state.showMinWarning &&
            <div className="warning-popup-s434 font-16 absolute-popup-s4-r absolute-popup-s4-r2">
              <SpriteIcon name="cancel-custom" className="close-btn-se23" onClick={() => this.setState({ showMinWarning: false })} />
              <SpriteIcon name="sixthform-warning" />
              Select your subjects to continue.
            </div>}
          {this.state.showMathWarning &&
            <div className="warning-popup-s434 font-16 absolute-popup-s4-r absolute-popup-s4-r2 absolute-popup-s4-r3">
              <SpriteIcon name="cancel-custom" className="close-btn-se23" onClick={() => this.setState({ showMathWarning: false, seenMathWarining: true })} />
              <SpriteIcon name="sixthform-warning" />
              You haven’t selected Maths and/or English<br />
              Language. Are you sure this is correct?
            </div>}
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.First })} />
          {this.renderThirdStepAButton()}
        </div>
      );
    } else if (this.state.subStep === SubStep.First) {
      if (this.state.sixthformChoice === null) {
        disabled = true;
      }

      if (this.state.sixthformChoice === SixthformChoice.SixthForm) {
        if (!this.state.schoolName || this.state.schoolName === '') {
          disabled = true;
        }
      }

      return (
        <div className="question">
          <img src="/images/choicesTool/SecondStep.png" alt="step1" className="mask-step-img" />
          <div className="bold font-32 question-text">
            Some schools and colleges share the courses they offer<br /> with our database.
          </div>
          <div className="boxes-container font-24">
            {this.renderDatabaseSchool()}
            <CheckBoxV2
              currentChoice={SixthformChoice.Forbid}
              choice={this.state.sixthformChoice}
              label="I have not chosen, or do not wish to disclose, my sixth form."
              setChoice={sixthformChoice => this.setState({ sixthformChoice })}
            />
            {this.state.sixthformChoice === SixthformChoice.Forbid &&
              <div className="help-without font-16">
                <div>
                  <SpriteIcon name="help-without" />
                </div>
                <div>
                  No problem - you can still identify suitable courses. Just remember, some may not be offered by the sixth form you choose.
                </div>
              </div>
            }
            {
              this.state.sixthformChoice === SixthformChoice.SixthForm
              && this.state.schoolId > 0
              && (this.state.schoolName === 'Hereford Sixth Form College' || this.state.schoolName === 'Worcester Sixth Form College') &&
              <div className="help-without font-16">
                <div>
                  <SpriteIcon name="help-without" />
                </div>
                <div>
                  Your subject choices have been narrowed to the courses offered by {this.state.schoolName}
                </div>
              </div>
            }
            {this.state.sixthformChoice === SixthformChoice.SixthForm
              && this.state.schoolName !== 'Hereford Sixth Form College'
              && this.state.schoolName !== 'Worcester Sixth Form College'
              && this.state.schoolName !== '' &&
              <div className="help-without font-16">
                <div>
                  <SpriteIcon name="help-without" />
                </div>
                <div>
                  {this.state.schoolName} has not uploaded its courses yet. No problem - you can still identify courses you’re suited to by completing this process, but remember that some may not be offered by your chosen sixth form.
                </div>
              </div>
            }
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.Start })} />
          <button
            className={`absolute-contunue-btn font-24 ${disabled ? "disabled" : ""}`}
            disabled={disabled}
            onClick={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: SubStep.Second });
            }}
          >Continue</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.Start) {
      return <FirstStepWelcome
        moveNext={() => this.setState({ subStep: SubStep.First })}
        moveBack={() => this.setState({ subStep: SubStep.Welcome })}
      />
    }

    return <WelcomePage moveNext={() => this.setState({ subStep: SubStep.Start })} />;
  }
}

export default FirstStep;
