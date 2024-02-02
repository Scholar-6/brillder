import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";

import BackButtonSix from "./BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { shuffle } from "../services/shuffle";

enum SubStep {
  subStepA,
  subStepB
}

interface ThirdProps {
  abAnswer: any;
  onChange(answer: any): void;
  moveBack(answer: any): void;
  moveNext(answer: any): void;
}

interface ThirdQuestionState {
  subStep: SubStep;
  subjects: any[];
  answers: any[];
}

class FifthStepA extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subStep = SubStep.subStepA;

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

    // don`t shuffle for faster showing to clients
    //subjects = shuffle(subjects);
    //console.log(this.props.abAnswer);

    if (this.props.abAnswer) {
      const abAnswer = this.props.abAnswer;
      if (abAnswer.abSubjects) {
        subjects = abAnswer.abSubjects;
      }
      if (abAnswer.subStep) {
        subStep = abAnswer.subStep;
      }
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
      subStep,
      subjects,
      answers
    }
  }

  setSubjects(subjects: any[]) {
    this.setState({ subjects });
  }

  getAnswer() {
    return {
      subStep: this.state.subStep,
      abSubjects: this.state.subjects
    }
  }

  renderNextAButton() {
    let disabled = false;
    let className = 'absolute-contunue-btn font-24';
    if (this.state.subjects.length > 0) {
      const res = this.state.subjects.find((s, i) => {
        return s.correctIndex !== i
      });
      if (res) {
        disabled = true;
        className += ' disabled';
      }
    }

    return (
      <button className={className} onClick={() => {
        this.setState({ subStep: SubStep.subStepB });
      }}>Done matching!</button>
    );
  }

  render() {
    if (this.state.subStep === SubStep.subStepB) {
      return (
        <div className="drag-container-r22 drag-container-5a drag-container-5b">
          <div className="title-r22 bold font-16">
            Now check the boxes of up to TWO career categories if they apply to you.
          </div>
          <div className="container-r22">
            <div className="left-part-r22">
              {this.state.subjects.map((subject: any, i: number) => {
                return (
                  <div className={"drag-boxv2-r22 font-13" + (subject.active ? ' active' : '')} key={i} onClick={() => {
                    let subjects = this.state.subjects.filter(s => s.active === true);
                    if (subjects.length < 10 || subject.active === true) {
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
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.subStepA })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.moveNext(this.getAnswer());
          }}>Continue</button>
        </div>
      );
    }

    let isCorrect = true;
    if (this.state.subjects.length > 0) {
      const res = this.state.subjects.find((s, i) => {
        return s.correctIndex !== i
      });
      if (res) {
        isCorrect = false;
      }
    }

    return (
      <div className="drag-container-r22 drag-container-5a">
        <div className="title-r22 bold font-16">
          Drag to match the categories to their sixth form expectations
        </div>
        <div className={"container-r22 " + (isCorrect ? " correct" : "")}>
          <div className="left-part-r22">
            {isCorrect ? this.state.subjects.map((subject: any, i: number) => {
              return (
                <div className="drag-boxv2-r22 correct font-13" key={i}>
                  <SpriteIcon name="circle-check-six" className="absolute-correct-check" />
                  <div className="bold">{subject.name}</div>
                  <div>{subject.subName}</div>
                </div>
              );
            }) :
              <ReactSortable
                list={this.state.subjects}
                animation={150}
                group={{ name: "cloning-group-name", pull: "clone" }}
                setList={newSubjects => {
                  this.props.onChange(this.getAnswer());
                  this.setState({ subjects: newSubjects });
                }}
              >
                {this.state.subjects.map((subject: any, i: number) => {
                  if (subject.correctIndex === i) {
                    return (
                      <div className="drag-boxv2-r22 correct font-13" key={i}>
                        <div className="bold">{subject.name}</div>
                        <div>{subject.subName}</div>
                      </div>
                    );
                  }
                  return (
                    <div className="drag-boxv2-r22 font-13" key={i}>
                      <div className="bold">{subject.name}</div>
                      <div>{subject.subName}</div>
                    </div>
                  );
                })}
              </ReactSortable>}
          </div>
          <div className="right-part-r22">
            {this.state.answers.map((answer: any, i: number) => {
              return (
                <div className="answer-item-r22 font-12" key={i + 1}>
                  {answer.name}
                </div>
              );
            })}
          </div>
        </div>
        <BackButtonSix onClick={() => this.props.moveBack(this.getAnswer())} />
        {this.renderNextAButton()}
      </div>
    );
  }
}

export default FifthStepA;
