import React, { Component } from "react";

import './AssignedCircle.scss';
import sprite from "assets/img/icons-sprite.svg";

interface AssignedCircleProps {
}

class AssignedCircle extends Component<AssignedCircleProps> {
  render() {
    return (
      <div className="teach-circle-flex-container">
      <div className="teach-circle-container">
        <div className="total-view-count-container">
        <div className="total-view-count">
          8
          <svg className="svg active">
            <use href={sprite + "#eye-on"} className="text-theme-dark-blue" />
          </svg>
        </div>
        </div>
        <div className="teach-circle">4</div>
      </div>
      </div>
    );
  }
}

export default AssignedCircle;
