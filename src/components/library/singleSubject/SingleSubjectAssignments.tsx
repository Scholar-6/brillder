import React, { Component } from "react";

import './SingleSubjectAssignments.scss';
import { SortBy, SubjectAssignments } from "../service/model";
import { LibraryAssignmentBrick } from "model/assignment";
import { BrickLengthEnum } from "model/brick";
import SingleSubjectPagination from "./SingleSubjectPagination";
import SingleSubjectAssignment from "./SingleSubjectAssignment";

interface SingleSubjectProps {
  sortBy: SortBy;
  userId: number;
  history: any;
  subjectAssignment: SubjectAssignments;
}

interface SingleSubjectState {
  page: number;
}


class SingleSubjectAssignments extends Component<SingleSubjectProps, SingleSubjectState> {
  constructor(props: SingleSubjectProps) {
    super(props);

    this.state = {
      page: 0,
    }
  }

  componentDidUpdate(props: SingleSubjectProps) {
    if (this.props.subjectAssignment !== props.subjectAssignment) {
      this.setState({ page: 0 });
    }
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

  getAssignmentWidth(assignment: LibraryAssignmentBrick, assignmentWidth: number, marginWidth: number) {
    let width = marginWidth * 2;
    const { brickLength } = assignment.brick;
    if (brickLength === BrickLengthEnum.S20min) {
      width += assignmentWidth;
    } else if (brickLength === BrickLengthEnum.S40min) {
      width += assignmentWidth * 2;
    } else if (brickLength === BrickLengthEnum.S60min) {
      width += assignmentWidth * 4;
    } else {
      width += assignmentWidth * 2;
    }
    return width;
  }

  next() {
    this.setState({ page: this.state.page + 1 });
  }

  previous() {
    if (this.state.page > 0) {
      this.setState({ page: this.state.page - 1 });
    }
  }

  getPages(assignments: LibraryAssignmentBrick[]) {
    const totalWidth = 68.6;
    const baseMargin = 0.32;
    const baseAssignmentWidth = 2;

    let pages = [];

    let width = baseMargin * 2;
    let nextPage = [];
    for (let assignment of assignments) {
      const assignmentWidth = this.getAssignmentWidth(assignment, baseAssignmentWidth, baseMargin);
      if (width < totalWidth - assignmentWidth) {
        nextPage.push(assignment);
        width += assignmentWidth;
      } else {
        pages.push(nextPage);
        nextPage = [];
        nextPage.push(assignment);
        width = baseMargin * 2;
        width += assignmentWidth;
      }
    }

    pages.push(nextPage);
    return pages;
  }

  renderAssignment(assignment: LibraryAssignmentBrick, key: number) {
    return <div key={key}>
      <SingleSubjectAssignment
        subject={this.props.subjectAssignment.subject}
        history={this.props.history} assignment={assignment}
      />
    </div>
  }

  render() {
    const {sortBy} = this.props;
    let { assignments } = this.props.subjectAssignment;

    if (sortBy == SortBy.Score) {
      assignments = assignments.sort((a, b) => {
        if (a.bestAttemptPercentScore && b.bestAttemptPercentScore && a.bestAttemptPercentScore > b.bestAttemptPercentScore) {
          return -1;
        }
        return 1;
      });
    } else if (sortBy === SortBy.Date) {
      assignments = assignments.sort((a: any, b: any) => {
        if (new Date(a.lastAttemptDate).getTime() > new Date(b.lastAttemptDate).getTime()) {
          return -1;
        }
        return 1;
      });
    } else if (sortBy === SortBy.Level) {
      assignments = assignments.sort((a: any, b: any) => {
        if (a.brick.academicLevel < b.brick.academicLevel) {
          return -1;
        }
        return 1;
      });
    }

    const pages = this.getPages(assignments);

    return (
      <div className="bricks-list-container bricks-container-mobile single-subject-assignments">
        <div className="one-subject">
          <div className="libary-container">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {pages[this.state.page] && pages[this.state.page].map(this.renderAssignment.bind(this))}
            </div>
          </div>
          <SingleSubjectPagination
            length={assignments.length}
            page={this.state.page + 1}
            pages={pages}
            next={this.next.bind(this)}
            previous={this.previous.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default SingleSubjectAssignments;
