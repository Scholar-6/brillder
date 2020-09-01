import React from "react";

// @ts-ignore
import { pulse } from "react-animations";
import styled, { keyframes } from "styled-components";

interface StepProps {
  isPulsing: boolean;
}

class LiveStepCircle extends React.Component<StepProps> {
  render() {
    if (this.props.isPulsing) {
      const pulseAnimation = keyframes`${pulse}`;

      const PulsingDiv = styled.div`
        animation: 0.5s ${pulseAnimation};
      `;

      return (
        <div className="blue-circle-main-container">
        <PulsingDiv className="blue-circle-container">
          <div className="blue-circle"></div>
        </PulsingDiv>
        </div>
      );
    }
    return (
      <div className="blue-circle-main-container">
      <div className="blue-circle-container">
        <div className="blue-circle"></div>
      </div>
      </div>
    );
  }
}

export default LiveStepCircle;
