import React, { Component } from "react";
import { shuffle } from "../../services/shuffle";
import BackButtonSix from "../BackButtonSix";
import ProgressBarStep3C1 from "../progressBar/ProgressBarStep3C1";
import { Grid } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface ThirdProps {
  pairAnswers: any[];
  onChange(pairAnswers: any[]): void;
  moveBack(): void;
  moveNext(): void;
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

class ThirdStepC2 extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subjects = [{
      icon: 'AncientHistory-3c2',
      correctIndex: 0,
      name: "Ancient History"
    }, {
      icon: "Law-3c2",
      correctIndex: 1,
      name: "Law"
    }, {
      icon: 'FilmStudies-3c2',
      correctIndex: 2,
      name: "Film Studies"
    }, {
      icon: "MediaStudies-3c2",
      correctIndex: 3,
      name: "Media Studies"
    }, {
      icon: "ClassicalCivilisation-3c2",
      correctIndex: 4,
      name: "Classical Civilisation"
    }, {
      icon: "Philosophy-3c2",
      correctIndex: 5,
      name: "Philosophy"
    }, {
      icon: "HistoryofArt-3c2",
      correctIndex: 6,
      name: "History of Art"
    }, {
      icon: "EnvironmentalScience-3c2",
      correctIndex: 7,
      name: "Environmental Science"
    }];

    subjects = shuffle(subjects);

    let answers = [{
      name: "I did History GCSE and considered A-level but I’ve always been drawn to the distant pre-Christian era. I loved studying Roman Britain and visited several sites. It made me interested in archaeology as a degree course."
    }, {
      name: "Although I’d love to be an advocate, I know the A-level doesn’t give you an edge applying for uni or professional training. But legal history and the concepts are so interesting - and the course is more rigorous than the Criminology diploma."
    }, {
      name: "I considered Media Studies but I liked the focus on purely one form and the practical opportunities to shoot and edit my own material. I am a huge fan of directors like Martin Scorsese and Jane Campion."
    }, {
      name: "With digital streaming we’re now constantly immersed in news, video gaming, social media and apps for everything: Media Studies is the most relevant subject to my life and I am really interested in content creation and modern advertising and marketing as careers."
    }, {
      name: "I knew very little Latin and no Greek but all the texts are in translation. I particularly enjoyed the epic literature and the material on the nature of Athenian democracy and the politics of Rome."
    }, {
      name: "I was intrigued by the course - the nature of knowledge, the nature of morality and debates around the existence of God. I did RS at GCSE so some of the ideas were familiar, but I think philosophy offers a broader, more objective approach to the big questions of life."
    }, {
      name: "I enjoy analysing poems in English A-level and looking at a painting closely requires a similar approach. I also did GCSE Art, so I feel it complements both and plays to my creative and essay-writing strengths."
    }, {
      name: "Having done Geography and Combined Science at GCSE, I love the depth and breadth of this course, from physical, chemical and biological processes to political, economic and cultural context. Save the planet!"
    }];

    if (this.props.pairAnswers && this.props.pairAnswers.length === 8) {
      let answer = this.props.pairAnswers[0];
      if (answer.name) {
        answers = this.props.pairAnswers;
      }
    }

    this.state = {
      subjects,
      answers,
      step: 0,
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
      <div className="question-step-3c2">
        <div className="bold font-32 question-text-3">
          New Subjects: Students’ Perspectives
        </div>
        <div className="font-16">
          Here are a few more subjects that are often new to students in the sixth form.
        </div>
        <ProgressBarStep3C1 step={this.state.step} total={this.state.answers.length} subjectDescription={currentAnswer.name} />
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
          if (this.state.step >= 7) {
            this.props.moveNext();
          } else {
            this.setState({ step: this.state.step + 1 });
          }
        }}>Continue</button>
      </div>
    );
  }
}

export default ThirdStepC2;
