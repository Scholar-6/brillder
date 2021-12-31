import React, { Component } from "react";

import { SubjectAssignments } from "../service/model";
import { LibraryAssignmentBrick } from "model/assignment";
import SubjectAssignment from "./SubjectAssignment";
import { User } from "model/user";

interface LibrarySubjectsProps {
  history: any;
  student: User | null;
  subjectAssignment: SubjectAssignments;

  subjectTitleClick(): void;
}

interface LibrarySubjectState {
  hoveredBrickName: string;
  hovered: boolean;
}

class LibrarySubjects extends Component<LibrarySubjectsProps, LibrarySubjectState> {
  renderAssignment(assignment: LibraryAssignmentBrick, key: number) {
    return <div key={key}>
      <SubjectAssignment
        subject={this.props.subjectAssignment.subject}
        history={this.props.history} assignment={assignment}
        student={this.props.student}
      />
    </div>
  }

  render() {
    let { assignments } = this.props.subjectAssignment;

    return (
      <div className="libary-container">
        <div className="subject-name-v3 bold" onClick={this.props.subjectTitleClick}>
          <div>
            <div>
              <div>{this.props.subjectAssignment.subject.name}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {assignments.map(this.renderAssignment.bind(this))}
        </div>
      </div>
    );
  }
}

export default LibrarySubjects;
