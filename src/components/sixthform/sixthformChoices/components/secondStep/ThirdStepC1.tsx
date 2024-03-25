import React, { Component } from "react";
import { Grid } from "@material-ui/core";

import ProgressBarStep3C1 from "../progressBar/ProgressBarStep3C1";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BackButtonSix from "../BackButtonSix";
import { shuffle } from "../../services/shuffle";

interface ThirdProps {
  pairAnswers: any[];
  onChange(pairAnswers: any[]): void;
  moveBack(): void;
  moveNext(): void
}

interface ThirdQuestionState {
  subjects: any[];
  answers: any[];
  step: number;
}

enum AnswerStatus {
  None,
  Correct,
  Incorrect,
}

class ThirdStepC1 extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subjects = [{
      icon: 'psychology-3c1',
      correctIndex: 0,
      name: "Psychology"
    }, {
      icon: 'sociology-3c1',
      correctIndex: 1,
      name: "Sociology"
    }, {
      icon: 'business-3c1',
      correctIndex: 2,
      name: "Business"
    }, {
      icon: 'economics-3c1',
      correctIndex: 3,
      name: "Economics"
    }, {
      icon: 'politics-3c1',
      correctIndex: 4,
      name: "Politics"
    }];

    subjects = shuffle(subjects);

    let answers = [{
      name: "“the scientific study of the mind and behaviour, including brain function, decision making,<br/> gender differences and child development”"
    }, {
      name: "“the study of how society is organised, including issues such as class,<br/> crime, the family, culture, gender and identity”"
    }, {
      name: "“the study of commercial operations, including financing, resource management, and strategy”"
    }, {
      name: "“the study of the production, consumption and distribution of goods and services”"
    }, {
      name: "“the study of governance, policy, ideology, and power struggles between groups”"
    }];

    if (this.props.pairAnswers && this.props.pairAnswers.length > 0) {
      answers = this.props.pairAnswers;
    }

    this.state = {
      subjects,
      answers,
      step: 0
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
          const { answers } = this.state;
          currentAnswer.subject = subject;
          this.setState({ answers });
          this.props.onChange(answers);
        }}>
          <SpriteIcon name={subject.icon} />
          {subject.name}
          {answerStatus === AnswerStatus.Incorrect && <SpriteIcon className="absolute-svg-3c1" name="bad-answer-3c1" />}
          {answerStatus === AnswerStatus.Correct && <SpriteIcon className="absolute-svg-3c1" name="good-answer-3c1" />}
        </div>
      </Grid>
    );
  }

  render() {
    const currentAnswer = this.state.answers[this.state.step];
    return (
      <div className="question-step-3c1">
        <div className="bold font-32 question-text-3">
          New Subjects
        </div>
        <div className="font-16 color-light-blue">
          Some subjects are rarely studied before the sixth form. See if you understand what they involve.
        </div>
        <ProgressBarStep3C1
          step={this.state.step}
          topLabel="Which subject matches this description?"
          total={this.state.answers.length}
          subjectDescription={currentAnswer.name}
        />
        <Grid container direction="row" className="containers-3c1">
          {this.state.subjects.map(s => this.renderSubjectBox(s, currentAnswer))}
        </Grid>
        <BackButtonSix onClick={() => {
          if (this.state.step <= 0) {
            this.props.moveBack();
          } else {
            this.setState({ step: this.state.step - 1 });
          }
        }} />
        <button className="absolute-contunue-btn font-24" onClick={() => {
          if (this.state.step >= 4) {
            this.props.moveNext();
          } else {
            this.setState({ step: this.state.step + 1 });
          }
        }}>Next</button>
      </div>
    );
  }
}

export default ThirdStepC1;
