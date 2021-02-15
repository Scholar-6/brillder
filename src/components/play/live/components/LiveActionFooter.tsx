import React from "react";

import { Question } from "model/question";

import LiveSubmitButton from './LiveSubmitButton';
import LivePrevButton from './LivePrevButton';

interface FooterProps {
  activeStep: number;
  questions: Question[];
  prev(): void;
  next(): void;
  setSubmitAnswers(status: boolean): void;
}

const LiveActionFooter: React.FC<FooterProps> = ({ questions, activeStep, ...props }) => {
  const renderCenterText = () => {
    if (questions.length - 1 > activeStep) {
      return (
        <div className="direction-info text-center">
          <h2 className="text-center">Next</h2>
          <span>Don’t panic, you can<br />always come back</span>
        </div>
      );
    }
    return (
      <div className="direction-info text-center">
        <h2 className="text-center">Submit</h2>
        <span>How do you think it went?</span>
      </div>
    );
  }
  return (
    <div className="action-footer">
      <div>
        <LivePrevButton onClick={props.prev} />
      </div>
      {renderCenterText()}
      <div>
        <LiveSubmitButton
          activeStep={activeStep}
          questions={questions}
          next={props.next}
          setSubmitAnswers={props.setSubmitAnswers}
        />
      </div>
    </div>
  );
};

export default LiveActionFooter;
