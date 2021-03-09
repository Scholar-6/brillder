import React, { Component } from "react";

import './AssignedBrickDescription.scss';
import sprite from "assets/img/icons-sprite.svg";
import { TeachClassroom, Assignment, StudentStatus } from "model/classroom";
import { Subject } from "model/brick";
import { getFormattedDate } from "components/services/brickService";
import { getSubjectColor } from "components/services/subject";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface AssignedDescriptionProps {
  subjects: Subject[];
  classroom?: TeachClassroom;
  assignment: Assignment;
  isExpanded?: boolean;
  move?(): void;
  expand?(classroomId: number, assignmentId: number): void;
  minimize?(): void;
}

class AssignedBrickDescription extends Component<AssignedDescriptionProps> {

  sendNotifications() {
    //#2888 this should send notifications to students.
  }

  renderVertical(assignmentId: number, color: string) {
    const { isExpanded } = this.props;
    return (
      <div
        className="vertical-brick"
        onClick={() => {
          if (this.props.isExpanded) {
            if (this.props.minimize) {
              return this.props.minimize();
            }
          } else {
            if (this.props.expand) {
              if (this.props.classroom) {
                return this.props.expand(this.props.classroom.id, assignmentId)
              } else {
                this.props.expand(-1, -1);
              }
            }
          }
        }}
      >
        <div>
          <div className="brick-top" style={{ background: color }}></div>
          <div className="brick-top-middle" style={{ background: color }}></div>
          <div className="brick-middle" style={{ background: color }}>
            <SpriteIcon name={isExpanded ? "minimize" : "maximize"} className="active" />
          </div>
          <div className="brick-bottom-middle" style={{ background: color }}></div>
          <div className="brick-bottom" style={{ background: color }}></div>
        </div>
      </div>
    );
  }

  renderStatus(studentStatus: StudentStatus[]) {
    if (this.props.classroom) {
      let { length } = this.props.classroom.students;
      if (length !== studentStatus.length) {
        return <SpriteIcon name="reminder" className="active reminder-icon" onClick={this.sendNotifications.bind(this)} />;
      }
    }
    return <SpriteIcon name="reminder" className="active reminder-icon finished" />;
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
    let studentsCount = 0;
    if (classroom) {
      studentsCount = classroom.students.length;
    }

    let second = 0;
    let average = 0;
    if (byStatus) {
      second = byStatus[1] ? byStatus[1].count : 0;
      average = byStatus[1] ? Math.round(byStatus[1].avgScore) : 0;
    }

    return (
      <div className={className} style={{ display: 'flex' }}>
        <div className="first-part">
          {this.renderVertical(assignment.id, color)}
        </div>
        <div className="short-brick-info long">
          <div className="link-description">
            <span>{brick.title}</span>
          </div>
          <div className="link-info">
            {brick.brickLength} mins | Assigned: {getFormattedDate(assignment.assignedDate)}
          </div>
          <div className="link-info">
            {assignment.deadline ? <span> Deadline: {getFormattedDate(assignment.deadline)}</span> : ""}
          </div>
        </div>
        <div className="reminder-container">
          {this.renderStatus(assignment.studentStatus)}
        </div>
        <div className="assignment-second-part">
          <div className="users-complete-count">
            <span>{second}/{studentsCount}</span>
            <SpriteIcon name="users" className="text-theme-dark-blue" />
          </div>
          <div className="average">
            Avg: {average}
          </div>
        </div>
        <div className="teach-brick-actions-container">
          <div className="archive-button-container">
            <svg className="svg active" style={{ height: '2.1vw', width: '2.1vw' }}>
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#archive"} className="text-gray" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default AssignedBrickDescription;
