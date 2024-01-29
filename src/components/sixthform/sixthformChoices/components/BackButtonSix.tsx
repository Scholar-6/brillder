import React, { Component } from "react";

interface ThirdProps {
  onClick(): void;
}

class BackButtonSix extends Component<ThirdProps> {
  render() {
    return (
      <div className="absolute-back-btn" onClick={this.props.onClick}>
        <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-25">Previous</span>
      </div>
    );
  }
}

export default BackButtonSix;
