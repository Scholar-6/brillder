import React, { Component } from "react";

import { Subject } from "model/brick";
import './LibrarySubjects.scss';

import { SubjectAssignments } from "./model";
import { User } from "model/user";
import LibrarySubject from "./LibrarySubject";

interface LibrarySubjectsProps {
  user: User;
  pageSize: number;
  sortedIndex: number;
  subjects: Subject[];
  subjectAssignments: SubjectAssignments[];
  history: any;
}

class LibrarySubjects extends Component<LibrarySubjectsProps> {
  renderSubjectAssignments(item: SubjectAssignments, key: number) {
    return <LibrarySubject subjectAssignment={item} key={key} history={this.props.history} />
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
