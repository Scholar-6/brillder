import React, { Component } from "react";
import { MenuItem, TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyStage4Subject, SixthformSubject, getKeyStage4Subjects } from "services/axios/sixthformChoices";
import ThirdStepC1 from "./ThirdStepC1";
import ThirdStepC2 from "./ThirdStepC2";
import ThirdStepC3, { ThirdC3Category } from "./ThirdStepC3";
import ThirdStepC4 from "./ThirdStepC4";
import ThirdStepD, { ThirdStepDChoice } from "./ThirdStepD";
import ThirdStepE from "./ThirdStepE";
import ThirdStepF from "./ThirdStepF";
import { FirstChoice } from "../FirstStep";
import ThirdStepBTable from "./ThirdStepBTable";
import BackButtonSix from "../BackButtonSix";
import { enterPressed } from "components/services/key";
import ThirdStepWelcome from "./ThirdStepWelcome";


enum SubjectGroupR21 {
  GCSE = 1,
  PracticalVocational,
}

export enum ThirdSubStep {
  Welcome = 1,
  First,
  Second,
  ThirdC1,
  ThirdC2,
  ThirdC3,
  ThirdC4,
  ThirdD,
  ThirdE,
  ThirdF
}

interface ThirdProps {
  firstAnswer: any;
  secondAnswer: any;
  answer: any;
  subjects: SixthformSubject[];
  saveThirdAnswer(answer: any): void;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
}

interface ThirdQuestionState {
  subStep: ThirdSubStep;
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

  firstPairResults: any[];
  secondPairResults: any[];
  categoriesC3: ThirdC3Category[] | null;
  categoriesC4: any | null;
  coursesD: any | null;
  ePairResults: any[];
  coursesF: any;
}

class ThirdStep extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subStep = ThirdSubStep.First;

    let firstPairResults: any[] = [];
    let secondPairResults: any[] = [];

    let categoriesC3: any = null;
    let categoriesC4: any = null;

    let ePairResults: any[] = [];

    let coursesD: any = null;
    let coursesF: any = null;

    if (this.props.answer) {
      const { answer } = props.answer;
      subStep = answer.subStep;

      if (answer.firstPairResults) {
        firstPairResults = answer.firstPairResults;
      }
      if (answer.secondPairResults) {
        secondPairResults = answer.secondPairResults;
      }

      if (answer.categoriesC3) {
        categoriesC3 = answer.categoriesC3;
      }
      if (answer.categoriesC4) {
        categoriesC4 = answer.categoriesC4;
      }

      if (answer.coursesD) {
        coursesD = answer.coursesD;
      }

      if (answer.ePairResults) {
        ePairResults = answer.ePairResults;
      }

      if (answer.coursesF) {
        coursesF = answer.coursesF;
      }
    }

    this.state = {
      subStep,
      typedSubject: '',
      subjectGroup: SubjectGroupR21.GCSE,
      GCSESubjects: [],
      GCSESexpanded: false,
      limit: 1300,
      vocationalSubjects: [],
      subjectSelections: [],
      allSubjects: [],
      otherGCSESubjects: [],
      selectedGSCESubjects: [],

      firstPairResults,
      secondPairResults,

      ePairResults,

      categoriesC3,
      categoriesC4,

      coursesD,
      coursesF
    }

    this.loadSubjects();
  }

  getAnswer() {
    return {
      subStep: this.state.subStep,
      subjectSelections: this.state.subjectSelections,
      firstPairResults: this.state.firstPairResults,
      secondPairResults: this.state.secondPairResults,

      categoriesC3: this.state.categoriesC3,
      categoriesC4: this.state.categoriesC4,

      coursesD: this.state.coursesD,

      ePairResults: this.state.ePairResults,

      coursesF: this.state.coursesF,
    };
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

  moveNext() {
    this.props.moveNext(this.getAnswer());
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
        this.props.saveThirdAnswer(this.getAnswer());
        // all courses and A-levels can go to C1 else D
        if (this.props.firstAnswer && this.props.firstAnswer.answer) {
          let choice = this.props.firstAnswer.answer.choice;
          if (choice === FirstChoice.ALevel || choice === FirstChoice.ShowMeAll) {
            this.setState({ subStep: ThirdSubStep.ThirdC1 });
          } else {
            this.setState({ subStep: ThirdSubStep.ThirdD });
          }
        } else {
          this.setState({ subStep: ThirdSubStep.ThirdD });
        }
      }}>Continue</button>
    );
  }

  renderThirdStepAButton() {
    let className = "absolute-contunue-btn font-24";
    let disabled = false;

    if (this.state.subjectSelections.length < 3) {
      className += " disabled";
      disabled = true;
    }

    return (
      <button className={className} disabled={disabled} onClick={() => {
        this.props.saveThirdAnswer(this.getAnswer());
        this.setState({ subStep: ThirdSubStep.Second });
      }}>Continue</button>
    );
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

  renderSubjectsBox() {
    if (this.state.subjectGroup === SubjectGroupR21.GCSE && this.state.GCSESexpanded) {
      console.log('rendering subjects box input');
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

  render() {
    if (this.state.subStep === ThirdSubStep.ThirdF) {
      return (
        <div className="question question-3d">
          <ThirdStepF
            subjects={this.props.subjects}
            answer={this.state.coursesF}
            moveBack={coursesF => {
              this.setState({ coursesF });
              if (
                this.state.coursesD &&
                this.state.coursesD.choice && (
                  this.state.coursesD.choice === ThirdStepDChoice.Second ||
                  this.state.coursesD.choice === ThirdStepDChoice.Third)
              ) {
                this.setState({ subStep: ThirdSubStep.ThirdD });
              } else {
                this.setState({ subStep: ThirdSubStep.ThirdE });
              }
            }}
            moveToStep4={coursesF => {
              let answer = this.getAnswer();
              answer.coursesF = coursesF;
              this.setState({ coursesF });
              this.props.moveNext(answer);
            }}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.ThirdE) {
      return (
        <div className="question">
          <ThirdStepE
            pairAnswers={this.state.ePairResults}
            onChange={(ePairResults: any[]) => {
              this.setState({ ePairResults });
            }}
          />
          <BackButtonSix onClick={() => {
            if (
              this.props.secondAnswer &&
              this.props.secondAnswer.answer &&
              this.props.secondAnswer.answer.databaseSchool &&
              this.props.secondAnswer.answer.databaseSchool.name === "Hereford Sixth Form College"
            ) {
              this.setState({ subStep: ThirdSubStep.ThirdC4 });
            } else {
              this.setState({ subStep: ThirdSubStep.ThirdD })
            }
          }} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: ThirdSubStep.ThirdF });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.ThirdD) {
      return (
        <div className="question question-3d">
          <ThirdStepD
            subjects={this.props.subjects}
            answer={this.state.coursesD}
            onChange={coursesD => this.setState({ coursesD })}
            saveAnswer={coursesD => {
              this.setState({ coursesD });
              let answer = this.getAnswer();
              answer.coursesD = coursesD;
              this.props.saveThirdAnswer(answer);
            }}
            moveBack={coursesD => {
              let choice = this.props.firstAnswer.answer.choice;
              if (choice === FirstChoice.ShowMeAll) {
                this.setState({ subStep: ThirdSubStep.ThirdC4, coursesD });
              } else {
                this.setState({ subStep: ThirdSubStep.Second, coursesD });
              }
            }}
            moveToStepE={() => {
              this.props.saveThirdAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.ThirdE });
            }}
            moveToStepF={() => {
              this.props.saveThirdAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.ThirdF });
            }}
            moveToStep4={() => {
              this.props.saveThirdAnswer(this.getAnswer());
              this.moveNext();
            }}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.ThirdC4) {
      return (
        <div className="question question-c4">
          <ThirdStepC4
            subjects={this.props.subjects} categoriesC4={this.state.categoriesC4}
            onChange={categoriesC4 => {
              this.setState({ categoriesC4 })
            }}
            onSkip={() => {
              if (this.props.firstAnswer.answer.choice === FirstChoice.ALevel) {
                this.moveNext()
              } else {
                if (
                  this.props.secondAnswer &&
                  this.props.secondAnswer.answer &&
                  this.props.secondAnswer.answer.databaseSchool &&
                  this.props.secondAnswer.answer.databaseSchool.name === "Hereford Sixth Form College"
                ) {
                  this.setState({ subStep: ThirdSubStep.ThirdE });
                } else {
                  this.setState({ subStep: ThirdSubStep.ThirdD });
                }
              }
            }}
          />
          <BackButtonSix onClick={() => this.setState({ subStep: ThirdSubStep.ThirdC3 })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            if (this.props.firstAnswer.answer.choice === FirstChoice.ALevel) {
              this.moveNext()
            } else {
              if (
                this.props.secondAnswer &&
                this.props.secondAnswer.answer &&
                this.props.secondAnswer.answer.databaseSchool &&
                this.props.secondAnswer.answer.databaseSchool.name === "Hereford Sixth Form College"
              ) {
                this.setState({ subStep: ThirdSubStep.ThirdE });
                console.log('move next')
              } else {
                this.setState({ subStep: ThirdSubStep.ThirdD });
              }
            }
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.ThirdC3) {
      return (
        <div className="question question-c3">
          <ThirdStepC3
            answer={this.state.categoriesC3}
            onChange={categoriesC3 => this.setState({ categoriesC3 })}
          />
          <BackButtonSix onClick={() => this.setState({ subStep: ThirdSubStep.ThirdC2 })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: ThirdSubStep.ThirdC4 });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.ThirdC2) {
      return (
        <div className="question step3question5">
          <ThirdStepC2
            pairAnswers={this.state.secondPairResults}
            onChange={(secondPairResults: any[]) => {
              this.setState({ secondPairResults });
            }}
          />
          <BackButtonSix onClick={() => { this.setState({ subStep: ThirdSubStep.ThirdC1 }) }} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: ThirdSubStep.ThirdC3 });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.ThirdC1) {
      return (
        <div className="question">
          <ThirdStepC1
            pairAnswers={this.state.firstPairResults}
            onChange={(firstPairResults: any[]) => {
              this.setState({ firstPairResults });
            }}
          />
          <BackButtonSix onClick={() => this.setState({ subStep: ThirdSubStep.Second })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: ThirdSubStep.ThirdC2 });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.Second) {
      return (
        <div className="question">
          <img src="/images/choicesTool/ThirdStepR2.png" className="third-step-img" />
          <ThirdStepBTable
            subjectSelections={this.state.subjectSelections}
            setSubjectSelections={subjectSelections => this.setState({ subjectSelections })}
          />
          <BackButtonSix onClick={() => this.setState({ subStep: ThirdSubStep.First })} />
          {this.renderThirdStepBButton()}
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.First) {
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
              <div className="bold font-16 second-box-title">Your Subject Selections</div>
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
          <BackButtonSix onClick={() => this.setState({ subStep: ThirdSubStep.Welcome})} />
          {this.renderThirdStepAButton()}
        </div>
      );
    }

    return <ThirdStepWelcome
      moveNext={() => this.setState({ subStep: ThirdSubStep.First})}
      moveBack={() => this.props.moveBack(this.getAnswer())}
    />
  }
}

export default ThirdStep;
