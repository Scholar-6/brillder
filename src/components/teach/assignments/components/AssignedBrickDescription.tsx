import React, { Component } from "react";

import './AssignedBrickDescription.scss';
import { AcademicLevelLabels, Subject } from "model/brick";
import { getFormattedDate } from "components/services/brickService";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getTotalStudentsCount } from "../service/service";
import BrickTitle from "components/baseComponents/BrickTitle";
import { fileUrl } from "components/services/uploadFile";
import StudentsTable from "./StudentsTable";
import { TeachListItem } from "./ClassroomList";

interface AssignedDescriptionProps {
  subjects: Subject[];
  classItem: TeachListItem;
}

interface State {
  expanded: boolean | number;
  questionCount: number;
  coverLoaded: boolean;
}

class AssignedBrickDescription extends Component<AssignedDescriptionProps, State> {
  constructor(props: AssignedDescriptionProps) {
    super(props);

    this.state = {
      expanded: true,
      questionCount: 0,
      coverLoaded: false,
    }
  }

  getCompleteStudents() {
    const { byStatus } = this.props.classItem.assignment;
    let studentsCompleted = 0;
    if (byStatus) {
      studentsCompleted = byStatus[2] ? byStatus[2].count : 0;
    }
    return studentsCompleted;
  }

  render() {
    let { assignment, classroom } = this.props.classItem;
    const { brick } = assignment;

    let subjectId = brick.subjectId;
    const subject = this.props.subjects.find(s => s.id === subjectId);

    const completedStudents = this.getCompleteStudents();

    return (
      <div className="assigned-brick-description-v3">
        <div className="assigned-brick-description-v2" style={{ display: 'flex' }}>
          <div>
            <div className="assign-brick-d343">
              <div className="assign-cover-image" onClick={() => {
                if (this.state.expanded === false) {
                  this.setState({ expanded: assignment.id })
                } else {
                  this.setState({ expanded: false })
                }
              }}>
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
              <span className="font-16">{completedStudents}/{getTotalStudentsCount(classroom)}</span>
            </div>
          </div>
        </div>
        {this.state.expanded && classroom && assignment && assignment.byStudent && assignment.byStudent.length > 0
          ? <StudentsTable classItem={this.props.classItem} />
          : this.state.expanded && <div className="assigned-brick-description-no-results font-18">Results will be shown here when students have played the assignment.</div>
        }
      </div>
    );
  }
}

export default AssignedBrickDescription;
