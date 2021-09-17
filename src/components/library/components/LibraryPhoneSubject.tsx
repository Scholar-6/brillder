import React, { Component } from "react";

import { SubjectAssignments } from "../service/model";
import { LibraryAssignmentBrick } from "model/assignment";
import SubjectPhoneAssignment from "./SubjectPhoneAssignment";

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
      <SubjectPhoneAssignment
        subject={this.props.subjectAssignment.subject}
        history={this.props.history} assignment={assignment}
      />
    </div>
  }

  findStudent(a: LibraryAssignmentBrick) {
    if (a.brick.assignments && a.brick.assignments.length > 0) {
      const { assignments } = a.brick;
      for (let a2 of assignments) {
        if (a2.student) {
          if (a2.student.id === this.props.userId) {
            return true;
          }
        }
      }
    }
    return false;
  }

  render() {
    let { assignments } = this.props.subjectAssignment;

    assignments.sort(a => {
      if (a.maxScore && a.maxScore >= 0) {
        return -1;
      }
      return 1;
    });

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
