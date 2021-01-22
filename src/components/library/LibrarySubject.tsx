import React, { Component } from "react";

import './LibrarySubjects.scss';

import { SubjectAssignments } from "./model";
import { AssignmentBrick } from "model/assignment";
import { SubjectAssignment } from "./SubjectAssignment";

interface LibrarySubjectsProps {
  index: number;
  userId: number;
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
      userId={this.props.userId}
      subjectName={this.props.subjectAssignment.subject.name}
      index={key} history={this.props.history} assignment={assignment} />
  }

  render() {
    return (
      <div className="libary-container-1" key={this.props.index}>
        <div className="libary-container">
          {this.props.subjectAssignment.assignments.map(this.renderAssignment.bind(this))}
        </div>
      </div>
    );
  }
}

export default LibrarySubjects;
