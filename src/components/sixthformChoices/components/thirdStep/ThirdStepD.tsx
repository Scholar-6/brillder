import React, { Component } from "react";
import { SixthformSubject } from "services/axios/sixthformChoices";
import CheckBoxV2 from "../CheckBox";
import BackButtonSix from "../BackButtonSix";

export enum ThirdStepDChoice {
  First,
  Second,
  Third,
  Forth
}

export enum ThirdStepDSubStep {
  Start = 1,
  Message,
  TableLeaf,
}

interface ThirdProps {
  subjects: SixthformSubject[];
  answer: any;
  onChange(answer: any): void;
  moveBack(): void;
  moveToStepE(): void;
  moveToStepF(): void;
}

interface ThirdQuestionState {
  choice: ThirdStepDChoice | null;
  subStep: ThirdStepDSubStep;
}

class ThirdStepD extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    this.state = {
      choice: null,
      subStep: ThirdStepDSubStep.Start
    }
  }

  setChoice(choice: ThirdStepDChoice) {
    this.setState({ choice });
    this.props.onChange({
      choice: choice
    });
  }

  render() {
    if (this.state.subStep === ThirdStepDSubStep.TableLeaf) {
      return (
        <div>
        </div>
      );
    } else if (this.state.subStep === ThirdStepDSubStep.Message) {
      return <div>
        <div className="bold font-32 question-text-3">
          T Levels
        </div>
        <div className="font-20 bold text-center text-d3-r23">
          Well, we’ll show you the T-level courses, then we’ll show you other VAPs. If you give some thought to your preferences, you’ll still get closer to an idea of what might suit you in the sixth form.
        </div>
        <div className="button-step-d-r23">
          <div onClick={() => {
            this.setState({ subStep: ThirdStepDSubStep.TableLeaf })
          }}>
            OK then, let’s have a look.
          </div>
        </div>
        <BackButtonSix onClick={() => this.setState({ subStep: ThirdStepDSubStep.Start })} />
      </div>
    }
    return (
      <div>
        <div className="bold font-32 question-text-3">
          T Levels
        </div>
        <div className="font-16">
          A lot of changes are happening within vocational education. For 16-19 year-olds there will be a steady reduction in the availability of BTEC and Diploma courses in Vocational, Applied & Practical subjects (VAPs), and a rapid rolling out of T-levels.
        </div>
        <div className="font-16">
          T-levels focus on the skills required for a particular job. You can only take one. Each T-level requires a time commitment equivalent to 3 A-levels: it’s a fully immersive experience designed to get you ready for the workplace. Doing a T-level therefore requires you to be clear in your own mind that you want to pursue the field you choose as a profession.
        </div>
        <div className="font-16 bold sub-title-e23">
          Which of the following best applies to you?
        </div>
        <div className="boxes-container font-24">
          <CheckBoxV2
            currentChoice={ThirdStepDChoice.First} choice={this.state.choice}
            label="If the right T-level for me is available, I’d be interested." setChoice={choice => this.setChoice(choice)}
          />
          <CheckBoxV2
            currentChoice={ThirdStepDChoice.Second} choice={this.state.choice}
            label="I’d prefer to do a variety of shorter VAP courses if they were available." setChoice={choice => this.setChoice(choice)}
          />
          <CheckBoxV2
            currentChoice={ThirdStepDChoice.Third} choice={this.state.choice}
            label="I’d consider a mix of shorter VAPs and A-levels rather than a T-level." setChoice={choice => this.setChoice(choice)}
          />
          <CheckBoxV2
            currentChoice={ThirdStepDChoice.Forth} choice={this.state.choice}
            label="I’m really not sure what to do yet."
            setChoice={() => this.setState({ choice: ThirdStepDChoice.Forth })}
          />
        </div>
        <BackButtonSix onClick={this.props.moveBack} />
        <button className="absolute-contunue-btn font-24" onClick={() => {
          if (this.state.choice === ThirdStepDChoice.Forth) {
            this.setState({ subStep: ThirdStepDSubStep.Message });
          } else if (this.state.choice === ThirdStepDChoice.First) {
            this.setState({ subStep: ThirdStepDSubStep.TableLeaf });
          } else {
            this.props.moveToStepF();
          }
        }}>Continue</button>
      </div>
    );
  }
}

export default ThirdStepD;
