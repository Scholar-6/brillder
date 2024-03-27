import React, { Component } from "react";

import { SixthformSubject } from "services/axios/sixthformChoices";
import ThirdStepC1 from "./ThirdStepC1";
import ThirdStepC2 from "./ThirdStepC2";
import ThirdStepC3, { ThirdC3Category } from "./ThirdStepC3";
import ThirdStepC4 from "./ThirdStepC4";
import ThirdStepD, { ThirdStepDChoice } from "./ThirdStepD";
import ThirdStepE from "./ThirdStepE";
import ThirdStepF from "./ThirdStepF";
import SecondStepWelcome from "./SecondStepWelcome";


export enum ThirdSubStep {
  Welcome = 1,
  First,
  Second,
  Third,
  Fourth,
  Fifth,
  Sixth,
  Seventh,
  Eight,
  Ninth,
  Tenth
}

interface ThirdProps {
  firstAnswer: any;
  answer: any;
  subjects: SixthformSubject[];
  saveAnswer(answer: any): void;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
}

interface ThirdQuestionState {
  subStep: ThirdSubStep;

  firstPairResults: any[];
  secondPairResults: any[];
  categoriesC3: ThirdC3Category[] | null;
  categoriesC4: any | null;
  coursesD: any | null;
  ePairResults: any[];
  coursesF: any;
}

class SecondStep extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subStep = ThirdSubStep.Welcome;

    let firstPairResults: any[] = [];
    let secondPairResults: any[] = [];

    let categoriesC3: any = null;
    let categoriesC4: any = null;

    let ePairResults: any[] = [];

    let coursesD: any = null;
    let coursesF: any = null;

    console.log('answer', this.props.answer);

    if (this.props.answer) {
      const { answer } = props.answer;
      subStep = answer.subStep;

      if (answer.firstPairResults) {
        firstPairResults = answer.firstPairResults;
      }
      if (answer.secondPairResults) {
        secondPairResults = answer.secondPairResults;
      }

      if (answer.categoriesC3) {
        categoriesC3 = answer.categoriesC3;
      }
      if (answer.categoriesC4) {
        categoriesC4 = answer.categoriesC4;
      }

      if (answer.coursesD) {
        coursesD = answer.coursesD;
      }

      if (answer.ePairResults) {
        ePairResults = answer.ePairResults;
      }

      if (answer.coursesF) {
        coursesF = answer.coursesF;
      }
    }

    this.state = {
      subStep,
      firstPairResults,
      secondPairResults,
      ePairResults,
      categoriesC3,
      categoriesC4,
      coursesD,
      coursesF,
    }
  }

  getAnswer() {
    return {
      subStep: this.state.subStep,
      firstPairResults: this.state.firstPairResults,
      secondPairResults: this.state.secondPairResults,
      categoriesC3: this.state.categoriesC3,
      categoriesC4: this.state.categoriesC4,
      coursesD: this.state.coursesD,
      ePairResults: this.state.ePairResults,
      coursesF: this.state.coursesF,
    };
  }

  moveNext() {
    this.props.moveNext(this.getAnswer());
  }

  render() {
    if (this.state.subStep === ThirdSubStep.Seventh) {
      return (
        <div className="question question-3d">
          <ThirdStepD
            subjects={this.props.subjects}
            answer={this.state.coursesD}
            onChange={coursesD => this.setState({ coursesD })}
            saveAnswer={coursesD => {
              this.setState({ coursesD });
              let answer = this.getAnswer();
              answer.coursesD = coursesD;
              console.log(answer);
              this.props.saveAnswer(answer);
            }}
            moveBack={coursesD => {
              let choice = this.props.firstAnswer.answer.subjectType;
              /*
              if (choice === FirstChoice.ShowMeAll) {
                this.setState({ subStep: ThirdSubStep.ThirdC4, coursesD });
              } else {
                this.setState({ subStep: ThirdSubStep.Second, coursesD });
              }*/
              this.setState({subStep: ThirdSubStep.Sixth});
            }}
            moveNext={() => {
              let answer = this.getAnswer();
              this.props.saveAnswer(answer);
              this.props.moveNext(answer);
            }}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.Sixth) {
      return (
        <div className="question question-3d">
          <ThirdStepF
            subjects={this.props.subjects}
            answer={this.state.coursesF}
            moveBack={coursesF => {
              /*
              this.setState({ coursesF });
              if (
                this.state.coursesD &&
                this.state.coursesD.choice && (
                  this.state.coursesD.choice === ThirdStepDChoice.Second ||
                  this.state.coursesD.choice === ThirdStepDChoice.Third)
              ) {
                this.setState({ subStep: ThirdSubStep.ThirdD });
              } else {
                this.setState({ subStep: ThirdSubStep.ThirdE });
              }*/
              let answer = this.getAnswer();
              answer.coursesF = coursesF;
              this.props.saveAnswer(answer);
              this.setState({ subStep: ThirdSubStep.Fifth });
            }}
            moveNext={coursesF => {
              let answer = this.getAnswer();
              answer.coursesF = coursesF;
              this.props.saveAnswer(answer);
              console.log('save answer 555');
              this.setState({ subStep: ThirdSubStep.Seventh });
            }}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.Fifth) {
      return (
        <div className="question">
          <ThirdStepE
            pairAnswers={this.state.ePairResults}
            onChange={(ePairResults: any[]) => {
              this.setState({ ePairResults });
            }}
            moveBack={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.Fourth });

              /*
              if (
                this.props.firstAnswer &&
                this.props.firstAnswer.answer &&
                this.props.firstAnswer.answer.databaseSchool &&
                this.props.firstAnswer.answer.databaseSchool.name === "Hereford Sixth Form College"
              ) {
                this.setState({ subStep: ThirdSubStep.ThirdC4 });
              } else {
                this.setState({ subStep: ThirdSubStep.ThirdD })
              }*/
            }}
            moveNext={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.Sixth });
            }}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.Fourth) {
      return (
        <div className="question question-c3">
          <ThirdStepC3
            answer={this.state.categoriesC3}
            onChange={categoriesC3 => this.setState({ categoriesC3 })}
            moveNext={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.Fifth });

              /*
              if (
                this.props.firstAnswer &&
                this.props.firstAnswer.answer &&
                this.props.firstAnswer.answer.databaseSchool &&
                this.props.firstAnswer.answer.databaseSchool.name === "Hereford Sixth Form College"
              ) {
                this.setState({ subStep: ThirdSubStep.ThirdE });
              } else {
                this.setState({ subStep: ThirdSubStep.ThirdD });
              }*/
            }}
            moveBack={() => {
              this.setState({ subStep: ThirdSubStep.Third });
            }}
          />
        </div>
      );
      
    } else if (this.state.subStep === ThirdSubStep.Third) {
      return (
        <div className="question question-c4">
          <ThirdStepC4
            subjects={this.props.subjects} categoriesC4={this.state.categoriesC4}
            onChange={categoriesC4 => {
              this.setState({ categoriesC4 })
            }}
            moveNext={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.Fourth });

              /*
              if (this.props.firstAnswer.answer.subjectType === FirstChoice.ALevel) {
                this.props.moveNext(this.getAnswer());
              } else {
                if (
                  this.props.firstAnswer &&
                  this.props.firstAnswer.answer &&
                  this.props.firstAnswer.answer.databaseSchool &&
                  this.props.firstAnswer.answer.databaseSchool.name === "Hereford Sixth Form College"
                ) {
                  this.setState({ subStep: ThirdSubStep.ThirdE });
                } else {
                  this.setState({ subStep: ThirdSubStep.ThirdD });
                }
              }*/
            }}
            moveBack={() => this.setState({ subStep: ThirdSubStep.Second })}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.Second) {
      return (
        <div className="question step3question5">
          <img src="/images/choicesTool/ThirdStepR3.png" className="third-step-img"></img>
          <ThirdStepC2
            pairAnswers={this.state.secondPairResults}
            onChange={(secondPairResults: any[]) => {
              this.setState({ secondPairResults });
            }}
            moveBack={() => {
              this.setState({ subStep: ThirdSubStep.First })
            }}
            moveNext={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.Third });
            }}
          />
        </div>
      );
    } else if (this.state.subStep === ThirdSubStep.First) {
      return (
        <div className="question">
          <img src="/images/choicesTool/ThirdStepR3.png" className="third-step-img"></img>
          <ThirdStepC1
            pairAnswers={this.state.firstPairResults}
            onChange={(firstPairResults: any[]) => {
              console.log(firstPairResults);
              this.setState({ firstPairResults });
            }}
            moveBack={() => {
              this.setState({ subStep: ThirdSubStep.Welcome });
            }}
            moveNext={() => {
              this.props.saveAnswer(this.getAnswer());
              this.setState({ subStep: ThirdSubStep.Second });
            }}
          />
        </div>
      );
    }

    return <SecondStepWelcome
      moveNext={() => this.setState({ subStep: ThirdSubStep.First })}
      moveBack={() => this.props.moveBack(this.getAnswer())}
    />
  }
}

export default SecondStep;
