import React, { Component } from "react";

import { SixthformSubject } from "services/axios/sixthformChoices";
import BackButtonSix from "./BackButtonSix";
import FifthStepAB from "./FifthStepAB";
import SpriteIcon from "components/baseComponents/SpriteIcon";

enum SubStep {
  sub5ab,
  sub5c,
}

interface ThirdProps {
  firstAnswer: any;
  answer: any;
  subjects: SixthformSubject[];
  moveNext(answer: any): void;
  moveBack(): void;
}

interface ThirdQuestionState {
  subStep: SubStep;
  aPairResults: any[];
  careers: any[];
}

class FifthStep extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let careers = [{
      jobName: 'Accountant, Auditor',
    }, {
      jobName: 'Actuary',
      advisory: ['Maths'],
      handy: [
        'Economics',
        'Accounting',
        'Statistics'
      ]
    }, {
      jobName: 'Architect',
      advisory: ['Art & Design', 'Maths'],
      handy: ['Statistics', 'Business', 'Further Maths']
    }, {
      jobName: 'Banking, Investment & Finance',
      essential: ['Maths'],
      advisory: ['Maths', 'Chemistry'],
      handy: ['Engineering', 'Design & Technology']
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

    this.state = {
      subStep: SubStep.sub5ab,
      aPairResults: [],
      careers
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
          <div className="drag-container-r22 drag-container-5a drag-container-5c">
            <div className="title-r22 bold font-16">
              Check up to THREE careers you are currently interested in.
            </div>
            <div className="subjects-table">
              <div className="table-head bold font-16">
                <div className="first-column center-y">Jobs</div>
                <div className="second-column center-column">
                  <div>Essential</div>
                  <div className="hover-area font-14">
                    <SpriteIcon name="help-icon-v4" className="info-icon" />
                    <div className="hover-content">it’s almost impossible to get a degree course offer without these subjects</div>
                    <div className="hover-arrow-bottom" />
                  </div>
                </div>
                <div className="third-column center-column">
                  <div>Advisory</div>
                  <div className="hover-area font-14">
                    <SpriteIcon name="help-icon-v4" className="info-icon" />
                    <div className="hover-content">these subjects reinforce an application with relevant skills</div>
                    <div className="hover-arrow-bottom" />
                  </div>
                </div>
                <div className="fourth-column center-column">
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
                  return (
                    <div>
                      <SpriteIcon name={career.active === true ? 'radio-btn-active' : 'radio-btn-blue'} className="absolute-correct-check" />
                      {career.jobName}
                    </div>
                  )
                })}
              </div>
            </div>
            <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub5ab })} />
            <button className="absolute-contunue-btn font-24" onClick={() => {
              this.props.moveNext({});
            }}>Continue</button>
          </div>
        </div>
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
          pairAnswers={this.state.aPairResults}
          onChange={(aPairResults: any[]) => {
            this.setState({ aPairResults });
          }}
          moveNext={() => this.setState({ subStep: SubStep.sub5c })}
          moveBack={() => this.props.moveBack()}
        />
      </div>
    );
  }
}

export default FifthStep;
