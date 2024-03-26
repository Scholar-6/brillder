import React, { Component } from "react";
import { MenuItem, TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyStage4Subject, SixthformSubject, getKeyStage4Subjects } from "services/axios/sixthformChoices";
import { FirstChoice } from "../secondStep/StepCourseSelect";
import ThirdStepBTable from "./ThirdStepBTable";
import BackButtonSix from "../BackButtonSix";
import { enterPressed } from "components/services/key";
import FourthStepWelcome from "./FourthStepWelcome";
import FourthStepListening from "./FourthStepListening";
import FourthStepListenStart from "./FourthStepListenStart";


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
  ThirdF,
  ListenStart,
  Listening,
}

interface ThirdProps {
  secondAnswer: any;
  thirdAnswer: any;
  answer: any;
  subjects: SixthformSubject[];
  saveThirdAnswer(answer: any): void;
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

  listeningChoices: any[];
}

class FourthStep extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subStep = ThirdSubStep.First;

    let listeningChoices = [
      {
        label: 'Current Affairs, News & Talk (e.g. Radio Four)',
        choice: null
      }, {
        label: 'Podcasts (e.g. Joe Rogan)',
        choice: null
      }, {
        label: 'Sport & Sport Talk (e.g. Radio Five)',
        choice: null
      }, {
        label: 'Audiobooks (e.g. Audible)',
        choice: null
      }, {
        label: 'Comedy and Drama (e.g. Radio Four)',
        choice: null
      }, {
        label: 'Mainstream Music (Rock, Rap, Pop & Chart)',
        choice: null
      }, {
        label: 'Music, Folk or Jazz',
        choice: null
      }, {
        label: 'Music, Classical ',
        choice: null
      }
    ];

    if (this.props.answer) {
      const { answer } = props.answer;
      subStep = answer.subStep;

      if (answer.listeningChoices) {
        listeningChoices = answer.listeningChoices;
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

      listeningChoices,
    }

    this.loadSubjects();
  }

  getAnswer() {
    return {
      subStep: this.state.subStep,
      subjectSelections: this.state.subjectSelections,
      listeningChoices: this.state.listeningChoices,
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
        if (this.props.secondAnswer && this.props.secondAnswer.answer) {
          let choice = this.props.secondAnswer.answer.subjectType;
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
      <button className={className} onClick={() => {
        if (disabled) {
          this.setState({ showMinWarning: true });
        } else {
          let mathFound = this.state.subjectSelections.find(s => s.name == "Maths" || s.name == "English Language");
          if (!mathFound && !this.state.seenMathWarining) {
            disabled = true;
            this.setState({ showMathWarning: true });
          } else {
            this.props.saveThirdAnswer(this.getAnswer());
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
    if (this.state.subStep === ThirdSubStep.Listening) {
      return (
        <FourthStepListening
          listeningChoices={this.state.listeningChoices}
          onChange={listeningChoices => this.setState({ listeningChoices })}
          moveBack={() => this.setState({ subStep: ThirdSubStep.ListenStart })}
          moveNext={async () => {
            await this.props.saveThirdAnswer(this.getAnswer());
            this.moveNext();
          }} />
      );
    } else if (this.state.subStep === ThirdSubStep.ListenStart) {
      return <FourthStepListenStart
        moveNext={() => this.setState({ subStep: ThirdSubStep.Listening })}
        moveBack={() => {
          if (this.props.secondAnswer && this.props.secondAnswer.answer.subjectType === FirstChoice.ALevel) {
            this.setState({ subStep: ThirdSubStep.ThirdC4 });
          } else {
            this.setState({ subStep: ThirdSubStep.ThirdF });
          }
        }}
      />
    } else if (this.state.subStep === ThirdSubStep.ThirdF) {
      
    } else if (this.state.subStep === ThirdSubStep.ThirdE) {
      
    } else if (this.state.subStep === ThirdSubStep.ThirdD) {
      
    } else if (this.state.subStep === ThirdSubStep.ThirdC4) {
      
    } else if (this.state.subStep === ThirdSubStep.ThirdC3) {
      
    } else if (this.state.subStep === ThirdSubStep.ThirdC2) {
      
    } else if (this.state.subStep === ThirdSubStep.ThirdC1) {
      
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
      
    }

    return <FourthStepWelcome
      moveNext={() => this.setState({ subStep: ThirdSubStep.First })}
      moveBack={() => this.props.moveBack(this.getAnswer())}
    />
  }
}

export default FourthStep;
