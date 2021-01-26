import React, { Component } from "react";

import './LibrarySubjects.scss';
import { SubjectAssignments } from "./model";
import { LibraryAssignmentBrick } from "model/assignment";
import { SubjectAssignment } from "./SubjectAssignment";

interface LibrarySubjectsProps {
  index: number;
  width: number;
  userId: number;
  history: any;
  subjectAssignment: SubjectAssignments;
}

interface LibrarySubjectState {
  hoveredBrickName: string;
  hovered: boolean;
}


class LibrarySubjects extends Component<LibrarySubjectsProps, LibrarySubjectState> {
  renderAssignment(assignment: LibraryAssignmentBrick, key: number) {
    return <SubjectAssignment
      userId={this.props.userId}
      subject={this.props.subjectAssignment.subject}
      index={key} history={this.props.history} assignment={assignment}
    />
  }

  render() {
    return (
      <div className="libary-container-1" key={this.props.index} style={{width: this.props.width + 'vw', display: 'inline-flex'}}>
        <div className="libary-container">
          <div style={{display: 'flex', flexDirection: 'row'}}>
            {this.props.subjectAssignment.assignments.map(this.renderAssignment.bind(this))}
          </div>
        </div>
      </div>
    );
  }
}

export default LibrarySubjects;
