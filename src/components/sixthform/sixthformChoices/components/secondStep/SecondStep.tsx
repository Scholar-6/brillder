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
import { FirstChoice } from "../secondStep/StepCourseSelect";
import { enterPressed } from "components/services/key";
import SecondStepWelcome from "./SecondStepWelcome";


enum SubjectGroupR21 {
  GCSE = 1,
  PracticalVocational,
}

export enum ThirdSubStep {
  Welcome = 1,
  First,
  Second,
  Third,
  Fourth,
  Fifth,
  Sixth,
  Seventh,
  Eight,
  Ninth,
  Tenth
}

interface ThirdProps {
  firstAnswer: any;
  answer: any;
  subjects: SixthformSubject[];
  saveAnswer(answer: any): void;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
}

interface ThirdQuestionState {
  showMinWarning: boolean;
  showMathWarning: boolean;
  seenMathWarining: boolean;

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

class SecondStep extends Component<ThirdProps, ThirdQuestionState> {
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
      showMinWarning: false,
      showMathWarning: false,
      seenMathWarining: false,

      subStep,
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

      firstPairResults,
      secondPairResults,

      ePairResults,

      categoriesC3,
      categoriesC4,

      coursesD,
      coursesF,
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
        this.props.saveAnswer(this.getAnswer());
        // all courses and A-levels can go to C1 else D
        if (this.props.firstAnswer && this.props.firstAnswer.answer) {
          let choice = this.props.firstAnswer.answer.subjectType;
          if (choice === FirstChoice.ALevel || choice === FirstChoice.ShowMeAll) {
            //this.setState({ subStep: ThirdSubStep.ThirdC1 });
          } else {
            //this.setState({ subStep: ThirdSubStep.ThirdD });
          }
        } else {
          //this.setState({ subStep: ThirdSubStep.Eight });
          //this.setState({ subStep: ThirdSubStep.ThirdD });
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
            this.setState({ subStep: ThirdSubStep.Second });
          }
        }
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
    if (this.state.subStep === ThirdSubStep.Seventh) {
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
              this.props.saveAnswer(answer);
            }}
            moveBack={coursesD => {
              let choice = this.props.firstAnswer.answer.subjectType;

              /*
              if (choice === FirstChoice.ShowMeAll) {
                this.setState({ subStep: ThirdSubStep.ThirdC4, coursesD });
              } else {
                this.setState({ subStep: ThirdSubStep.Second, coursesD });
              }*/
              this.setState({subStep: ThirdSubStep.Fifth});
            }}
            moveToStepE={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({subStep: ThirdSubStep.Seventh});
              //this.setState({ subStep: ThirdSubStep.ThirdE });
            }}
            moveToStepF={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({subStep: ThirdSubStep.Seventh});
              //this.setState({ subStep: ThirdSubStep.ThirdF });
            }}
            moveToStep4={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({subStep: ThirdSubStep.Seventh});
              //this.moveNext();
            }}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.Sixth) {
      return (
        <div className="question question-3d">
          <ThirdStepF
            subjects={this.props.subjects}
            answer={this.state.coursesF}
            moveBack={coursesF => {
              /*
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
              }*/
              this.setState({ subStep: ThirdSubStep.Fifth });
            }}
            moveToStep4={coursesF => {
              let answer = this.getAnswer();
              answer.coursesF = coursesF;
              this.setState({ subStep: ThirdSubStep.Seventh });
              //this.props.saveThirdAnswer(answer);
              //this.props.moveNext(answer);
            }}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.Fifth) {
      
      return (
        <div className="question">
          <ThirdStepE
            pairAnswers={this.state.ePairResults}
            onChange={(ePairResults: any[]) => {
              this.setState({ ePairResults });
            }}
            moveBack={() => {
              this.setState({ subStep: ThirdSubStep.Fourth });

              /*
              if (
                this.props.firstAnswer &&
                this.props.firstAnswer.answer &&
                this.props.firstAnswer.answer.databaseSchool &&
                this.props.firstAnswer.answer.databaseSchool.name === "Hereford Sixth Form College"
              ) {
                this.setState({ subStep: ThirdSubStep.ThirdC4 });
              } else {
                this.setState({ subStep: ThirdSubStep.ThirdD })
              }*/
            }}
            moveNext={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.Sixth });
            }}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.Fourth) {
      return (
        <div className="question question-c3">
          <ThirdStepC3
            answer={this.state.categoriesC3}
            onChange={categoriesC3 => this.setState({ categoriesC3 })}
            moveNext={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.Fifth });

              /*
              if (
                this.props.firstAnswer &&
                this.props.firstAnswer.answer &&
                this.props.firstAnswer.answer.databaseSchool &&
                this.props.firstAnswer.answer.databaseSchool.name === "Hereford Sixth Form College"
              ) {
                this.setState({ subStep: ThirdSubStep.ThirdE });
              } else {
                this.setState({ subStep: ThirdSubStep.ThirdD });
              }*/
            }}
            moveBack={() => {
              this.setState({ subStep: ThirdSubStep.Third });
            }}
          />
        </div>
      );
      
    } else if (this.state.subStep === ThirdSubStep.Third) {
      return (
        <div className="question question-c4">
          <ThirdStepC4
            subjects={this.props.subjects} categoriesC4={this.state.categoriesC4}
            onChange={categoriesC4 => {
              this.setState({ categoriesC4 })
            }}
            moveNext={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.Fourth });

              /*
              if (this.props.firstAnswer.answer.subjectType === FirstChoice.ALevel) {
                this.props.moveNext(this.getAnswer());
              } else {
                if (
                  this.props.firstAnswer &&
                  this.props.firstAnswer.answer &&
                  this.props.firstAnswer.answer.databaseSchool &&
                  this.props.firstAnswer.answer.databaseSchool.name === "Hereford Sixth Form College"
                ) {
                  this.setState({ subStep: ThirdSubStep.ThirdE });
                } else {
                  this.setState({ subStep: ThirdSubStep.ThirdD });
                }
              }*/
            }}
            moveBack={() => this.setState({ subStep: ThirdSubStep.Second })}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.Second) {
      return (
        <div className="question step3question5">
          <img src="/images/choicesTool/ThirdStepR3.png" className="third-step-img"></img>
          <ThirdStepC2
            pairAnswers={this.state.secondPairResults}
            onChange={(secondPairResults: any[]) => {
              this.setState({ secondPairResults });
            }}
            moveBack={() => {
              this.setState({ subStep: ThirdSubStep.First })
            }}
            moveNext={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.Third });
            }}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.First) {
      return (
        <div className="question">
          <img src="/images/choicesTool/ThirdStepR3.png" className="third-step-img"></img>
          <ThirdStepC1
            pairAnswers={this.state.firstPairResults}
            onChange={(firstPairResults: any[]) => {
              this.setState({ firstPairResults });
            }}
            moveBack={() => {
              this.setState({ subStep: ThirdSubStep.Welcome });
            }}
            moveNext={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.Second });
            }}
          />
        </div>
      );
    }

    return <SecondStepWelcome
      moveNext={() => this.setState({ subStep: ThirdSubStep.First })}
      moveBack={() => this.props.moveBack(this.getAnswer())}
    />
  }
}

export default SecondStep;
