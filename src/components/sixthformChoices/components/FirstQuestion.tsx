import React, { Component } from "react";

interface FirstQuestionProps {
  answer: any;
  moveNext(answer: any): void;
  moveBack(): void;
}

interface FirstQuestionState {
  choice: any;
  popup: boolean;
}

class FirstQuestion extends Component<FirstQuestionProps, FirstQuestionState> {
  constructor(props: FirstQuestionProps) {
    super(props);

    let choice = null;

    if (props.answer) {
      choice = props.answer.answer.choice;
    }

    this.state = {
      choice,
      popup: false
    }
  }

  moveNext() {
    this.props.moveNext({ choice: this.state.choice });
  }

  renderPopup() {
    return (
      <div className="popup-container">
        <div className="question-popup">
          <div className="font-32 title-flex bold">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clipRule="evenodd" d="M14.4165 9.66146C14.4165 8.78746 15.1258 8.07812 15.9998 8.07812C16.8738 8.07812 17.5832 8.78746 17.5832 9.66146C17.5832 10.5355 16.8738 11.2448 15.9998 11.2448C15.1258 11.2448 14.4165 10.5355 14.4165 9.66146ZM14.4165 14.4115C14.4165 13.5375 15.1258 12.8281 15.9998 12.8281C16.8738 12.8281 17.5832 13.5375 17.5832 14.4115V22.3281C17.5832 23.2021 16.8738 23.9115 15.9998 23.9115C15.1258 23.9115 14.4165 23.2021 14.4165 22.3281V14.4115ZM15.9997 28.6615C9.01559 28.6615 3.33301 22.9789 3.33301 15.9948C3.33301 9.01071 9.01559 3.32812 15.9997 3.32812C22.9838 3.32812 28.6663 9.01071 28.6663 15.9948C28.6663 22.9789 22.9838 28.6615 15.9997 28.6615ZM15.9998 0.164062C7.25509 0.164062 0.166504 7.25265 0.166504 15.9974C0.166504 24.7421 7.25509 31.8307 15.9998 31.8307C24.743 31.8307 31.8332 24.7421 31.8332 15.9974C31.8332 7.25265 24.743 0.164062 15.9998 0.164062Z" fill="white" />
            </svg>
            Other Types of Sixth Form Courses
          </div>
          <div className="font-25">
            About 5,000 students take IB International Baccalaureate in the UK each year (six subjects). About 6,000 take Scottish Highers (four to six subjects). If you’re an IB or Highers student this process may help you identify your strengths, but it won’t give an exact fit.
          </div>
          <div className="green-btn font-25" onClick={() => {
            this.setState({ popup: false });
            this.moveNext();
          }}>GOT IT</div>
        </div>
      </div>
    );
  }

  render() {
    let renderCheckbox = (currentChoice: any, label: string) => {
      return (
        <label className={`check-box-container container ${currentChoice === this.state.choice ? "bold" : ""}`} onClick={() => this.setState({ choice: currentChoice })}>
          {label}
          <span className={`checkmark ${currentChoice === this.state.choice ? "checked" : ""}`}></span>
        </label>
      );
    }

    let renderCheckboxV2 = (currentChoice: any, label: string, click: any) => {
      return (
        <label className="check-box-container container" onClick={click}>
          {label}
          <span className={`checkmark ${currentChoice === this.state.choice ? "checked" : ""}`}></span>
        </label>
      );
    }

    return (
      <div className="question">
        <div className="progress-bar">
          <div className='start active' />
          <div />
          <div />
          <div />
          <div />
          <div className="end" />
        </div>
        <div className="font-16">
          STEP 1: TYPES OF COURSE
        </div>
        <div className="bold font-32 question-text">
          What type of course or courses are you considering for the sixth form?
        </div>
        <div className="boxes-container font-24">
          {renderCheckbox(1, "A-level courses only")}
          {renderCheckbox(2, "All academic courses including A-level and Diploma")}
          {renderCheckbox(3, "Vocational courses only (e.g. BTEC, T-level)")}
          {renderCheckbox(4, "Show me all types of course")}
          {renderCheckboxV2(5, "Are there other types of sixth form courses?*", () => {
            this.setState({ choice: 5, popup: true });
          })}
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
        <button className="absolute-contunue-btn font-25" onClick={this.moveNext.bind(this)}>Continue to Step 2</button>
        {this.state.popup && this.renderPopup()}
      </div>
    );
  }
}

export default FirstQuestion;
