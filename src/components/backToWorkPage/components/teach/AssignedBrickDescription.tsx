import React, { Component } from "react";

import { getFormattedDate } from "components/services/brickService";
import './AssignedBrickDescription.scss';
import sprite from "assets/img/icons-sprite.svg";
import AssignedCircle from './AssignedCircle';
import { TeachClassroom, Assignment } from "model/classroom";
import { Subject } from "model/brick";
import { getSubjectColor } from "components/services/subject";

interface AssignedDescriptionProps {
  subjects: Subject[];
  classroom: TeachClassroom;
  assignment: Assignment;
  index?: number;
  isMobile?: boolean;
  isExpanded?: boolean;
  onClick?(): void;
  move?(): void;
  expand(): void;
}

class AssignedBrickDescription extends Component<AssignedDescriptionProps> {
  renderCircle() {
    let subjectId = this.props.assignment.brick.subjectId;
    let color = getSubjectColor(this.props.subjects, subjectId);

    if (!color) {
      color = "#B0B0AD";
    }
    return (
      <div className="left-brick-circle teach-circle">
        <div className="round-button" style={{ background: color }}>
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#maximize"} />
          </svg>
        </div>
      </div>
    );
  }

  renderPlayButton() {
    return (
      <div className="play-button-link svgOnHover" onClick={() => this.props.move ? this.props.move() : {}}>
        <svg className="svg w100 h100 svg-default">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#play-thin"} className="text-gray" />
        </svg>
        <svg className="svg w100 h100 colored">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#play-thick"} className="text-gray" />
        </svg>
      </div>
    )
  }

  render() {
    let { assignment, isMobile, isExpanded, classroom, index } = this.props;
    const { brick, byStatus } = assignment;
    let className = "assigned-brick-description";

    if (isMobile && isExpanded) {
      className += " mobile-expanded";
    }
    if (index !== undefined && index >= 0) {
      className += " mobile-short-" + index;
    }

    let first = classroom.students.length;
    let second = 0;
    let third = 0;
    if (byStatus) {
      first = byStatus[0] ? byStatus[0].count : 0;
      second = byStatus[1] ? byStatus[1].count : 0;
      third= byStatus[2] ? byStatus[2].count : 0;
    }

    return (
      <div className={className} onClick={() => this.props.onClick ? this.props.onClick() : {}}>
        <div className="total-view-count">
          {classroom.students.length}
          <svg className="svg active">
            <use href={sprite + "#users"} className="text-theme-dark-blue" />
          </svg>
        </div>
        {this.renderCircle()}
        <div style={{ display: 'flex' }}>
          <div className="short-brick-info">
            <div className="link-description">
              <span>{brick.title}</span>
            </div>
            <div className="link-info"><span className="bold">Date Set: </span>{getFormattedDate(assignment.assignedDate)}<span className="bold">Deadline: </span></div>
          </div>
          <AssignedCircle onClick={this.props.expand} total={first} count={4} color="red" />
          <AssignedCircle total={second} count={4} color="yellow" />
          <AssignedCircle total={third} count={4} color="green" />
          <div className="teach-brick-actions-container">
            <div className="stats-button-container">
              <svg className="svg active" style={{ height: '2.1vw', width: '2.1vw' }}>
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#bar-chart-2"} />
              </svg>
            </div>
            <div className="stats-text">Stats</div>
            <div className="archive-button-container">
              <svg className="svg active" style={{ height: '2.1vw', width: '2.1vw' }}>
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#archive"} className="text-gray" />
              </svg>
            </div>
          </div>
        </div>
        {isExpanded ? this.renderPlayButton() : ""}
      </div>
    );
  }
}

export default AssignedBrickDescription;
