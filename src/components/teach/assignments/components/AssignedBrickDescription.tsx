import React, { Component } from "react";

import './AssignedBrickDescription.scss';
import { TeachClassroom, Assignment } from "model/classroom";
import { AcademicLevelLabels, Subject } from "model/brick";
import { getFormattedDate } from "components/services/brickService";
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

class AssignedBrickDescription extends Component<AssignedDescriptionProps, State> {
  constructor(props: AssignedDescriptionProps) {
    super(props);

    this.state = {
      expanded: false,
      questionCount: 0,
      coverLoaded: false,
    }
  }

  getCompleteStudents() {
    const { byStatus } = this.props.assignment;
    let studentsCompleted = 0;
    if (byStatus) {
      studentsCompleted = byStatus[2] ? byStatus[2].count : 0;
    }
    return studentsCompleted;
  }

  render() {
    let { assignment } = this.props;
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

export default AssignedBrickDescription;
