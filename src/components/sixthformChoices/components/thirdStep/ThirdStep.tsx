import React, { Component } from "react";
import { MenuItem, TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyStage4Subject, SixthformSubject, getKeyStage4Subjects } from "services/axios/sixthformChoices";
import ThirdStepC1 from "./ThirdStepC1";
import ThirdStepC2 from "./ThirdStepC2";
import ThirdStepC3, { ThirdC3Category } from "./ThirdStepC3";
import ThirdStepC4 from "./ThirdStepC4";
import ThirdStepD from "./ThirdStepD";
import ThirdStepE from "./ThirdStepE";
import ThirdStepF from "./ThirdStepF";
import { FirstChoice } from "../FirstStep";
import ThirdStepBTable from "./ThirdStepBTable";
import BackButtonSix from "../BackButtonSix";


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
  ThirdE,
  ThirdF
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

    this.state = {
      subStep: SubStep.First,
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

      firstPairResults: [],
      secondPairResults: [],

      ePairResults: [],

      categoriesC3: null,
      categoriesC4: null,

      coursesD: null,
      coursesF: null
    }

    this.loadSubjects();
  }

  getAnswer() {
    return {
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

      let firstPairResults: any[] = [];
      let secondPairResults: any[] = [];
      let categoriesC3: any = null;
      let categoriesC4: any = null;
      let ePairResults: any[] = [];

      for (let subject of subjects) {
        subject.predicedStrength = 0;
      }

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
        if (answer.categoriesC3) {
          categoriesC3 = answer.categoriesC3;
        }
        if (answer.categoriesC4) {
          categoriesC4 = answer.categoriesC4;
        }

        if (answer.ePairResults) {
          ePairResults = answer.ePairResults;
        }

        if (answer.coursesD) {
          this.setState({ coursesD: answer.coursesD });
        }
        if (answer.coursesF) {
          this.setState({ coursesF: answer.coursesF });
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

      this.setState({
        allSubjects: subjects,
        subjectSelections: realSubjectSelections,
        GCSESubjects: subjects.filter(s => s.isGCSE && s.isPopular),
        vocationalSubjects: subjects.filter(s => s.isVocational && s.isPopular),
        otherGCSESubjects: subjects.filter(s => s.isGCSE && !s.isPopular),
        firstPairResults,
        secondPairResults,
        categoriesC3,
        categoriesC4,
        ePairResults
      });
    }
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

  moveNext() {
    this.props.moveNext({
      subjectSelections: this.state.subjectSelections
    });
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
        let choice = this.props.firstAnswer.answer.choice;
        if (choice === FirstChoice.ALevel || choice === FirstChoice.ShowMeAll) {
          this.setState({ subStep: SubStep.ThirdC1 });
        } else {
          this.setState({ subStep: SubStep.ThirdD });
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
        this.setState({ subStep: SubStep.Second });
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
      return (
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
        </div>
      );
    }
  }

  render() {
    if (this.state.subStep === SubStep.ThirdF) {
      return (
        <div className="question question-3d">
          <ThirdStepF
            subjects={this.props.subjects}
            answer={this.state.coursesF}
            moveBack={() => {
              this.setState({ subStep: SubStep.ThirdE });
            }}
            moveToStep4={coursesF => {
              this.setState({ coursesF });
              let answer = this.getAnswer();
              answer.coursesF = coursesF;
              this.props.saveThirdAnswer(answer);
              this.moveNext();
            }}
          />
        </div>
      );
    } else if (this.state.subStep === SubStep.ThirdE) {
      return (
        <div className="question">
          <ThirdStepE
            pairAnswers={this.state.ePairResults}
            onChange={(ePairResults: any[]) => {
              this.setState({ ePairResults });
            }}
          />
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.ThirdD })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: SubStep.ThirdF });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.ThirdD) {
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
            moveBack={() => {
              let choice = this.props.firstAnswer.answer.choice;
              if (choice === FirstChoice.ShowMeAll) {
                this.setState({ subStep: SubStep.ThirdC4 });
              } else {
                this.setState({ subStep: SubStep.Second });
              }
            }}
            moveToStepE={() => {
              this.props.saveThirdAnswer(this.getAnswer());
              this.setState({ subStep: SubStep.ThirdE });
            }}
            moveToStepF={() => {
              this.props.saveThirdAnswer(this.getAnswer());
              this.setState({ subStep: SubStep.ThirdF });
            }}
            moveToStep4={() => {
              this.props.saveThirdAnswer(this.getAnswer());
              this.moveNext();
            }}
          />
        </div>
      );
    } else if (this.state.subStep === SubStep.ThirdC4) {
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
                this.setState({ subStep: SubStep.ThirdD });
              }
            }}
          />
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.ThirdC3 })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            if (this.props.firstAnswer.answer.choice === FirstChoice.ALevel) {
              this.moveNext()
            } else {
              this.setState({ subStep: SubStep.ThirdD });
            }
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.ThirdC3) {
      return (
        <div className="question question-c3">
          <ThirdStepC3
            answer={this.state.categoriesC3}
            onChange={categoriesC3 => this.setState({ categoriesC3 })}
          />
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.ThirdC2 })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: SubStep.ThirdC4 });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.ThirdC2) {
      return (
        <div className="question step3question5">
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
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.ThirdC1) {
      return (
        <div className="question">
          <ThirdStepC1
            pairAnswers={this.state.firstPairResults}
            onChange={(firstPairResults: any[]) => {
              this.setState({ firstPairResults });
            }}
          />
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.Second })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveThirdAnswer(this.getAnswer());
            this.setState({ subStep: SubStep.ThirdC2 });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.Second) {
      return (
        <div className="question">
          <ThirdStepBTable
            subjectSelections={this.state.subjectSelections}
            setSubjectSelections={subjectSelections => this.setState({ subjectSelections })}
          />
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.First })} />
          {this.renderThirdStepBButton()}
        </div>
      );
    }
    return (
      <div className="question question3-first">
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
                        subject.selected = true;
                        selections.push(subject);
                        this.setState({ subjectSelections: selections });
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
        <BackButtonSix onClick={() => this.props.moveBack()} />
        {this.renderThirdStepAButton()}
      </div>
    );
  }
}

export default ThirdStep;
