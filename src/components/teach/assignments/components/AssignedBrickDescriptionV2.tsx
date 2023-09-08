import React, { Component } from "react";

import './AssignedBrickDescriptionV2.scss';
import { TeachClassroom, Assignment, StudentStatus, StudentAssignmentStatus, TeachStudent, ClassroomStatus } from "model/classroom";
import { AcademicLevelLabels, Subject } from "model/brick";
import { getFormattedDate } from "components/services/brickService";
import { getSubjectColor } from "components/services/subject";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getTotalStudentsCount } from "../service/service";
import BrickTitle from "components/baseComponents/BrickTitle";
import { fileUrl } from "components/services/uploadFile";

interface AssignedDescriptionProps {
  subjects: Subject[];
  classroom?: TeachClassroom;
  assignment: Assignment;
}

interface State {
  expanded: boolean;
  coverLoaded: boolean;
}

class AssignedBrickDescriptionV2 extends Component<AssignedDescriptionProps, State> {
  constructor(props: AssignedDescriptionProps) {
    super(props);

    this.state = {
      expanded: false,
      coverLoaded: false,
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
      /*
      const { length } = this.props.classroom.students;
      const completedNumber = this.countNumberOfCompleted(studentStatus);
      if (length === completedNumber) {
        return true;
      }*/
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

  isStudentCompleted(studentStatus: StudentStatus[]) {
    return !(!studentStatus || studentStatus.length !== 1 || studentStatus[0].status <= 0)
  }

  render() {
    const { classroom } = this.props as any;
    let subjectId = this.props.assignment.brick.subjectId;
    let color = getSubjectColor(this.props.subjects, subjectId);
    const subject = this.props.subjects.find(s => s.id === subjectId);

    if (!color) {
      color = "#B0B0AD";
    }

    let { assignment } = this.props;
    const { brick } = assignment;
    let className = "assigned-brick-description-v2";

    return (
      <div className={className} style={{ display: 'flex' }}>
        <div>
          <div className="assign-brick-d343">
            <div className="assign-cover-image" onClick={() => this.setState({ expanded: !this.state.expanded })}>
              <img alt="" className={this.state.coverLoaded ? ' visible' : 'hidden'} onLoad={() => this.setState({ coverLoaded: true })} src={fileUrl(brick.coverImage)} />
              <div className="expand-button">
                <div>
                  <span className="font-10 flex-center">{this.state.expanded ? 'Collapse' : 'Expand'}</span>
                  <div className="arrow-btn flex-center">
                    <SpriteIcon name="arrow-down" className={this.state.expanded ? 'rotated' : ''} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="short-brick-info long">
          <div className="link-description">
            <BrickTitle title={brick.title} className="font-20" />
          </div>
          <div className="link-info font-16">
            {brick.brickLength} mins | Assigned: {getFormattedDate(assignment.assignedDate)}
          </div>
          <div className="subject font-13">
            {subject?.name}, Level {AcademicLevelLabels[brick.academicLevel]}
          </div>
        </div>
        <div className="assignment-second-part">
          <div className="users-complete-count">
            <SpriteIcon name="users-big-and-small" className="text-theme-dark-blue" />
            <span>{this.getCompleteStudents()}/{getTotalStudentsCount(this.props.classroom)}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default AssignedBrickDescriptionV2;
