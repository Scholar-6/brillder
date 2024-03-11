import React, { Component } from "react";

import ReadingV1, { ReadingChoice } from "./ReadingV1";
import ReadingV2, { ReadingChoiceV2 } from "./ReadingV2";
import StepTypeCourse from "./StepTypeCourse";
import StepCourseSelect, { FirstChoice } from "./StepCourseSelect";


enum SubStep {
  Intro,
  CourseSelect,
  Reading,
  ReadingV2
}


interface SecondQuestionProps {
  answer: any;
  saveAnswer(answer: any): void;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
}

interface SecondQuestionState {
  subjectType: FirstChoice;
  subStep: SubStep;
  readingChoice: null | ReadingChoice;
  readingChoicesV2: ReadingChoiceV2[];
}

class SecondQuestion extends Component<SecondQuestionProps, SecondQuestionState> {
  constructor(props: SecondQuestionProps) {
    super(props);

    let subjectType = FirstChoice.ShowMeAll;

    let subStep = SubStep.Intro;

    let readingChoice = null;
    let readingChoicesV2 = [];

    if (props.answer) {
      let answer = props.answer.answer;
      subStep = answer.subStep;
      readingChoice = answer.readingChoice;
      if (answer.readingChoicesV2) {
        readingChoicesV2 = answer.readingChoicesV2;
      }
      subjectType = answer.subjectType;
    }

    this.state = {
      subjectType,
      subStep,

      readingChoice,
      readingChoicesV2
    };
  }

  getAnswer() {
    return {
      subjectType: this.state.subjectType,
      subStep: this.state.subStep,
      readingChoice: this.state.readingChoice,
      readingChoicesV2: this.state.readingChoicesV2
    }
  }

  moveBack() {
    this.props.moveBack(this.getAnswer());
  }

  moveNext() {
    this.props.moveNext(this.getAnswer());
  }

  render() {
    if (this.state.subStep === SubStep.CourseSelect) {
      return <StepCourseSelect
        choice={this.state.subjectType}
        onChoiceChange={(subjectType: FirstChoice) => {
          this.setState({ subjectType });
          const answer = this.getAnswer();
          answer.subjectType = subjectType;
          this.props.saveAnswer(answer);
        }}
        moveNext={() => this.setState({ subStep: SubStep.Reading })}
        moveBack={() => this.setState({ subStep: SubStep.Intro })}
      />
    } else if (this.state.subStep === SubStep.ReadingV2) {
      return (
        <ReadingV2
          readingChoicesV2={this.state.readingChoicesV2}
          onChange={readingChoicesV2 => this.setState({ readingChoicesV2 })}
          moveBack={() => this.setState({ subStep: SubStep.Reading })}
          moveNext={() => this.moveNext()}
        />
      );
    } else if (this.state.subStep === SubStep.Reading) {
      return (
        <ReadingV1
          readingChoice={this.state.readingChoice}
          onChange={readingChoice => this.setState({ readingChoice })}
          moveBack={() => this.setState({ subStep: SubStep.CourseSelect })}
          moveNext={() => {
            if (this.state.readingChoice === ReadingChoice.first || this.state.readingChoice === ReadingChoice.second) {
              this.setState({ subStep: SubStep.ReadingV2 })
            } else {
              this.moveNext();
            }
          }}
        />
      );
    }

    return <StepTypeCourse
      moveBack={() => this.moveBack()}
      moveNext={() => this.setState({ subStep: SubStep.CourseSelect })}
    />
  }
}

export default SecondQuestion;
