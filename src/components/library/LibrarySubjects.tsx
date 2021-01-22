import React, { Component } from "react";

import { Subject } from "model/brick";
import './LibrarySubjects.scss';

import { SubjectAssignments } from "./model";
import LibrarySubject from "./LibrarySubject";

interface LibrarySubjectsProps {
  userId: number;
  pageSize: number;
  sortedIndex: number;
  subjects: Subject[];
  subjectAssignments: SubjectAssignments[];
  history: any;
}

class LibrarySubjects extends Component<LibrarySubjectsProps> {
  renderSubjectAssignments(item: SubjectAssignments, key: number) {
    return <LibrarySubject userId={this.props.userId} subjectAssignment={item} index={key} history={this.props.history} />
  }

  render() {
    return (
      <div className="my-library-list">
        {this.props.subjectAssignments.map(this.renderSubjectAssignments.bind(this))}
      </div>
    );
  }
}

export default LibrarySubjects;
