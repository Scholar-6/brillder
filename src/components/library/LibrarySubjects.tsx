import React, { Component } from "react";

import { Subject } from "model/brick";
import './LibrarySubjects.scss';

import { SubjectAssignments } from "./model";
import LibrarySubject from "./LibrarySubject";
import { getSubjectWidth } from "./service/css";

interface LibrarySubjectsProps {
  userId: number;
  pageSize: number;
  sortedIndex: number;
  subjects: Subject[];
  subjectAssignments: SubjectAssignments[];
  history: any;
}

interface State {
  page: number;
}

class LibrarySubjects extends Component<LibrarySubjectsProps, State> {
  constructor(props: LibrarySubjectsProps) {
    super(props);

    this.state = {
      page: 0
    };

  }

  componentDidUpdate() {
    //let pages = this.countPages();
  }

  countPages() {
    this.props.subjectAssignments.forEach(s => {
      
    });
  }

  renderSubjectAssignments(item: SubjectAssignments, key: number) {
    const width = getSubjectWidth(item);
    return <LibrarySubject userId={this.props.userId} subjectAssignment={item} width={width} index={key} history={this.props.history} />
  }

  render() {
    const margin = 0.5 * 2;
    const maxWidth = 69.1;

    return (
      <div className="my-library-list">
        {this.props.subjectAssignments.map(this.renderSubjectAssignments.bind(this))}
      </div>
    );
  }
}

export default LibrarySubjects;
