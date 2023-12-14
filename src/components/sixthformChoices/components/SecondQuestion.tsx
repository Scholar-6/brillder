import SpriteIcon from "components/baseComponents/SpriteIcon";
import React, { Component } from "react";

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

interface SecondQuestionProps {
  answer: any;
  moveNext(answer: any): void;
  moveBack(): void;
}

interface SecondQuestionState {
  choice: null | SecondChoice;
  otherChoice: null | OtherChoice;
  currentSchool: string;
  popup: boolean;
}

class SecondQuestion extends Component<SecondQuestionProps, SecondQuestionState> {
  constructor(props: SecondQuestionProps) {
    super(props);

    let choice = null;
    let otherChoice = null;

    if (props.answer) {
      choice = props.answer.answer.choice;
      otherChoice = props.answer.answer.otherChoice;
    }

    this.state = {
      choice,
      otherChoice,
      currentSchool: '',
      popup: false
    }
  }

  render() {
    let renderCheckbox = (currentChoice: SecondChoice, label: string) => {
      if (currentChoice === SecondChoice.CurrentSchool) {
        return (
          <label className={`check-box-container container ${currentChoice === this.state.choice ? "bold" : ""}`} onClick={() => this.setState({ choice: currentChoice })}>
            {label}
            <span className={`checkmark ${currentChoice === this.state.choice ? "checked" : ""}`}></span>
            <input
              placeholder="Type your current school"
              value={this.state.currentSchool}
              onChange={e => this.setState({ currentSchool: e.target.value })}
            />
          </label>
        );
      }
      return (
        <label className={`check-box-container container ${currentChoice === this.state.choice ? "bold" : ""}`} onClick={() => this.setState({ choice: currentChoice })}>
          {label}
          <span className={`checkmark ${currentChoice === this.state.choice ? "checked" : ""}`}></span>
        </label>
      );
    }

    const renderOtherChoice = () => {
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

    let disabled = false;

    if (this.state.choice === null) {
      disabled = true;
    }

    if (this.state.choice === SecondChoice.Other && this.state.otherChoice === null) {
      disabled = true;
    }

    return (
      <div className="question">
        <div className="progress-bar">
          <div className='start active' />
          <div className='active' />
          <div />
          <div />
          <div />
          <div className="end" />
        </div>
        <div className="font-16">
          STEP 2: INSTITUTIONS
        </div>
        <div className="bold font-32 question-text">
          Where are you planning to do your sixth form studies?
        </div>
        <div className="boxes-container font-24">
          {renderCheckbox(SecondChoice.CurrentSchool, "my current school")}
          {renderCheckbox(SecondChoice.SixthForm, "a Sixth Form or FE College")}
          {renderCheckbox(SecondChoice.NewSchool, "a new school or a private sixth form college")}
          {renderOtherChoice()}
        </div>
        <div id="result1"></div>
        <div className="absolute-back-btn" onClick={() => {
          this.props.moveBack();
        }}>
          <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-25">Previous</span>
        </div>
        <button
          className={`absolute-contunue-btn font-25 ${disabled ? "disabled" : ""}`}
          disabled={disabled}
          onClick={() => {
            this.props.moveNext({
              choice: this.state.choice,
              otherChoice: this.state.otherChoice,
              currentSchool: this.state.currentSchool
            });
          }}
        >Continue</button>
      </div>
    );
  }
}

export default SecondQuestion;
