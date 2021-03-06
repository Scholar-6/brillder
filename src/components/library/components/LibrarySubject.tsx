import React, { Component } from "react";

import { SubjectAssignments } from "../service/model";
import { LibraryAssignmentBrick } from "model/assignment";
import { SubjectAssignment } from "./SubjectAssignment";

interface LibrarySubjectsProps {
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
    return <div key={key}>
      <SubjectAssignment
        userId={this.props.userId}
        subject={this.props.subjectAssignment.subject}
        history={this.props.history} assignment={assignment}
      />
    </div>
  }

  render() {
    const { assignments } = this.props.subjectAssignment;

    return (
      <div className="libary-container">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {assignments.map(this.renderAssignment.bind(this))}
        </div>
      </div>
    );
  }
}

export default LibrarySubjects;
