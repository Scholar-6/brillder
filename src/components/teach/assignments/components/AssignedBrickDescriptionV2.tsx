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
import StudentsTable from "./StudentsTable";

interface AssignedDescriptionProps {
  subjects: Subject[];
  classroom?: TeachClassroom;
  assignment: Assignment;
}

interface State {
  expanded: boolean;
  questionCount: number;
  coverLoaded: boolean;
}

class AssignedBrickDescriptionV2 extends Component<AssignedDescriptionProps, State> {
  constructor(props: AssignedDescriptionProps) {
    super(props);

    this.state = {
      expanded: false,
      questionCount: 0,
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

  renderQuestionAttemptIcon(studentResult: any, questionNumber: number) {
    if (studentResult) {
      try {
        const attempt = studentResult.attempts[0].answers[questionNumber];
        const liveAttempt = studentResult.attempts[0].liveAnswers[questionNumber];

        // yellow tick
        if (attempt.correct === true && liveAttempt.correct === false) {
          return <SpriteIcon name="check-icon" className="text-yellow" />;
        } else if (attempt.correct === false && liveAttempt.correct === true) {
          return <SpriteIcon name="check-icon" className="text-yellow" />;
        }

        if (attempt.correct === true && liveAttempt.correct === true) {
          return <SpriteIcon name="check-icon" className="text-theme-green" />;
        }

        return <SpriteIcon name="cancel" className="text-theme-orange smaller stroke-2" />;
      } catch {
        console.log('can`t parse attempt');
      }
    }
    return "";
  }

  render() {
    let subjectId = this.props.assignment.brick.subjectId;
    let color = getSubjectColor(this.props.subjects, subjectId);
    const subject = this.props.subjects.find(s => s.id === subjectId);

    if (!color) {
      color = "#B0B0AD";
    }

    let { assignment } = this.props;
    const { brick } = assignment;
    
    const completedStudents = this.getCompleteStudents();

    return (
      <div className="assigned-brick-description-v3">
        <div className="assigned-brick-description-v2" style={{ display: 'flex' }}>
          <div>
            <div className="assign-brick-d343">
              <div className="assign-cover-image" onClick={() => {
                if (completedStudents > 0) {
                  this.setState({ expanded: !this.state.expanded })
                }
              }}>
                <img alt="" className={this.state.coverLoaded ? ' visible' : 'hidden'} onLoad={() => this.setState({ coverLoaded: true })} src={fileUrl(brick.coverImage)} />
                {completedStudents > 0 &&
                  <div className="expand-button">
                    <div>
                      <span className="font-10 flex-center">{this.state.expanded ? 'Collapse' : 'Expand'}</span>
                      <div className="arrow-btn flex-center">
                        <SpriteIcon name="arrow-down" className={this.state.expanded ? 'rotated' : ''} />
                      </div>
                    </div>
                  </div>
                }
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
              <span>{completedStudents}/{getTotalStudentsCount(this.props.classroom)}</span>
            </div>
          </div>
        </div>
        {this.state.expanded && this.props.classroom && <StudentsTable classroom={this.props.classroom} assignment={this.props.assignment} />}
      </div>
    );
  }
}

export default AssignedBrickDescriptionV2;
