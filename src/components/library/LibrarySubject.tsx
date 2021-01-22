import React, { Component } from "react";

import './LibrarySubjects.scss';

import { SubjectAssignments } from "./model";
import { AssignmentBrick } from "model/assignment";
import { SubjectAssignment } from "./SubjectAssignment";

interface LibrarySubjectsProps {
  key: number;
  history: any;
  subjectAssignment: SubjectAssignments;
}

interface LibrarySubjectState {
  hoveredBrickName: string;
  hovered: boolean;
}


class LibrarySubjects extends Component<LibrarySubjectsProps, LibrarySubjectState> {
  renderAssignment(assignment: AssignmentBrick, key: number) {
    return <SubjectAssignment
      subjectName={this.props.subjectAssignment.subject.name}
      key={key} history={this.props.history} assignment={assignment} />
  }

  render() {
    return (
      <div className="libary-container-1" key={this.props.key}>
        <div className="libary-container">
          {this.props.subjectAssignment.assignments.map(this.renderAssignment.bind(this))}
        </div>
      </div>
    );
  }
}

export default LibrarySubjects;
