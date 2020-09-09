import React from "react";

// @ts-ignore
import { pulse } from "react-animations";
import styled, { keyframes } from "styled-components";

interface StepProps {
  isPulsing: boolean;
  edited?: boolean;
  number: number;
}

class PulsingCircleNumber extends React.Component<StepProps> {
  isAttempted() {
    if (this.props.edited) return true;
    return false;
  }

  render() {
    const { number } = this.props;
    let indexClassName =
      "question-index-container";
    if (this.isAttempted()) {
      indexClassName += " attempted";
    }
    if (this.props.isPulsing) {
      const pulseAnimation = keyframes`${pulse}`;

      const PulsingDiv = styled.div`
        animation: 0.5s ${pulseAnimation};
      `;


      return (
        <PulsingDiv className={indexClassName}>
          <div className="question-index">{number}</div>
        </PulsingDiv>
      );
    }
    return (
      <div className={indexClassName}>
        <div className="question-index">{number}</div>
      </div>
    );
  }
}

export default PulsingCircleNumber;
