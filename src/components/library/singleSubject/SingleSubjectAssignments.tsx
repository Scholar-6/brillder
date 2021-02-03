import React, { Component } from "react";

import './SingleSubjectAssignments.scss';
import { SubjectAssignments } from "../service/model";
import { LibraryAssignmentBrick } from "model/assignment";
import SubjectAssignment from "../components/SubjectAssignment";
import { BrickLengthEnum } from "model/brick";
import SingleSubjectPagination from "./SingleSubjectPagination";

interface SingleSubjectProps {
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
  renderAssignment(assignment: LibraryAssignmentBrick, key: number) {
    return <div key={key}>
      <SubjectAssignment
        userId={this.props.userId}
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

  getAssignmentWidth(assignment: LibraryAssignmentBrick, assignmentWidth: number, marginWidth: number) {
    let width = marginWidth * 2;
    const { brickLength } = assignment.brick;
    if (brickLength === BrickLengthEnum.S20min) {
      width += assignmentWidth;
    } else if (brickLength === BrickLengthEnum.S40min) {
      width += assignmentWidth * 2;
    } else if (brickLength === BrickLengthEnum.S60min) {
      width += assignmentWidth * 4;
    }
    return width;
  }

  next() {
    this.setState({page: this.state.page + 1});
  }

  previous() {
    if (this.state.page > 0) {
      this.setState({page: this.state.page - 1});
    }
  }

  render() {
    const totalWidth = 68.6;
    const baseMargin = 0.32;
    const baseAssignmentWidth = 1.5;

    let { assignments } = this.props.subjectAssignment;

    assignments.sort(a => {
      if (a.maxScore && a.maxScore >= 0) {
        return -1;
      }
      return 1;
    });

    let pages = [];

    let width = baseMargin * 2;
    let nextPage = [];
    for (let assignment of assignments) {
      const assignmentWidth = this.getAssignmentWidth(assignment, baseAssignmentWidth, baseMargin);
      if (width + assignmentWidth < totalWidth) {
        nextPage.push(assignment);
        width += assignmentWidth;
      } else {
        pages.push(nextPage);
        nextPage = [];
        nextPage.push(assignment);
        width = baseMargin * 2;
      }
    }

    pages.push(nextPage);

    let start = 1;
    let end = 0;
    let i = 0;
    for (let pageContent of pages) {
      if (i < this.state.page) {
        start += pageContent.length;
      }
      if (i <= this.state.page) {
        end += pageContent.length;
      }
      i++;
    }

    return (
      <div className="bricks-list-container bricks-container-mobile">
        <div className="one-subject">
          <div className="libary-container">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {pages[this.state.page] && pages[this.state.page].map(this.renderAssignment.bind(this))}
            </div>
          </div>
          <SingleSubjectPagination
            start={start}
            end={end}
            length={assignments.length}
            page={this.state.page + 1}
            pages={pages.length}
            next={this.next.bind(this)}
            previous={this.previous.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default SingleSubjectAssignments;
