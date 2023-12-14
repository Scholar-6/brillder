import React, { Component } from "react";

enum SecondChoice {
  CurrentSchool = 1,
  SixthForm,
  NewSchool,
  Other
}

interface SecondQuestionProps {
  answer: any;
  moveNext(answer: any): void;
  moveBack(): void;
}

interface SecondQuestionState {
  choice: null | SecondChoice;
  currentSchool: string;
  popup: boolean;
}

class SecondQuestion extends Component<SecondQuestionProps, SecondQuestionState> {
  constructor(props: SecondQuestionProps) {
    super(props);

    let choice = null;
    
    if (props.answer) {
      choice = props.answer.answer.choice;
    }

    this.state = {
      choice,
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
              onChange={e => this.setState({currentSchool: e.target.value})}
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
          {renderCheckbox(SecondChoice.Other, "other")}
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
        <button className="absolute-contunue-btn font-25" onClick={() => this.props.moveNext({choice: this.state.choice})}>Continue to Step 3</button>
      </div>
    );
  }
}

export default SecondQuestion;
