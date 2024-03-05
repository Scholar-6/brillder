
import React, { Component } from "react";

import BackButtonSix from "./BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { shuffle } from "../services/shuffle";
import ProgressBarStep3C1 from "./progressBar/ProgressBarStep3C1";
import { Grid } from "@material-ui/core";

interface ThirdProps {
  careers: any;
  onChange(answer: any): void;
  moveBack(answer: any): void;
  moveNext(answer: any): void;
}

enum AnswerStatus {
  None,
  Correct,
  Incorrect,
}

interface ThirdQuestionState {
  step: number;
  answers: any[];
  careers: any[];
}

class FifthStepA extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let answers = [{
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

    let careers = [{
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

    careers = shuffle(careers);

    if (this.props.careers && this.props.careers.length > 0) {
      careers = this.props.careers;
    }

    this.state = {
      step: 0,
      answers,
      careers
    }
  }

  getAnswer() {
    return {
      abSubjects: this.state.careers
    }
  }

  renderSubjectBox(subject: any, currentAnswer: any) {
    let answerStatus = AnswerStatus.None;

    if (currentAnswer.subject) {
      if (currentAnswer.subject.correctIndex === this.state.step && currentAnswer.subject.name === subject.name) {
        answerStatus = AnswerStatus.Correct;
      } else if (currentAnswer.subject.name === subject.name) {
        answerStatus = AnswerStatus.Incorrect;
      }
    }

    return (
      <Grid item xs={6}>
        <div className={`container-3c1 font-16 ${answerStatus === AnswerStatus.Correct ? 'correct' : answerStatus === AnswerStatus.Incorrect ? 'incorrect' : ''}`} onClick={() => {
          const { careers } = this.state;
          currentAnswer.subject = subject;
          this.setState({ careers });
          this.props.onChange(careers);
        }}>
          <SpriteIcon name={subject.icon} />
          <div className="text-center">
            <div className="font-16">{subject.name}</div>
            <div className="font-13">{subject.subName}</div>
          </div>
          {answerStatus === AnswerStatus.Incorrect && <SpriteIcon className="absolute-svg-3c1" name="bad-answer-3c1" />}
          {answerStatus === AnswerStatus.Correct && <SpriteIcon className="absolute-svg-3c1" name="good-answer-3c1" />}
        </div>
        <div className="font-16 help-text-3c1 text-orange">{answerStatus === AnswerStatus.Incorrect ? 'Incorrect, please try again' : ''}</div>
        <div className="font-16 help-text-3c1 text-theme-green">{answerStatus === AnswerStatus.Correct ? 'That’s correct!' : ''}</div>
      </Grid>
    );
  }

  render() {
    console.log(this.state.step);
    const currentAnswer = this.state.careers[this.state.step];
    return (
      <div className="question-step-5a">
        <ProgressBarStep3C1 step={this.state.step} total={this.state.careers.length} subjectDescription={currentAnswer.name} />
        <Grid container direction="row" className="containers-3c1">
          {this.state.answers.map(s => this.renderSubjectBox(s, currentAnswer))}
        </Grid>
        <BackButtonSix onClick={() => {
          if (this.state.step <= 0) {
            this.props.moveBack(this.getAnswer());
          } else {
            this.setState({ step: this.state.step - 1 });
          }
        }} />
        <button className="absolute-contunue-btn font-24" onClick={() => {
          console.log('test', this.state.step, this.state.careers.length - 1);
          if (this.state.step >= this.state.careers.length - 1) {
            this.props.moveNext(this.getAnswer());
          } else {
            this.setState({ step: this.state.step + 1 });
          }
        }}>Continue</button>
      </div>
    );
  }
}

export default FifthStepA;
