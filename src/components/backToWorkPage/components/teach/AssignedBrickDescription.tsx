import React, { Component } from "react";

import './AssignedBrickDescription.scss';
import sprite from "assets/img/icons-sprite.svg";
import { TeachClassroom, Assignment } from "model/classroom";
import { Subject } from "model/brick";
import { getFormattedDate } from "components/services/brickService";
import { getSubjectColor } from "components/services/subject";

interface AssignedDescriptionProps {
  subjects: Subject[];
  classroom: TeachClassroom;
  assignment: Assignment;
  isExpanded?: boolean;
  move?(): void;
  expand?(classroomId: number, assignmentId: number): void;
  minimize?(): void;
}

class AssignedBrickDescription extends Component<AssignedDescriptionProps> {
  renderVertical(assignmentId: number, color: string) {
    return (
      <div
        className="vertical-brick" style={{ background: color }}
        onClick={() => {
          if (this.props.expand) {
            return this.props.expand(this.props.classroom.id, assignmentId)
          }
        }}
      >
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#maximize"} />
        </svg>
      </div>
    );
  }

  renderHorizontal(assignmentId: number, color: string) {
    const {isExpanded} = this.props;
    return (
      <div className="left-brick-circle">
        <div
          className="horizontal-brick" style={{ background: color }}
          onClick={() => {
            if (isExpanded && this.props.minimize) {
              this.props.minimize();
            } else if (this.props.expand) {
              this.props.expand(this.props.classroom.id, assignmentId);
            }
          }}
        >
          <svg className="svg active text-white">
            {/*eslint-disable-next-line*/}
            <use href={sprite + (isExpanded ? "#minimize" : "#maximize")} />
          </svg>
        </div>
      </div>
    );
  }

  render() {
    let subjectId = this.props.assignment.brick.subjectId;
    let color = getSubjectColor(this.props.subjects, subjectId);

    if (!color) {
      color = "#B0B0AD";
    }

    let { assignment, classroom } = this.props;
    const { brick, byStatus } = assignment;
    let className = "assigned-brick-description";

    let second = 0;
    let average = 0;
    if (byStatus) {
      second = byStatus[1] ? byStatus[1].count : 0;
      average = byStatus[1] ? Math.round(byStatus[1].avgScore) : 0;
    }

    return (
      <div className={className}>
        <div className="total-view-count">
          {classroom.students.length}
          <svg className="svg active">
            <use href={sprite + "#users"} className="text-theme-dark-blue" />
          </svg>
        </div>
        {this.renderHorizontal(assignment.id, color)}
        <div style={{ display: 'flex' }}>
          <div className="short-brick-info long">
            <div className="link-description">
              <span>{brick.title}</span>
            </div>
            <div className="link-info">
              {brick.brickLength} mins | Assigned: {getFormattedDate(assignment.assignedDate)} 
            </div>
            <div className="link-info">
              { assignment.deadline ? <span> Deadline: {getFormattedDate(assignment.deadline)}</span> : "" }
            </div>
          </div>
          <div className="assignment-second-part">
            {this.renderVertical(assignment.id, color)}
            <div className="users-complete-count">
              {second}
              <svg className="svg active">
                <use href={sprite + "#users"} className="text-theme-dark-blue" />
              </svg>
            </div>
            <div className="average">
              Avg: {average}
            </div>
          </div>
          <div className="teach-brick-actions-container">
            <div className="stats-button-container">
              <svg className="svg active" style={{ height: '2.1vw', width: '2.1vw' }}>
                {/*eslint-disable-next-line*/}
                <use href={sprite + (this.props.isExpanded ? "#trending-up" : "#bar-chart-2")} />
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
      </div>
    );
  }
}

export default AssignedBrickDescription;
