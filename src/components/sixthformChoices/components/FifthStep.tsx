import React, { Component } from "react";

import { SixthformSubject } from "services/axios/sixthformChoices";
import BackButtonSix from "./BackButtonSix";
import FifthStepAB from "./FifthStepAB";
import SpriteIcon from "components/baseComponents/SpriteIcon";

enum SubStep {
  sub5ab,
  sub5c,
}

interface FifthProps {
  answer: any;
  saveAnswer(answer: any): void;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
}

interface FifthStepState {
  subStep: SubStep;
  abAnswer: any;
  careers: any[];
}

class FifthStep extends Component<FifthProps, FifthStepState> {
  constructor(props: FifthProps) {
    super(props);

    let subStep = SubStep.sub5ab;

    let abAnswer = null;

    let careers = [{
      jobName: 'Accountant, Auditor',
      advisory: ['Maths'],
      handy: [
        'Economics',
        'Accounting',
        'Statistics'
      ]
    }, {
      jobName: 'Actuary',
      essential: ['Maths'],
      handy: [
        'Statistics',
        'Further Maths',
      ]
    }, {
      jobName: 'Architect',
      advisory: ['Art & Design', 'Maths'],
      handy: ['Engineering', 'Design & Technology']
    }, {
      jobName: 'Banking, Investment & Finance',
      essential: ['Maths'],
      advisory: ['Economics'],
      handy: ['Statistics', 'Business', 'Further Maths']
    }, {
      jobName: 'Biotechnologist',
      essential: ['Biology'],
      advisory: ['Maths', 'Chemistry'],
      handy: ['Further Maths']
    }, {
      jobName: 'Chemical Engineer',
      essential: ['Maths', 'Chemistry'],
      advisory: ['Physics'],
      handy: ['Further Maths']
    }, {
      jobName: 'Dentistry',
      essential: ['Chemistry'],
      advisory: ['Biology', 'Maths'],
      handy: ['Physics']
    }, {
      jobName: 'Engineering',
      essential: ['Maths', 'Physics'],
      advisory: [],
      handy: ['Engineering', 'Design & Technology']
    }, {
      jobName: 'Insurance (Underwriting)',
      essential: [],
      advisory: ['Maths', 'Accounting'],
      handy: ['Statistics']
    }, {
      jobName: 'Materials Scientist',
      essential: ['Statistics', 'Physics', 'Chemistry'],
      advisory: ['Further Maths'],
      handy: []
    }, {
      jobName: 'Medicine',
      essential: ['Biology', 'Chemistry'],
      advisory: ['Maths'],
      handy: ['Physics', 'Further Maths']
    }, {
      jobName: 'Museum Curator',
      essential: [],
      advisory: ['History', 'Art & Design'],
      handy: ['History of Art', 'Ancient History']
    }, {
      jobName: 'Naval Architect',
      essential: ['Maths', 'Physics'],
      advisory: [],
      handy: ['Engineering', 'Design & Technology']
    }, {
      jobName: 'Urban Planner',
      essential: [],
      advisory: ['Maths', 'Geography'],
      handy: ['Economics', 'Politics']
    }, {
      jobName: 'Veterinary Science',
      essential: ['Chemistry'],
      advisory: ['Biology'],
      handy: ['Physics', 'Maths']
    }, {
      jobName: 'Zoologist',
      essential: ['Biology'],
      advisory: ['Chemistry', 'Physics', 'Maths'],
      handy: ['Environmental Science']
    }, {
      jobName: 'None are for me',
      description: 'I could be ruling out, or making very difficult, the above career paths by choosing other A levels, and I’m happy with that.'
    }];

    if (props.answer) {
      const { answer } = props.answer;
      if (answer.abAnswer) {
        abAnswer = answer.abAnswer;
      }
      if (answer.subStep) {
        subStep = answer.subStep;
      }
      if (answer.careers) {
        careers = answer.careers;
      }
    }

    
    this.state = {
      subStep,
      abAnswer,
      careers
    }
  }

  getAnswer() {
    return {
      subStep: this.state.subStep,
      abAnswer: this.state.abAnswer,
      careers: this.state.careers
    }
  }

  render() {
    if (this.state.subStep === SubStep.sub5c) {
      return (
        <div className="question">
          <div className="bold font-32 question-text-4">
            Careers with A-level Expectations
          </div>
          <div className="font-16">
            The following careers favour specific A levels, usually because relevant degree courses require them. Most of you will probably tick the “None are for me” box at the bottom. But be aware of what you might be ruling out.
          </div>
          <div className="drag-container-5c">
            <div className="subjects-table subjects-table-5c">
              <div className="top-row title-r22 bold font-16">
                Check up to THREE careers you are currently interested in.
              </div>
              <div className="table-head bold font-16">
                <div className="checkbox-column" />
                <div className="first-column table-5c-column center-y">Jobs</div>
                <div className="second-column table-5c-column center-column header-label">
                  <div>Essential</div>
                  <div className="hover-area font-14">
                    <SpriteIcon name="help-icon-v4" className="info-icon" />
                    <div className="hover-content">it’s almost impossible to get a degree course offer without these subjects</div>
                    <div className="hover-arrow-bottom" />
                  </div>
                </div>
                <div className="third-column table-5c-column center-column header-label">
                  <div>Advisory</div>
                  <div className="hover-area font-14">
                    <SpriteIcon name="help-icon-v4" className="info-icon" />
                    <div className="hover-content">these subjects reinforce an application with relevant skills</div>
                    <div className="hover-arrow-bottom" />
                  </div>
                </div>
                <div className="fourth-column table-5c-column center-column header-label">
                  <div>Handy</div>
                  <div className="hover-area font-14">
                    <SpriteIcon name="help-icon-v4" className="info-icon" />
                    <div className="hover-content">if you meet the essential and advisory criteria, these are optional suggestions</div>
                    <div className="hover-arrow-bottom" />
                  </div>
                </div>
              </div>
              <div className="table-body-5c">
                {this.state.careers.map((career, i) => {
                  if (career.jobName === 'None are for me') {
                    return (
                      <div key={i} className="table-5c-body-row font-14" onClick={() => {
                        career.active = !career.active;
                        this.setState({ careers: this.state.careers });
                      }}>
                        <div className="checkbox-column flex-center">
                          <SpriteIcon name={career.active === true ? 'radio-btn-active' : 'radio-btn-blue'} className="absolute-correct-check" />
                        </div>
                        <div className="table-5c-column value-column-5c first">
                          {career.jobName}
                        </div>
                        <div className="table-5c-column value-column-5c-big font-12">
                          I could be ruling out, or making very difficult, the above career paths by choosing other A levels, and I’m happy with that. 
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="table-5c-body-row font-14" onClick={() => {
                      career.active = !career.active;
                      this.setState({ careers: this.state.careers });
                    }}>
                      <div className="checkbox-column flex-center">
                        <SpriteIcon name={career.active === true ? 'radio-btn-active' : 'radio-btn-blue'} className="absolute-correct-check" />
                      </div>
                      <div className="table-5c-column value-column-5c border-right first">
                        {career.jobName}
                      </div>
                      <div className="table-5c-column value-column-5c border-right">
                        <div>
                          {career.essential && career.essential.map((subject: any, j: number) => <div key={j}>{subject}</div>)}
                        </div>
                      </div>
                      <div className="table-5c-column value-column-5c border-right">
                        <div>
                          {career.advisory && career.advisory.map((subject: any, j: number) => <div key={j}>{subject}</div>)}
                        </div>
                      </div>
                      <div className="table-5c-column value-column-5c last">
                        <div>
                          {career.handy && career.handy.map((subject: any, j: number) => <div key={j}>{subject}</div>)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub5ab })} />
            <button className="absolute-contunue-btn font-24" onClick={() => {
              this.props.moveNext(this.getAnswer());
            }}>Continue</button>
        </div >
      );
    }

    return (
      <div className="question">
        <div className="bold font-32 question-text-4">
          Categories of Career
        </div>
        <div className="font-16">
          For most careers (and most university degrees), you can study almost any combination of subjects and courses in the sixth form without your choices necessarily preventing you from pursuing them. Indeed, it is also true that most careers do not require a particular university degree.
        </div>
        <div className="font-16">
          But different categories of profession have different expectations and requirements for post-16 education. Some really do require careful choices in the sixth form. In this exercise, match the professional categories (on the left) with sixth form expectations on the right.
        </div>
        <FifthStepAB
          abAnswer={this.state.abAnswer}
          onChange={answer => {
            this.setState({ abAnswer: answer });
          }}
          moveNext={answer => {
            this.props.saveAnswer(answer);
            this.setState({ subStep: SubStep.sub5c, abAnswer: answer });
          }}
          moveBack={abAnswer => {
            let answer = this.getAnswer();
            answer.abAnswer = abAnswer;
            this.props.moveBack(answer);
          }}
        />
      </div>
    );
  }
}

export default FifthStep;
