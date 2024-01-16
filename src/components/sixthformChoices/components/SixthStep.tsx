import React, { Component } from "react";
import CheckBoxV2 from "./CheckBox";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Grid } from "@material-ui/core";
import BackButtonSix from "./BackButtonSix";

interface FirstQuestionProps {
  answer: any;
  onChoiceChange(answer: any): void;
  moveNext(): void;
  moveBack(): void;
}

export enum SixthSubStep {
  Start,
  sixA,
  sixB,
  second,
  third,
  fourth,
  fifthA,
  fifthB,
  sixth,
  seventh,
  final
}

export enum ReadingChoice {
  first,
  second,
  third,
  fourth,
  fifth
}

export enum FirstChoice {
  ALevel = 1,
  Vocational,
  ShowMeAll,
  Other
}

interface FirstQuestionState {
  choice: FirstChoice | null;
  subStep: SixthSubStep;
}

class SixthStep extends Component<FirstQuestionProps, FirstQuestionState> {
  constructor(props: FirstQuestionProps) {
    super(props);

    let choice = null;

    if (props.answer) {
      choice = props.answer.answer.choice;
    }

    this.state = {
      choice,
      subStep: SixthSubStep.Start,
    }
  }

  setChoice(choice: FirstChoice) {
    this.setState({ choice });
    this.props.onChoiceChange({ choice });
  }

  render() {
    if (this.state.subStep === SixthSubStep.final) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Well done!
            </div>
          </div>
          <div className="font-16">
            You’ve successfully completed the Course Selector Questionnaire.<br /> Kindly check your email for your detailed report and results.
          </div>
          <button className="absolute-contunue-btn font-24" onClick={() => {
            // exit
          }}>Exit</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.seventh) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Dreams, Ambitions and Values
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                Your ideas about the future reflect your priorities, interests
                and what you feel may be possible. Some of the goals below
                may seem exceptional, but none are impossible.
              </div>
            </div>
          </div>
          <div className="font-16">
            Be honest with yourself. Most answers below will be “not really” - they might sound like nice ideas but you have never given them serious thought.<br />
            If a scenario touches something close to you that you find genuinely exciting, put “definitely”.
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.sixth })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({ subStep: SixthSubStep.final });
          }}>Finish Course Selector</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.sixth) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Enthusiasms, Passions and Interests
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                Please be assured that we NEVER give your data to companies which<br />
                might try to sell you stuff. The reason we are asking this is because<br />
                sometimes the things you love doing complement what you might study.
              </div>
            </div>
          </div>
          <div className="font-16">
            Decide how true the following statements are as they apply to you.
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.fifthB })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({ subStep: SixthSubStep.seventh });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.fifthB) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Writing
            </div>
          </div>
          <div className="font-16">
            For each type of writing, say how much of it you do.
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.fifthA })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({ subStep: SixthSubStep.sixth });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.fifthA) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Writing
            </div>
          </div>
          <div className="font-16">
            Which of the following statements best describes your attitude to writing?
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.fourth })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({ subStep: SixthSubStep.fifthB });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.fourth) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Speaking
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                We talk about what we’re interested in, and the way we engage in<br />
                discussion and take opportunities to speak reflects our character.
              </div>
            </div>
          </div>
          <div className="font-16">
            Decide how true the following statements are about the types of conversation you have and the way you use opportunities to speak.
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.third })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({
              subStep: SixthSubStep.fifthA
            });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.third) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Listening
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                The average teemager spends more than two hours per<br />
                day streaming music or podcasts, or listening to radio.
              </div>
            </div>
          </div>
          <div className="font-16">
            How often do you listen to the following?
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.second })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({
              subStep: SixthSubStep.fourth
            });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.second) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Watching TV, Video & Social Media
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                What you choose to watch reflects your interests and, to some<br />
                extent, your capacity to challenge yourself with content which might<br />
                seek to inform or educate as well as simply entertain.
              </div>
            </div>
          </div>
          <div className="font-16">
            There is all sorts of content out there, and all sorts of ways to watch it. How often do you watch the following:
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.sixB })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({
              subStep: SixthSubStep.third
            });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.sixB) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Reading
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                Reading habits can be an indication of what types of subjects you’ll<br />
                enjoy studying. Some very able students don’t read much, but a deep-<br />
                rooted love of reading is a good indicator of academic aptitude.
              </div>
            </div>
          </div>
          <div className="font-16">
            What sort of reading do you enjoy most?	Select up to FOUR
          </div>
          <Grid container direction="row">
            <Grid item xs={6}>
              <div className="boxes-container start font-16">
                <CheckBoxV2
                  currentChoice={ReadingChoice.first} choice={this.state.choice}
                  label="Fiction" setChoice={choice => this.setChoice(choice)}
                />
                <CheckBoxV2
                  currentChoice={ReadingChoice.second} choice={this.state.choice}
                  label="Science & Technology" setChoice={choice => this.setChoice(choice)}
                />
                <CheckBoxV2
                  currentChoice={ReadingChoice.third} choice={this.state.choice}
                  label="Sport & Coaching"
                  setChoice={choice => this.setChoice(choice)}
                />
                <CheckBoxV2
                  currentChoice={ReadingChoice.fourth} choice={this.state.choice}
                  label="Music & Poetry"
                  setChoice={choice => this.setState({ choice })}
                />
                <CheckBoxV2
                  currentChoice={ReadingChoice.fifth} choice={this.state.choice}
                  label="Travel, Geography and Other Cultures"
                  setChoice={choice => this.setState({ choice })}
                />
                <CheckBoxV2
                  currentChoice={ReadingChoice.fifth} choice={this.state.choice}
                  label="Nature & Environment"
                  setChoice={choice => this.setState({ choice })}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="boxes-container end font-16">
                <CheckBoxV2
                  currentChoice={ReadingChoice.first} choice={this.state.choice}
                  label="History" setChoice={choice => this.setChoice(choice)}
                />
                <CheckBoxV2
                  currentChoice={ReadingChoice.second} choice={this.state.choice}
                  label="Biography / Autobiographies" setChoice={choice => this.setChoice(choice)}
                />
                <CheckBoxV2
                  currentChoice={ReadingChoice.third} choice={this.state.choice}
                  label="Art, Design and Architecture"
                  setChoice={choice => this.setChoice(choice)}
                />
                <CheckBoxV2
                  currentChoice={ReadingChoice.fourth} choice={this.state.choice}
                  label="Power, Money, Government & Politics"
                  setChoice={choice => this.setState({ choice })}
                />
                <CheckBoxV2
                  currentChoice={ReadingChoice.fifth} choice={this.state.choice}
                  label="Religion, Philosophy Self Improvement"
                  setChoice={choice => this.setState({ choice })}
                />
                <CheckBoxV2
                  currentChoice={ReadingChoice.fifth} choice={this.state.choice}
                  label="Other"
                  setChoice={choice => this.setState({ choice })}
                />
              </div>
            </Grid>
          </Grid>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.sixA })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({
              subStep: SixthSubStep.second
            });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.sixA) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Reading
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                Reading habits can be an indication of what types of subjects you’ll<br />
                enjoy studying. Some very able students don’t read much, but a deep-<br />
                rooted love of reading is a good indicator of academic aptitude.
              </div>
            </div>
          </div>
          <div className="font-16">
            Which of the following statements best describes your attitude to reading?”
          </div>
          <div className="boxes-container font-16">
            <CheckBoxV2
              currentChoice={ReadingChoice.first} choice={this.state.choice}
              label="I absolutely love reading and devour all sorts of books." setChoice={choice => this.setChoice(choice)}
            />
            <CheckBoxV2
              currentChoice={ReadingChoice.second} choice={this.state.choice}
              label="I do read for pleasure and enjoy books if they interest me." setChoice={choice => this.setChoice(choice)}
            />
            <CheckBoxV2
              currentChoice={ReadingChoice.third} choice={this.state.choice}
              label="I read if I have to - if a book is set at school - and usually don’t mind unless the book is really boring."
              setChoice={choice => this.setChoice(choice)}
            />
            <CheckBoxV2
              currentChoice={ReadingChoice.fourth} choice={this.state.choice}
              label="I get very little pleasure from reading and I don’t enjoy reading for school."
              setChoice={choice => this.setState({ choice })}
            />
            <CheckBoxV2
              currentChoice={ReadingChoice.fifth} choice={this.state.choice}
              label="I hate reading and hardly ever touch a book."
              setChoice={choice => this.setState({ choice })}
            />
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.Start })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({
              subStep: SixthSubStep.sixB
            });
          }}>Continue</button>
        </div>
      );
    }
    return (
      <div className="question">
        <div className="bold font-32 question-text">
          This part is about YOU
        </div>
        <div className="font-16">
          It’s the most fun and, in many ways, the most important part of the process.
        </div>
        <div className="font-16">
          We do not pretend that we can ask a few questions and know all about you just because we use an algorithm and some AI. But taking your interests and how you think and feel about a variety of questions is relevant to the courses you choose. Success in the sixth form certainly comes more easily if your courses fit your character, your strengths and weaknesses and your natural preferences.
        </div>
        <div className="font-16">
          Each of your answers in this final part helps us to evaluate your interests and instincts, the type of intelligence you possess and your character.
        </div>
        <BackButtonSix onClick={this.props.moveBack} />
        <button className="absolute-contunue-btn font-24" onClick={() => {
          this.setState({
            subStep: SixthSubStep.sixA
          });
        }}>Let’s start!</button>
      </div>
    );
  }
}

export default SixthStep;
