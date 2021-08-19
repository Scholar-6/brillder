import React, { Component } from "react";

import './AssignedBrickDescription.scss';
import { TeachClassroom, Assignment, StudentStatus, StudentAssignmentStatus, TeachStudent } from "model/classroom";
import { Subject } from "model/brick";
import { getFormattedDate } from "components/services/brickService";
import { getSubjectColor } from "components/services/subject";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { archiveAssignment, sendAssignmentReminder, unarchiveAssignment } from "services/axios/brick";
import { getTotalStudentsCount } from "../service/service";
import BrickTitle from "components/baseComponents/BrickTitle";
import ArchiveWarningDialog from "components/baseComponents/dialogs/ArchiveWarningDialog";
import ArchiveButton from "./ArchiveButton";
import ReminderButton from "./ReminderButton";
import UnarchiveButton from "./UnarchiveButton";

interface AssignedDescriptionProps {
  subjects: Subject[];
  classroom?: TeachClassroom;
  assignment: Assignment;
  isExpanded?: boolean;
  isStudent?: boolean;
  isStudentAssignment?: boolean;
  activeStudent?: TeachStudent;
  isArchive?: boolean;
  move?(): void;
  expand?(classroomId: number, assignmentId: number): void;
  minimize?(): void;
  unarchive(): void;
  archive(): void;
  onRemind?(count: number, isDeadlinePassed: boolean): void;
}

interface State {
  warningOpen: boolean;
  archiveHovered: boolean;
}

class AssignedBrickDescription extends Component<AssignedDescriptionProps, State> {
  constructor(props: AssignedDescriptionProps) {
    super(props);

    this.state = {
      warningOpen: false,
      archiveHovered: false,
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
        <div className="brick-relative">
          <div className="brick-middle" style={{ background: color }}>
            <SpriteIcon name="arrow-right" className={isExpanded ? "rotated" : "active"} />
          </div>
          <div className="hover-area" style={{ background: color }} />
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

  renderStatus(assignment: Assignment) {
    const { studentStatus } = assignment;

    // expanded student
    if (this.props.isStudentAssignment) {
      const { activeStudent } = this.props;

      let res: any = null;
      if (activeStudent) {
        res = studentStatus.find(s => s.studentId === activeStudent.id);
      }

      if (res && res.numberOfAttempts > 0) {
        return '';
      }
    }

    let completedCount = 0;

    let everyoneFinished = true;
    if (this.props.classroom) {
      let { length } = this.props.classroom.students;
      completedCount = studentStatus.filter(({ status }) => status === 2).length;
      if (length !== completedCount) {
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
      let className = '';
      if (assignment.deadline && this.isDeadlinePassed(assignment)) {
        className = 'deadline';
      }
      return <ReminderButton className={className} studentCount={studentStatus.length - completedCount} classroom={this.props.classroom} sendNotifications={this.sendNotifications.bind(this)} />
    }
  }

  countNumberOfCompleted(studentStatuses: StudentStatus[]) {
    let completedNumber = 0;

    for (let studentStatus of studentStatuses) {
      if (studentStatus.status === StudentAssignmentStatus.Completed) {
        completedNumber += 1;
      }
    }
    return completedNumber;
  }

  isCompleted() {
    const { assignment } = this.props;
    if (assignment.deadline) {
      const endTime = new Date(assignment.deadline).getTime();
      const nowTime = new Date().getTime();
      if (endTime < nowTime) {
        return true;
      }
    }

    const { studentStatus } = assignment;
    if (this.props.classroom) {
      const { length } = this.props.classroom.students;
      const completedNumber = this.countNumberOfCompleted(studentStatus);
      if (length === completedNumber) {
        return true;
      }
    }
    return false;
  }

  getCompleteStudents() {
    const { byStatus } = this.props.assignment;
    let studentsCompleted = 0;
    if (byStatus) {
      studentsCompleted = byStatus[2] ? byStatus[2].count : 0;
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

  async unarchiveAssignment() {
    const res = await unarchiveAssignment(this.props.assignment.id);
    if (res) {
      this.props.unarchive();
    }
  }

  async archiveAssignment() {
    const res = await archiveAssignment(this.props.assignment.id);
    if (res) {
      this.props.archive();
    }
  }

  checkArchive() {
    const completed = this.isCompleted();
    if (completed) {
      this.archiveAssignment();
    } else {
      this.setState({ warningOpen: true });
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
    const { activeStudent } = this.props;
    const { studentStatus } = this.props.assignment;

    let res: any = null;

    if (activeStudent) {
      res = studentStatus.find(s => s.studentId === activeStudent.id);
    }

    if (!res) {
      return this.renderNoAttempt();
    }

    if (res.numberOfAttempts === 0) {
      return this.renderNoAttempt();
    }

    return (
      <div className="status-text-centered">
        Score: {res.avgScore > 0 && Math.round(res.avgScore)}%
      </div>
    );
  }

  render() {
    const { classroom } = this.props as any;
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
          <div className="link-description">
            <BrickTitle title={brick.title} />
          </div>
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
              <span>{this.getCompleteStudents()}/{getTotalStudentsCount(this.props.classroom)}</span>
              <SpriteIcon name="users" className="text-theme-dark-blue" />
              {classroom && classroom.studentsInvitations && classroom.studentsInvitations.length > 0 && <span style={{ marginLeft: '1vw' }}>{classroom.studentsInvitations.length} Pending</span>}
            </div>}
          <div className="average">
            {this.getAverageScore()}
          </div>
          {this.renderStudentStatus()}
        </div>
        {this.props.isArchive
          ? <UnarchiveButton onClick={this.unarchiveAssignment.bind(this)} />
          : <ArchiveButton isCompleted={this.isCompleted.bind(this)} checkArchive={this.checkArchive.bind(this)} />
        }
        <ArchiveWarningDialog
          isOpen={this.state.warningOpen}
          submit={this.archiveAssignment.bind(this)}
          close={() => this.setState({ warningOpen: false })}
        />
      </div>
    );
  }
}

export default AssignedBrickDescription;
