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
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";
import { deleteAssignment } from "services/axios/brick";

interface AssignedDescriptionProps {
  subjects: Subject[];
  classItem: TeachListItem;
  dragHidden?: boolean;
}

interface State {
  expanded: boolean | number;
  questionCount: number;
  coverLoaded: boolean;
  hovered: boolean;
  deletingOpen: boolean;
}

class AssignedBrickDescription extends Component<AssignedDescriptionProps, State> {
  constructor(props: AssignedDescriptionProps) {
    super(props);

    this.state = {
      deletingOpen: false,
      expanded: true,
      questionCount: 0,
      hovered: false,
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

  removeAssignment() {
    if (this.props.classItem.assignment) {
      await deleteAssignment(this.props.classItem.assignment.id);
    }
  }

  render() {
    let { assignment, classroom } = this.props.classItem;
    const { brick } = assignment;

    let subjectId = brick.subjectId;
    const subject = this.props.subjects.find(s => s.id === subjectId);

    const completedStudents = this.getCompleteStudents();

    return (
      <div className="assigned-brick-description-v3">
        <div className="assigned-brick-description-v2" onMouseEnter={() => {
          this.setState({ hovered: true });
        }} onMouseLeave={() => {
          this.setState({ hovered: false });
        }} style={{ display: 'flex' }}>
          {!this.props.dragHidden &&
            <SpriteIcon className="absolute-custom-drag-icon" style={{ opacity: this.state.hovered ? 1 : 0 }} name="drag-custom-icon" />
          }
          <div>
            <div className="assign-brick-d343">
              <div className="assign-cover-image" onClick={() => {
                assignment.expanded = !assignment.expanded;
                this.setState({ expanded: !this.state.expanded });
              }}>
                <img alt="" className={this.state.coverLoaded ? ' visible' : 'hidden'} onLoad={() => this.setState({ coverLoaded: true })} src={fileUrl(brick.coverImage)} />
                <div className="expand-button">
                  <div>
                    <span className="font-10 flex-center">{assignment.expanded ? 'Collapse' : 'Expand'}</span>
                    <div className="arrow-btn flex-center">
                      <SpriteIcon name="arrow-down" className={assignment.expanded ? 'rotated' : ''} />
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
          <div>
            <div className="assignment-second-part">
              <div className="users-complete-count">
                <SpriteIcon name="users-big-and-small" className="text-theme-dark-blue" />
                <span className="font-16">{completedStudents}/{getTotalStudentsCount(classroom)}</span>
              </div>
            </div>
            <div className="flex-center">
              <div className="btn btn-orange" onClick={() => }>
                delete
              </div>
            </div>
          </div>
        </div>
        {assignment.expanded && classroom && assignment && assignment.byStudent && assignment.byStudent.length > 0
          ? <StudentsTable classItem={this.props.classItem} />
          : assignment.expanded && <div className="assigned-brick-description-no-results font-18">
            Results will be shown here when students have played the assignment.
          </div>
        }
        {
          this.state.deletingOpen && <BaseDialogWrapper open={this.state.deletingOpen} close={() => this.setState({deletingOpen: false})} submit={this.removeAssignment.bind(this)}>
            <div className="dialog-header">
              <div>Remove assignment?</div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-md bg-theme-orange yes-button" onClick={this.removeAssignment.bind(this)}>
                <span>Yes, remove</span>
              </button>
              <button className="btn btn-md bg-gray no-button" onClick={() => this.setState({deletingOpen: false})}>
                <span>No, keep</span>
              </button>
            </div>
          </BaseDialogWrapper>
        }
      </div>
    );
  }
}

export default AssignedBrickDescription;
