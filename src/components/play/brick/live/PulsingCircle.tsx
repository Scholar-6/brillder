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
        <PulsingDiv className="blue-circle-container animated pulse duration-1s iteration-2">
          <div className="blue-circle"></div>
        </PulsingDiv>
      );
    }
    return (
      <div className="blue-circle-container animated pulse duration-1s iteration-2">
        <div className="blue-circle"></div>
      </div>
    );
  }
}

export default LiveStepCircle;
