import React, { Component } from "react";

import BackButtonSix from "./BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ThirdProps {
  abAnswer: any;
  onChange(answer: any): void;
  moveBack(answer: any): void;
  moveNext(answer: any): void;
}

interface ThirdQuestionState {
  subjects: any[];
  answers: any[];
}

class FifthStepB extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subjects = [{
      correctIndex: 0,
      name: "Scientific Disciplines",
      subName: "(e.g. medicine or engineering)"
    }, {
      correctIndex: 1,
      name: "Building Trades, Skilled Industry & Manufacturing",
      subName: "(e.g. electrician, automotive maintenance)"
    }, {
      correctIndex: 2,
      name: "Discursive, Managerial and Strategic",
      subName: "(e.g. law, media, advertising, HR, civil service)"
    }, {
      correctIndex: 3,
      name: "Creative, Performative & Craft",
      subName: "(e.g. photography, fashion design)"
    }, {
      correctIndex: 4,
      name: "Commercial Disciplines",
      subName: "(e.g. accountancy, insurance, finance, share trading)"
    }, {
      correctIndex: 5,
      name: "Secondary Teaching and Academia",
      subName: "(secondary school and university posts)"
    }, {
      correctIndex: 6,
      name: "Skilled roles in health, social care, public service",
      subName: "(e.g. nursing, social work, uniformed services)"
    }];

    if (this.props.abAnswer && this.props.abAnswer.length > 0) {
      subjects = this.props.abAnswer;
    }

    let answers = [{
      name: "almost invariably require Maths & Science A levels, usually to a high standard"
    }, {
      name: "require vocational qualifications and, often, apprenticeships"
    }, {
      name: "often follow from prestigious academic degrees well-disposed to A-levels in ‘essay subjects’"
    }, {
      name: "expect training in specific artistic, technical and digital skills (e.g. drawing, dance, CAD )"
    }, {
      name: "strongly favour Maths and well-disposed towards Business, Economics etc."
    }, {
      name: "high proficiency in subject specialisms and post-graduate training or additional degrees"
    }, {
      name: "require vocational training but recruit from a wide range of post-16 and degree courses"
    }];

    this.state = {
      subjects,
      answers
    }
  }

  getAnswer() {
    return this.state.subjects
  }

  render() {
    return (
      <div className="question question-step-5b">
        <img src="/images/choicesTool/FifthStepR14.png" className="third-step-img fifth-step-img-r13"></img>
        <div className="bold font-32 question-text-4">
          Possible Careers for You
        </div>
        <div className="font-16">
          Now select up to two career categories that currently interest you.
        </div>
        <div className="drag-container-r22 drag-container-5a drag-container-5b">
          <div className="title-r22 bold font-16">
            Now check the boxes of up to TWO career categories if they apply to you.
          </div>
          <div className="container-r22">
            <div className="left-part-r22">
              {this.state.subjects.map((subject: any, i: number) => {
                return (
                  <div className={"drag-boxv2-r22 font-13" + (subject.active ? ' active' : '')} key={i} onClick={() => {
                    let activeCount = this.state.subjects.filter(s => s.active === true).length;
                    if (activeCount >= 2 && !subject.active) {
                      // skip
                    } else {
                      subject.active = !subject.active;
                      this.setState({ subjects: this.state.subjects });
                    }
                  }}>
                    <SpriteIcon name={subject.active === true ? 'radio-btn-active' : 'radio-btn-blue'} className="absolute-correct-check" />
                    <div className="bold">{subject.name}</div>
                    <div>{subject.subName}</div>
                  </div>
                );
              })}
            </div>
            <div className="right-part-r22">
              {this.state.answers.map((answer: any, i: number) => {
                let isActive = false;
                this.state.subjects.forEach((subject: any) => {
                  if (subject.active && subject.correctIndex === i) {
                    isActive = true;
                  }
                });
                return (
                  <div className={"answer-item-r22 font-12 " + (isActive ? 'active' : "")} key={i + 1} onClick={() => {
                    let subject = this.state.subjects[i];
                    let subjects = this.state.subjects.filter(s => s.active === true);

                    if (subjects.length < 2 || subject.active === true) {
                      subject.active = !subject.active;
                      this.setState({ subjects: this.state.subjects });
                    }
                  }}>
                    {answer.name}
                  </div>
                );
              })}
            </div>
          </div>
          <BackButtonSix onClick={() => this.props.moveBack(this.getAnswer())} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.moveNext(this.getAnswer());
          }}>Continue</button>
        </div>
      </div>
    );
  }
}

export default FifthStepB;