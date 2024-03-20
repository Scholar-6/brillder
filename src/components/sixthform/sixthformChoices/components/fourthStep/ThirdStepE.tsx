import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";
import { shuffle } from "../../services/shuffle";
import ProgressBarStep3C1 from "../progressBar/ProgressBarStep3C1";
import BackButtonSix from "../BackButtonSix";
import { Grid } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ThirdProps {
  pairAnswers: any[];
  onChange(pairAnswers: any[]): void;
  moveBack(): void;
  moveNext(): void;
}

interface ThirdQuestionState {
  step: number;
  subjects: any[];
  answers: any[];
}

enum AnswerStatus {
  None,
  Correct,
  Incorrect,
}

class ThirdStepE extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subjects = [{
      correctIndex: 0,
      name: "Criminology"
    }, {
      correctIndex: 1,
      name: "Forensic Science"
    }, {
      correctIndex: 2,
      name: "Production Arts"
    }, {
      correctIndex: 3,
      name: "eSports"
    }, {
      correctIndex: 4,
      name: "Uniformed Services"
    }];
    
    subjects = shuffle(subjects);
    
    let answers = [{
      name: "A multi-disciplinary field which draws on psychology, sociology and statistics to evaluate criminal behaviour and the policing, justice and penal systems"
    }, {
      name: "A comprehensive multi-disciplinary course examining chemical, physical and biological techniques to acquire and analyse evidence relevant to criminal trials"
    }, {
      name: "The skills in making theatre (or film) productions happen, from costume and make-up to lighting and sound, from set design and scheme painting to and creating and managing props"
    }, {
      name: "Gaming is a rapidly growing industry as are the lucrative arenas in which top players now compete. This course develops commercial and marketing and teamwork skills alongside game design and	development"
    }, {
      name: "This course instils qualities of leadership, fitness, teamwork under pressure and a taste for adventure. Students often progress to university or into the armed forces, the police, ambulance or fire service as well as roles in private security and border control"
    }];

    if (this.props.pairAnswers && this.props.pairAnswers.length > 0) {
      answers = this.props.pairAnswers;
    }


    this.state = {
      step: 0,
      subjects,
      answers
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
        <div className="font-16 help-text-3c1 text-orange">{answerStatus === AnswerStatus.Incorrect ? 'Incorrect, please try again' : ''}</div>
        <div className="font-16 help-text-3c1 text-theme-green">{answerStatus === AnswerStatus.Correct ? 'That’s correct!' : ''}</div>
      </Grid>
    );
  }

  render() {
    const currentAnswer = this.state.answers[this.state.step];
    return (
      <div className="question-step-3e">
        <img src="/images/choicesTool/ThirdStepR9Vaps.png" className="third-step-img"></img>
        <div className="bold font-32 question-text-3">
          VAPs
        </div>
        <div className="font-16">
          Here are five VAPs which you may need to understand a little better before selecting subjects.
        </div>
        <div className="font-16">
          Already ruled out all the subjects below? Skip to the next question.
        </div>
        <ProgressBarStep3C1 step={this.state.step} topLabel="" total={this.state.answers.length} subjectDescription={currentAnswer.name} />
        <Grid container direction="row" className="containers-3c1">
          {this.state.subjects.map(s => this.renderSubjectBox(s, currentAnswer))}
        </Grid>
        <BackButtonSix onClick={() => {
          if (this.state.step > 0) {
            this.setState({step: this.state.step - 1});
          } else {
            this.props.moveBack();
          }
        }} />
        <button className="absolute-contunue-btn font-24" onClick={() => {
          if (this.state.step < this.state.answers.length - 1) {
            this.setState({step: this.state.step + 1});
          } else {
            this.props.moveNext();
          }
        }}>Continue</button>
      </div>
    );
  }
}

export default ThirdStepE;
