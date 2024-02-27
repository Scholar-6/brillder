import React, { Component } from "react";

import "./SixthformOutcome.scss";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProgressBarSixthformV2 from "../sixthformChoices/components/progressBar/ProgressBarSixthformV2";
import map from "components/map";


interface ProgressProps {
  history: any;
  answers: any[];
  loading: boolean;
}

class ProgressBox extends Component<ProgressProps> {
  moveToStep(step: number) {
    this.props.history.push(map.SixthformChoices + '/' + step);
  }

  renderStepper(lastStep: number) {
    return <ProgressBarSixthformV2 step={lastStep} moveToStep={this.moveToStep.bind(this)} />;
  }

  render() {
    const answers = this.props.answers;

    if (this.props.loading) {
      return (
        <div className="box-box box-second">
          <div className="opacity-04 font-16">SIXTH FORM COURSE SELECTOR:</div>
          <div className="flex-center">
            <SpriteIcon name="f-loader" className="spinning" />
          </div>
        </div>
      );
    }

    if (answers.length > 0) {
      let lastStep = 0;
      for (const answer of answers) {
        if (answer.step > lastStep) {
          lastStep = answer.step;
        }
      }

      if (lastStep === 6) {
        return (
          <div className="box-box box-second">
            <div className="second-box-top-text">
              <div className="opacity-04 font-16">SIXTH FORM COURSE SELECTOR:</div>
              <div className="absolute-result-box">
                <SpriteIcon name="check-green-six" className="absolute-icon" />
                <span className="font-24 bold">100%</span>
              </div>
            </div>
            <div className="completed-progress-bar">
              {this.renderStepper(lastStep)}
            </div>
            {/*
            <div className="survey-btn-container">
              <div className="btn survey-btn font-16" onClick={() => {
                //this.props.history.push()
              }}>View Survey</div>
            </div>*/}
          </div>
        );
      }

      return (
        <div className="box-box box-second">
          <div className="font-16 second-box-top-text">
            <div className="opacity-04">SIXTH FORM COURSE SELECTOR:</div>
            <div className="flex-end">
              <span className="flex-center opacity-04 progress-label">PROGRESS:</span>
              <span className="font-24 percentage-label">50%</span>
            </div>
          </div>
          <div className="uncompleted-progress-bar">
            {this.renderStepper(lastStep)}
          </div>
          <div className="flex-end">
            <div className="survey-button font-20" onClick={() => this.moveToStep(lastStep)}>
              Continue Survey
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="box-box box-second">
          <div className="opacity-04 font-16">SIXTH FORM COURSE SELECTOR:</div>
          <div className="opacity-04 font-15 flex-center not-started-label m-t-2-e3">
            <SpriteIcon name="alert-triangle" />
            NOT STARTED
          </div>
          <div className="flex-center">
            <div className="survey-button font-20" onClick={() => {
              this.props.history.push(map.SixthformChoices);
            }}>
              Take the Survey
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ProgressBox;
