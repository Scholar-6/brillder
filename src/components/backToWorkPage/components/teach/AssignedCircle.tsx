import React, { Component } from "react";

import './AssignedCircle.scss';
import sprite from "assets/img/icons-sprite.svg";

interface AssignedCircleProps {
  total: number;
  count?: number;
  color: string;

  onClick?(): void;
}

class AssignedCircle extends Component<AssignedCircleProps> {
  renderCircle() {
    const className = `teach-circle ${this.props.color}`;

    if (this.props.color === 'red') {
      return (
        <div className={className} onClick={this.props.onClick}>
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#maximize"} />
          </svg>
        </div>
      );
    }

    let label = '';
    const { count } = this.props;
    if (count && count > 0) {
      label = count.toString();
    }
    return <div className={className}>{label}</div>;
  }

  render() {
    return (
      <div className="teach-circle-flex-container">
        <div className="teach-circle-container">
          <div className="total-view-count-container">
            <div className="total-view-count">
              {this.props.total}
              <svg className="svg active">
                <use href={sprite + "#users"} className="text-theme-dark-blue" />
              </svg>
            </div>
          </div>
          {this.renderCircle()}
        </div>
      </div>
    );
  }
}

export default AssignedCircle;
