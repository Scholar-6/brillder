import React, { Component } from "react";

interface UserProfileProps {
  moveNext(): void;
  moveBack(): void;
}

interface FirstQuestionProps {
  choice: any;
  popup: boolean;
}

class SecondQuestion extends Component<UserProfileProps, FirstQuestionProps> {
  constructor(props: UserProfileProps) {
    super(props);

    this.state = {
      choice: null,
      popup: false
    }
  }

  render() {
    let renderCheckbox = (currentChoice: any, label: string) => {
      return (
        <label className="check-box-container container" onClick={() => this.setState({ choice: currentChoice })}>
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
          {renderCheckbox(1, "My current school")}
          {renderCheckbox(2, "A Sixth Form or FE College")}
          {renderCheckbox(3, "A a new school or a private sixth form college")}
          {renderCheckbox(4, "Other")}
          {renderCheckbox(5, "I’m not sure yet")}
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
        <button className="absolute-contunue-btn font-25" onClick={this.props.moveNext}>Continue to Step 3</button>
      </div>
    );
  }
}

export default SecondQuestion;
