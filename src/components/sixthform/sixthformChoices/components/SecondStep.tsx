import React, { Component } from "react";
import { Dialog, ListItemText, MenuItem, TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

import CheckBoxV2 from "./CheckBox";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getSixthformSchools } from "services/axios/sixthformChoices";
import BackButtonSix from "./BackButtonSix";
import ReadingV1, { ReadingChoice } from "./ReadingV1";
import ReadingV2, { ReadingChoiceV2 } from "./ReadingV2";


enum SubStep {
  Intro,
  First,
  Second,
  Reading,
  ReadingV2
}

enum SecondChoice {
  CurrentSchool = 1,
  SixthForm,
  NewSchool,
  Other
}

enum OtherChoice {
  Online = 1,
  Home,
  Combination
}

enum SixthformChoice {
  SixthForm = 1,
  Forbid
}

interface SecondQuestionProps {
  answer: any;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
}

interface SecondQuestionState {
  choice: null | SecondChoice;
  otherChoice: null | OtherChoice;
  currentSchool: string;
  subStep: SubStep;
  schools: any[];
  schoolName: string;
  schoolId: number;
  sixthformChoice: any;
  newSchoolOpen: boolean;
  readingChoice: null | ReadingChoice;
  readingChoicesV2: ReadingChoiceV2[];
}

class SecondQuestion extends Component<SecondQuestionProps, SecondQuestionState> {
  constructor(props: SecondQuestionProps) {
    super(props);

    let choice = null;
    let otherChoice = null;
    let currentSchool = '';
    let sixthformChoice = null;
    let schoolName = '';

    let subStep = SubStep.Intro;

    let readingChoice = null;
    let readingChoicesV2 = [];

    if (props.answer) {
      let answer = props.answer.answer;
      choice = answer.choice;
      otherChoice = answer.otherChoice;
      currentSchool = answer.currentSchool;
      sixthformChoice = answer.sixthformChoice;
      schoolName = answer.schoolName;
      subStep = answer.subStep;
      readingChoice = answer.readingChoice;
      if (answer.readingChoicesV2) {
        readingChoicesV2 = answer.readingChoicesV2;
      }
    }

    this.state = {
      choice,
      otherChoice,
      subStep,
      schoolId: 0,
      currentSchool,
      sixthformChoice,
      schoolName,
      schools: [],
      newSchoolOpen: false,

      readingChoice,
      readingChoicesV2
    };

    this.loadSchools();
  }

  async loadSchools() {
    const schools = await getSixthformSchools();
    if (schools) {
      this.setState({ schools });
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
                this.setState({ schoolName: v.name, schoolId: v.id })
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
              console.log('params', this.state.schoolName);

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
                    this.setState({ schoolName: e.target.value, schoolId });
                  }}
                  placeholder="Type to start browsing our database"
                />);
            }}
          />
        </div>
      </div>
    );
  }

  renderCurrentSchool() {
    return (
      <div className={`check-box-container container ${this.state.choice === SecondChoice.CurrentSchool ? "bold" : ""}`}>
        <div className="main-box" onClick={() => this.setState({ choice: SecondChoice.CurrentSchool })}>
          My current school
          <SpriteIcon name={this.state.choice === SecondChoice.CurrentSchool ? 'radio-btn-active' : 'radio-btn-blue'} />
        </div>
        {this.state.choice === SecondChoice.CurrentSchool &&
          <div className="current-school-autocomplete font-24">
            <input
              placeholder="Type your current school"
              value={this.state.currentSchool}
              onChange={e => this.setState({ currentSchool: e.target.value })}
            />
          </div>}
      </div>
    );
  }

  renderOtherChoice() {
    return (
      <div className={`check-box-container container ${this.state.choice === SecondChoice.Other ? "bold" : ""}`}>
        <div className="main-box" onClick={() => this.setState({ choice: SecondChoice.Other })}>
          Other
          <SpriteIcon name={this.state.choice === SecondChoice.Other ? 'radio-btn-active' : 'radio-btn-blue'} />
        </div>
        {this.state.choice === SecondChoice.Other &&
          <div className="other-choices">
            <div className={this.state.otherChoice === OtherChoice.Online ? "bold" : "regular"} onClick={() => this.setState({ otherChoice: OtherChoice.Online })}>
              <SpriteIcon name={this.state.otherChoice === OtherChoice.Online ? 'radio-btn-active' : 'radio-btn-blue'} />
              <span className="font-16">I will enroll in an online / distance learning college.</span>
            </div>
            <div className={this.state.otherChoice === OtherChoice.Home ? "bold" : "regular"} onClick={() => this.setState({ otherChoice: OtherChoice.Home })}>
              <SpriteIcon name={this.state.otherChoice === OtherChoice.Home ? 'radio-btn-active' : 'radio-btn-blue'} />
              <span className="font-16">I will be home schooled and / or privately tutored.</span>
            </div>
            <div className={this.state.otherChoice === OtherChoice.Combination ? "bold" : "regular"} onClick={() => this.setState({ otherChoice: OtherChoice.Combination })}>
              <SpriteIcon name={this.state.otherChoice === OtherChoice.Combination ? 'radio-btn-active' : 'radio-btn-blue'} />
              <span className="font-16">A combination of online college / homeschooling / tutoring.</span>
            </div>
          </div>}
      </div>
    );
  }

  moveBack() {
    this.props.moveBack({
      choice: this.state.choice,
      subStep: this.state.subStep,
      otherChoice: this.state.otherChoice,
      currentSchool: this.state.currentSchool,
      sixthformChoice: this.state.sixthformChoice,
      schoolName: this.state.schoolName,

      readingChoice: this.state.readingChoice,
      readingChoicesV2: this.state.readingChoicesV2
    });
  }

  moveNext() {
    this.props.moveNext({
      choice: this.state.choice,
      subStep: this.state.subStep,
      otherChoice: this.state.otherChoice,
      currentSchool: this.state.currentSchool,
      sixthformChoice: this.state.sixthformChoice,
      schoolName: this.state.schoolName,

      readingChoice: this.state.readingChoice,
      readingChoicesV2: this.state.readingChoicesV2
    });
  }

  showNewSchoolPopup() {
    if (this.state.schoolName === '') {
      return;
    }
  }

  render() {
    let disabled = false;

    if (this.state.subStep === SubStep.Intro) {
      return (
        <div className="question">
          <img src="/images/choicesTool/Step2background.png" className="step2background-img" />
          <div className="text-container-5432">
            <div>
              <div className="font-20">You’ve completed Step One, now let’s look at:</div>
              <div className="font-24">Step 2</div>
              <div className="font-48 bold">INSTITUTIONS</div>
            </div>
          </div>
          <BackButtonSix onClick={() => this.moveBack()} />
          <button
            className="absolute-contunue-btn font-24"
            onClick={() => this.setState({ subStep: SubStep.First })}
          >Begin step 2</button>
        </div>
      );
    }

    if (this.state.subStep === SubStep.ReadingV2) {
      return (
        <ReadingV2
          readingChoicesV2={this.state.readingChoicesV2}
          onChange={readingChoicesV2 => this.setState({ readingChoicesV2 })}
          moveBack={() => this.setState({ subStep: SubStep.Reading })}
          moveNext={() => this.moveNext()}
        />
      );
    } else if (this.state.subStep === SubStep.Reading) {
      return (
        <ReadingV1
          readingChoice={this.state.readingChoice}
          onChange={readingChoice => this.setState({ readingChoice })}
          moveBack={() => this.setState({ subStep: SubStep.First })}
          moveNext={() => {
            if (this.state.readingChoice === ReadingChoice.first || this.state.readingChoice === ReadingChoice.second) {
              this.setState({ subStep: SubStep.ReadingV2 })
            } else {
              this.moveNext();
            }
          }}
        />
      );
    } else if (this.state.subStep === SubStep.Second) {
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
              setChoice={choice => this.setState({ sixthformChoice: choice })}
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
          <BackButtonSix onClick={() => {
            this.setState({ subStep: SubStep.First });
          }} />
          <button
            className={`absolute-contunue-btn font-24 ${disabled ? "disabled" : ""}`}
            disabled={disabled}
            onClick={() => {
              let name = this.state.schoolName;
              let found = this.state.schools.find(s => s.name == name);
              if (found) {
                this.setState({ subStep: SubStep.Reading });
              } else {
                if (this.state.sixthformChoice === SixthformChoice.Forbid) {
                  this.setState({ subStep: SubStep.Reading });
                } else {
                  this.setState({ newSchoolOpen: true })
                }
              }
            }}
          >Continue</button>
          {this.state.newSchoolOpen &&
            <Dialog open={true} className="new-school-popup" onClose={() => this.setState({ subStep: SubStep.Reading })}>
              {this.state.schoolName} has not uploaded its courses yet. No problem - you can still identify suitable courses. Just remember, some may not be offered by the sixth form you choose.
              <div className="btn" onClick={() => this.setState({ subStep: SubStep.Reading })}>Continue</div>
            </Dialog>
          }
        </div>
      );
    }

    if (this.state.choice === null) {
      disabled = true;
    }

    if (this.state.choice === SecondChoice.Other && this.state.otherChoice === null) {
      disabled = true;
    }

    return (
      <div className="question">
        <img src="/images/choicesTool/SecondStep.png" alt="step1" className="mask-step-img" />
        <div className="bold font-32 question-text">
          Where are you planning to do your sixth form studies?
        </div>
        <div className="boxes-container boxes-container-2 font-24">
          {this.renderCurrentSchool()}
          <CheckBoxV2
            currentChoice={SecondChoice.SixthForm}
            choice={this.state.choice}
            label="A Sixth Form College or Further Education College"
            setChoice={choice => this.setState({ choice })}
          />
          <CheckBoxV2
            currentChoice={SecondChoice.NewSchool}
            choice={this.state.choice}
            label="A new school or a private sixth form college"
            setChoice={choice => this.setState({ choice })}
          />
          {this.renderOtherChoice()}
        </div>
        {this.state.choice === SecondChoice.Other && this.state.otherChoice === OtherChoice.Home && <div className="home-absolute-help-box font-16">
          <div>
            <SpriteIcon name="help-without" />
          </div>
          <div>
            If you are a home-schooled<br />
            learner and want advice around<br />
            online tutoring from Scholar 6,<br />
            contact us at<br />
            <a href="mailto: admin@scholar6.org">admin@scholar6.org</a>
          </div>
        </div>}
        <BackButtonSix onClick={() => this.setState({ subStep: SubStep.Intro })} />
        <button
          className={`absolute-contunue-btn font-24 ${disabled ? "disabled" : ""}`}
          disabled={disabled}
          onClick={() => {
            if (this.state.choice === SecondChoice.SixthForm || this.state.choice === SecondChoice.NewSchool || this.state.choice === SecondChoice.CurrentSchool) {
              this.setState({ subStep: SubStep.Second });
            } else {
              this.moveNext();
            }
          }}
        >Continue</button>
      </div>
    );
  }
}

export default SecondQuestion;
