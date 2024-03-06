import React, { Component } from "react";

import CheckBoxV2 from "../CheckBox";
import BackButtonSix from "../BackButtonSix";
import { FirstChoice } from "../firstStep/FirstStep";
import { Dialog } from "@material-ui/core";

interface FourthAProps {
  choice: FirstChoice;
  moveNext(): void;
  moveBack(): void;
  onChoiceChanged(newChoice: FirstChoice): void;
}

interface FourthAState {
  choice: FirstChoice;
  prevChoice: FirstChoice;
  popupOpen: boolean;
}


class FourthStepA extends Component<FourthAProps, FourthAState> {
  constructor(props: FourthAProps) {
    super(props);

    let previousChoice = props.choice;

    this.state = {
      popupOpen: false,
      prevChoice: previousChoice,
      choice: props.choice
    };
  }

  onChoiceChanged(newChoice: FirstChoice) {
    if (this.state.prevChoice === FirstChoice.ALevel && newChoice === FirstChoice.Vocational) {
      this.setState({ popupOpen: true });
    }
    if (this.state.prevChoice === FirstChoice.Vocational && newChoice === FirstChoice.ALevel) {
      this.setState({ popupOpen: true });
    }
    this.setState({ choice: newChoice });
    this.props.onChoiceChanged(newChoice);
  }

  render() {
    return (
      <div className="question">
        <img src="/images/choicesTool/Step4backgroundR1.png" className="step2background-img" alt="step background" />
        <div className="step-4a-absolute-box">
          <div className="bold font-32 question-text-4">
            Based on your answers, we think you are . . .
          </div>
          <div className="boxes-container font-20">
            <CheckBoxV2
              currentChoice={FirstChoice.ALevel} choice={this.state.choice}
              label="Someone who will go to university after completing A-levels"
              setChoice={() => this.onChoiceChanged(FirstChoice.ALevel)}
            />
            <CheckBoxV2
              currentChoice={FirstChoice.ShowMeAll || FirstChoice.Other}
              choice={this.state.choice}
              label="Someone who may go to university after completing A-levels and/or vocational courses"
              setChoice={() => this.onChoiceChanged(FirstChoice.ShowMeAll)}
            />
            <CheckBoxV2
              currentChoice={FirstChoice.Vocational as any} choice={this.state.choice}
              label="Someone who will go directly into work or an apprenticeship after completing vocational studies"
              setChoice={() => this.onChoiceChanged(FirstChoice.Vocational)}
            />
          </div>
          <div className="font-16 white-blue">If you’ve changed your mind, select the category above that best applies to you.</div>
        </div>
        <BackButtonSix onClick={() => this.props.moveBack()} />
        <button className="absolute-contunue-btn font-24" onClick={this.props.moveNext}>Continue</button>
        {this.state.popupOpen && <Dialog className="new-school-popup" open={true}>
          {this.state.prevChoice === FirstChoice.ALevel && this.state.choice === FirstChoice.Vocational && <div>
            It looks like you’ve changed your mind since Step 1. Best go back to the beginning to make sure that you are more focussed on vocational courses.
          </div>}
          {this.state.prevChoice === FirstChoice.Vocational && this.state.choice === FirstChoice.ALevel && <div>
            It looks like you’ve changed your mind since Step 1. Best go back to the beginning to make sure that you are focussed on subject choices with a view to A-levels.
          </div>}
          <div className="btn" onClick={() => this.setState({ popupOpen: false })}>Continue</div>
        </Dialog>
        }
      </div>
    );
  }
}

export default FourthStepA;
