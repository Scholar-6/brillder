import React, { Component } from "react";

import './AssignedCircle.scss';
import sprite from "assets/img/icons-sprite.svg";

interface AssignedCircleProps {
  total: number;
  count: number;
  color: string;
}

class AssignedCircle extends Component<AssignedCircleProps> {
  render() {
    const className = `teach-circle ${this.props.color}`;
    return (
      <div className="teach-circle-flex-container">
      <div className="teach-circle-container">
        <div className="total-view-count-container">
        <div className="total-view-count">
          {this.props.total}
          <svg className="svg active">
            <use href={sprite + "#eye-on"} className="text-theme-dark-blue" />
          </svg>
        </div>
        </div>
        <div className={className}>{this.props.count}</div>
      </div>
      </div>
    );
  }
}

export default AssignedCircle;
