import React, { Component } from "react";
import { ListItemText, MenuItem, TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

import CheckBoxV2 from "./CheckBox";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getSixthformSchools } from "services/axios/sixthformChoices";
import BackButtonSix from "./BackButtonSix";


enum SubStep {
  First,
  Second
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
  sixthformChoice: any;
}

class SecondQuestion extends Component<SecondQuestionProps, SecondQuestionState> {
  constructor(props: SecondQuestionProps) {
    super(props);

    let choice = null;
    let otherChoice = null;
    let currentSchool = '';
    let sixthformChoice = null;
    let schoolName = '';

    let subStep = SubStep.First;

    if (props.answer) {
      choice = props.answer.answer.choice;
      otherChoice = props.answer.answer.otherChoice;
      currentSchool = props.answer.answer.currentSchool;
      sixthformChoice = props.answer.answer.sixthformChoice;
      schoolName = props.answer.answer.schoolName,
      subStep = props.answer.answer.subStep;
    }

    this.state = {
      choice,
      otherChoice,
      subStep,
      currentSchool,
      sixthformChoice,
      schoolName,
      schools: []
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
          Write the name of the institution into the search box and press enter.
          <SpriteIcon name={this.state.sixthformChoice === SixthformChoice.SixthForm ? 'radio-btn-active' : 'radio-btn-blue'} />
        </div>
        <div className="current-school-autocomplete font-24">
          <Autocomplete
            freeSolo
            options={this.state.schools}
            onChange={(e: any, v: any) => {
              this.setState({ schoolName: v.name })
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
            renderInput={(params: any) => (
              <TextField
                {...params}
                variant="standard"
                label=""
                value={this.state.schoolName}
                onChange={(e) => {
                  console.log(e);
                  this.setState({ schoolName: e.target.value });
                }}
                placeholder="Type to start browsing our database"
              />
            )}
          />
        </div>
      </div>
    );
  }

  renderCurrentSchool() {
    return (
      <div className={`check-box-container container ${this.state.choice === SecondChoice.CurrentSchool ? "bold" : ""}`}>
        <div className="main-box" onClick={() => this.setState({ choice: SecondChoice.CurrentSchool })}>
          my current school
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
          other
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
      schoolName: this.state.schoolName
    });
  }

  moveNext() {
    this.props.moveNext({
      choice: this.state.choice,
      subStep: this.state.subStep,
      otherChoice: this.state.otherChoice,
      currentSchool: this.state.currentSchool,
      sixthformChoice: this.state.sixthformChoice,
      schoolName: this.state.schoolName
    });
  }

  render() {
    let disabled = false;

    if (this.state.subStep === SubStep.Second) {
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
          <div className="bold font-32 question-text">
            Some schools and colleges share the courses they offer with our database.
          </div>
          <div className="boxes-container font-24">
            {this.renderDatabaseSchool()}
            <CheckBoxV2
              currentChoice={SixthformChoice.Forbid}
              choice={this.state.sixthformChoice}
              label="I have not chosen, or don’t wish to disclose, my sixth form"
              setChoice={choice => this.setState({ sixthformChoice: choice })}
            />
            {this.state.sixthformChoice === SixthformChoice.Forbid &&
              <div className="help-without font-16">
                <div>
                  <SpriteIcon name="help-without" />
                </div>
                <div>
                  No problem - you can still identify courses you’re suited to by completing this process,<br /> but remember that some may not be offered by the sixth form you eventually choose.
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
              this.moveNext();
            }}
          >Continue</button>
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
        <div className="bold font-32 question-text">
          Where are you planning to do your sixth form studies?
        </div>
        <div className="boxes-container boxes-container-2 font-24">
          {this.renderCurrentSchool()}
          <CheckBoxV2
            currentChoice={SecondChoice.SixthForm}
            choice={this.state.choice}
            label="a Sixth Form or FE College"
            setChoice={choice => this.setState({ choice })}
          />
          <CheckBoxV2
            currentChoice={SecondChoice.NewSchool}
            choice={this.state.choice}
            label="a new school or a private sixth form college"
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
        <BackButtonSix onClick={() => this.moveBack()} />
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
