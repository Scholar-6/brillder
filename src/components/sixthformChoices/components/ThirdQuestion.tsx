import React, { Component } from "react";


enum SubjectGroupR21 {
  GCSE = 1,
  PracticalVocational,
}

interface ThirdProps {
  moveNext(): void;
  moveBack(): void;
}

interface ThirdQuestionProps {
  typedSubject: string;
  subjectGroup: SubjectGroupR21;
  GCSESubjects: any[];
  vocationalSubjects: any[];
}

class ThirdQuestion extends Component<ThirdProps, ThirdQuestionProps> {
  constructor(props: ThirdProps) {
    super(props);

    let GCSE = [{
      name: 'Maths',
    }, {
      name: 'English',
    }, {
      name: 'Combined Science (Double Award)'
    }, {
      name: 'Combined Science (Single Award)'
    }, {
      name: 'English Literature'
    }, {
      name: 'Geography'
    }, {
      name: 'History'
    }, {
      name: 'Biology'
    }, {
      name: 'Chemistry'
    }, {
      name: 'Physics'
    }, {
      name: 'Art'
    }, {
      name: 'French'
    }, {
      name: 'Spanish'
    }, {
      name: 'German'
    }, {
      name: 'Mandarin'
    }, {
      name: 'Japanese'
    }, {
      name: 'Italian'
    }, {
      name: 'Religious Studies'
    }, {
      name: 'Design & Technology'
    }, {
      name: 'Drama'
    }, {
      name: 'Communication Studies'
    }, {
      name: 'Computer Studies'
    }, {
      name: 'Sport & Physical Education'
    }, {
      name: 'Statistics'
    }, {
      name: 'Music'
    }];

    let vocational = [{
      name: 'Animal Care',
    }, {
      name: 'Art & Design'
    }, {
      name: 'Automotive & Vehicle'
    }, {
      name: 'Business & Enterprise'
    }, {
      name: 'Catering & Hospitality'
    }, {
      name: 'Child Development & Care'
    }, {
      name: 'Built Environment (Construction)'
    }, {
      name: 'Built Environment (Design)'
    }, {
      name: 'Creative Media'
    }, {
      name: 'Digital & IT'
    }, {
      name: 'Engineering [drop down] - you can select more than one'
    }, {
      name: 'Engineering'
    }, {
      name: 'Engineering (Design)'
    }, {
      name: 'Engineering Technology'
    }, {
      name: 'Event Operations'
    }, {
      name: 'Hair & Beauty'
    }, {
      name: 'Health & Social Care'
    }, {
      name: 'Interactive Media'
    }, {
      name: 'Land Based Studies'
    }, {
      name: 'Music (General)'
    }, {
      name: 'Music (Instrument & Performance)'
    }, {
      name: 'Music (Technology)'
    }, {
      name: 'Music (Theory)'
    }, {
      name: 'Performing Arts'
    }, {
      name: 'Maintenance & Service Engineering'
    }, {
      name: 'Sport, Activity & Fitness'
    }, {
      name: 'Travel & Tourism'
    }]

    this.state = {
      typedSubject: '',
      subjectGroup: SubjectGroupR21.GCSE,
      GCSESubjects: GCSE,
      vocationalSubjects: vocational,
    }
  }

  renderProgressBar() {
    return (
      <div>
        <div className="progress-bar">
          <div className='start active' />
          <div className='active' />
          <div className='active' />
          <div />
          <div />
          <div className="end" />
        </div>
        <div className="font-16">
          STEP 3: SUBJECTS
        </div>
      </div>
    );
  }

  activateSubjectGroup(group: SubjectGroupR21) {
    this.setState({ subjectGroup: group });
  }

  renderSubjectLozenges() {
    let subjects = this.state.GCSESubjects;
    if (this.state.subjectGroup === SubjectGroupR21.PracticalVocational) {
      subjects = this.state.vocationalSubjects;
    }
    return (
      <div className="subjects-lozenges bold">
        {subjects.map((subject, index) => { return (
          <div className="subject-lozenge" key={index}>
            <div className="subject-name">{subject.name}</div>
          </div>
        )})}
      </div>
    );
  }

  render() {
    return (
      <div className="question">
        {this.renderProgressBar()}
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
              <div className="subjects-box-r21">
                {this.renderSubjectLozenges()}
              </div>
              <div className="subjects-typer-r21">
                <input
                  type="text"
                  placeholder={
                    this.state.subjectGroup === SubjectGroupR21.GCSE
                      ? "If you are doing any other, rarer GCSEs, please add them here"
                      : "If you are doing any other, rarer practical and vocational subjects, please add them here"
                  }
                />
              </div>
            </div>
          </div>
          <div className="second-box-R21">
            <div className="bold">Your Subject Selections</div>
          </div>
        </div>
        <div className="absolute-back-btn" onClick={() => {
          this.props.moveBack();
        }}>
          <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-25">Previous</span>
        </div>
        <button className="absolute-contunue-btn font-24" onClick={() => { }}>Continue</button>
      </div>
    );
  }
}

export default ThirdQuestion;
