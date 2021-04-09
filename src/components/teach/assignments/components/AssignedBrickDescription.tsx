import React, { Component } from "react";

import './AssignedBrickDescription.scss';
import { TeachClassroom, Assignment, StudentStatus } from "model/classroom";
import { Subject } from "model/brick";
import { getFormattedDate } from "components/services/brickService";
import { getSubjectColor } from "components/services/subject";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { archiveAssignment, sendAssignmentReminder } from "services/axios/brick";
import { getTotalStudentsCount } from "../service/service";

interface AssignedDescriptionProps {
  subjects: Subject[];
  classroom?: TeachClassroom;
  assignment: Assignment;
  isExpanded?: boolean;
  isStudent?: boolean;
  isStudentAssignment?: boolean;
  isArchive?: boolean;
  move?(): void;
  expand?(classroomId: number, assignmentId: number): void;
  minimize?(): void;
  archive(): void;
  onRemind?(count: number, isDeadlinePassed: boolean): void;
}

interface State {
  archiveHovered: boolean;
}

class AssignedBrickDescription extends Component<AssignedDescriptionProps, State> {
  constructor(props: AssignedDescriptionProps) {
    super(props);

    this.state = {
      archiveHovered: false
    }
  }

  sendNotifications() {
    sendAssignmentReminder(this.props.assignment.id);
    const count = getTotalStudentsCount(this.props.classroom);
    const passed = this.isDeadlinePassed(this.props.assignment);
    this.props.onRemind?.(count, passed);
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

  isDeadlinePassed(assignment: Assignment) {
    if (!assignment.deadline) { return false; }
    const endTime = new Date(assignment.deadline).getTime();
    const nowTime = new Date().getTime();
    if (endTime < nowTime) {
      return true;
    }
    return false;
  }

  renderReminderIcon(className: string) {
    const realClassName = 'reminder-brick-actions-container completed ' + className;
    const isPlural = getTotalStudentsCount(this.props.classroom) > 1 ? true : false;
    return (
      <div className={realClassName}>
        <div className="reminder-button-container" onClick={this.archiveAssignment.bind(this)}>
          <div className="green-hover">
            <div />
          </div>
          <SpriteIcon name="reminder" className="active reminder-icon reminder-icon2" onClick={this.sendNotifications.bind(this)} />
        </div>
        <div className="css-custom-tooltip">
          Send Reminder{isPlural ? 's' : ''}
        </div>
      </div>
    );
  }

  renderStatus(assignment: Assignment) {
    const { studentStatus } = assignment;
    let everyoneFinished = true;
    if (this.props.classroom) {
      let { length } = this.props.classroom.students;
      if (length !== studentStatus.length) {
        everyoneFinished = false;
      }
    } else {
      // if student assignment
      if (!this.isStudentCompleted(studentStatus)) {
        everyoneFinished = false;
      }
    }
    if (everyoneFinished) {
      // everyone has completed the assignment, so the button is disabled.
      return <SpriteIcon name="reminder" className="active reminder-icon reminder-icon2 finished" />;
    } else {
      if (assignment.deadline) {
        if (this.isDeadlinePassed(assignment)) {
          return this.renderReminderIcon("deadline");
        }
      } else {
        return this.renderReminderIcon("");
      }
    }
  }

  isCompleted() {
    const { assignment } = this.props;
    if (assignment.deadline) {
      let endTime = new Date(assignment.deadline).getTime();
      let nowTime = new Date().getTime();
      if (endTime < nowTime) {
        return true;
      }
    }
    const { studentStatus } = assignment;
    if (this.props.classroom) {
      let { length } = this.props.classroom.students;
      if (length !== studentStatus.length) {
        return false;
      }
    } else {
      // if student assignment
      if (!this.isStudentCompleted(studentStatus)) {
        return false;
      }
    }
    return true;
  }

  getCompleteStudents() {
    const { byStatus } = this.props.assignment;
    let studentsCompleted = 0;
    if (byStatus) {
      studentsCompleted = byStatus[1] ? byStatus[1].count : 0;
    }
    return studentsCompleted;
  }

  getAverageScore() {
    const { byStatus } = this.props.assignment;
    let average = '';
    if (byStatus) {
      average = byStatus[1] ? 'Avg: ' + Math.round(byStatus[1].avgScore).toString() : '';
    }
    return average;
  }

  async archiveAssignment() {
    const res = await archiveAssignment(this.props.assignment.id);
    if (res) {
      this.props.archive();
    }
  }

  renderNoAttempt() {
    return (
      <div className="status-text-centered">
        Not yet attempted
      </div>
    );
  }

  isStudentCompleted(studentStatus: StudentStatus[]) {
    return !(!studentStatus || studentStatus.length !== 1 || studentStatus[0].status <= 0)
  }

  renderStudentStatus() {
    if (!this.props.isStudent) { return <div /> }
    const { studentStatus } = this.props.assignment;

    if (!this.isStudentCompleted(studentStatus)) { return this.renderNoAttempt() }

    return (
      <div className="status-text-centered">
        Completed {/*<span className="bold">Final Score: X</span>*/}
      </div>
    );
  }

  render() {
    const {classroom} = this.props as any;
    let subjectId = this.props.assignment.brick.subjectId;
    let color = getSubjectColor(this.props.subjects, subjectId);

    if (!color) {
      color = "#B0B0AD";
    }

    let { assignment } = this.props;
    const { brick } = assignment;
    let className = "assigned-brick-description";

    return (
      <div className={className} style={{ display: 'flex' }}>
        <div className="first-part">
          {this.renderVertical(assignment.id, color)}
        </div>
        <div className="short-brick-info long">
          <div className="link-description q-brick-title" dangerouslySetInnerHTML={{__html: brick.title}} />
          <div className="link-info">
            {brick.brickLength} mins | Assigned: {getFormattedDate(assignment.assignedDate)}
          </div>
          <div className="link-info">
            {assignment.deadline ? <span> Deadline: {getFormattedDate(assignment.deadline)}</span> : ""}
          </div>
        </div>
        <div className="reminder-container">
          {!this.props.isArchive && this.renderStatus(assignment)}
        </div>
        <div className="assignment-second-part">
          {!this.props.isStudentAssignment &&
            <div className="users-complete-count">
              <span>{this.getCompleteStudents()}/{getTotalStudentsCount(classroom)}</span>
              <SpriteIcon name="users" className="text-theme-dark-blue" />
              {classroom && classroom.studentsInvitations && <span style={{marginLeft: '1vw'}}>{classroom.students.length + classroom.studentsInvitations.length} Invited</span>}
            </div>}
          <div className="average">
            {this.getAverageScore()}
          </div>
          {this.renderStudentStatus()}
        </div>
        {!this.props.isArchive &&
          <div className={`teach-brick-actions-container ${this.isCompleted() ? 'completed' : ''}`}>
            <div className="archive-button-container" onClick={this.archiveAssignment.bind(this)}>
              <div className="green-hover">
                <div />
              </div>
              <SpriteIcon name="archive" className="text-gray" />
            </div>
            <div className="css-custom-tooltip">
              Archive brick
          </div>
          </div>}
      </div>
    );
  }
}

export default AssignedBrickDescription;
