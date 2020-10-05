import React, { Component } from "react";

import "./ExpandedAssignment.scss";
import sprite from "assets/img/icons-sprite.svg";
import { Subject } from "model/brick";
import { UserBase } from "model/user";
import { Assignment, StudentStatus, TeachClassroom } from "model/classroom";
import { getSubjectColor } from "components/services/subject";

import AssignedBrickDescription from "./AssignedBrickDescription";
import { ApiAssignemntStats, AssignmentStudent } from "model/stats";
import map from "components/map";
import SpriteIcon from "components/baseComponents/SpriteIcon";

enum SortBy {
  None,
  AvgIncreasing,
  AvgDecreasing,
}

interface AssignemntExpandedState {
  sortBy: SortBy;
  questionCount: number;
}

interface AssignmentBrickProps {
  stats: ApiAssignemntStats;
  subjects: Subject[];
  startIndex: number;
  pageSize: number;
  classroom: TeachClassroom;
  assignment: Assignment;
  history: any;
  minimize(): void;
}

class ExpandedAssignment extends Component<
  AssignmentBrickProps,
  AssignemntExpandedState
> {
  constructor(props: AssignmentBrickProps) {
    super(props);

    let questionCount = 0;
    if (props.stats.byStudent[0]) {
      questionCount = props.stats.byStudent[0].attempts[0].answers.length;
    }

    this.state = {
      sortBy: SortBy.None,
      questionCount: questionCount,
    };
  }

  renderAvgScore(studentStatus: StudentStatus) {
    let subjectId = this.props.assignment.brick.subjectId;
    let color = getSubjectColor(this.props.subjects, subjectId);

    if (!color) {
      color = "#B0B0AD";
    }

    return (
      <div className="circle" style={{ background: color }}>
        {Math.round(studentStatus.avgScore)}
      </div>
    );
  }

  renderStatus(studentStatus: StudentStatus | undefined) {
    if (studentStatus) {
      return this.renderAvgScore(studentStatus);
    }
    return <SpriteIcon name="reminder" className="active reminder-icon" />;
  }

  renderCommentIcon() {
    return <SpriteIcon name="message-square" className="active comment-icon" />;
  }

  renderBookIcon(studentId: number) {
    const {history, assignment} = this.props;
    return (
      <SpriteIcon
        name="book-open"
        className="active book-open-icon"
        onClick={() => history.push(map.postPlay(assignment.brick.id, studentId))}
      />
    );
  }

  renderQuestionAttemptIcon(
    studentResult: AssignmentStudent | undefined,
    studentStatus: StudentStatus | undefined,
    questionNumber: number
  ) {
    if (studentResult && studentStatus) {
      const attempt = studentResult.attempts[0].answers[questionNumber];
      console.log(attempt);
      if (attempt.correct === true) {
        return <SpriteIcon name="check-icon-thin" className="text-theme-green" />;
      }
      if (attempt.marks < 3) {
        return <SpriteIcon name="cancel" className="text-theme-orange stroke-2" />;
      }
      if (attempt.marks >= attempt.maxMarks) {
        return <SpriteIcon name="check-icon-thin" className="text-theme-green" />;
      }
      if (attempt.marks < 5) {
        return <SpriteIcon name="cancel" className="text-yellow" />;
      }
      return <SpriteIcon name="check-icon-thin" className="text-yellow" />;
    }
    return "";
  }

  renderStudent(student: UserBase, i: number) {
    console.log(this.props.stats.byStudent);
    let studentResult = this.props.stats.byStudent.find(
      (s) => s.studentId === student.id
    );
    const studentStatus = this.props.assignment.studentStatus.find(
      (s) => s.studentId === student.id
    );

    return (
      <tr className="user-row" key={i}>
        <td className="padding-left-column"></td>
        <td className="student-status">
          <div>{this.renderStatus(studentStatus)}</div>
        </td>
        <td className="student-book">
          {studentStatus && <div className="centered">{this.renderBookIcon(student.id)}</div>}
        </td>
        <td className={`assigned-student-name`}>
          {student.firstName} {student.lastName}
        </td>
        {Array.from(new Array(this.state.questionCount), (x, i) => i).map(
          (a, i) =>
            <td key={i} className="icon-container">
              <div className="centered">
                {this.renderQuestionAttemptIcon(studentResult, studentStatus, i)}
              </div>
            </td>
        )}
        <td>
          {studentStatus && <div className="centered">{this.renderCommentIcon()}</div>}
        </td>
      </tr>
    );
  }

  renderTableHead() {
    return (
      <thead>
        <tr>
          <th></th>
          <th>
            <div className="center">
              <button
                className="btn btn-transparent svgOnHover btn-grey-circle"
                onClick={() => this.setState({ sortBy: SortBy.AvgDecreasing })}
              >
                <SpriteIcon name="arrow-down" className="active text-theme-dark-blue" />
              </button>
            </div>
          </th>
          <th>
            <div className="center">
              <button className="btn btn-transparent svgOnHover btn-grey-circle">
                <SpriteIcon name="arrow-right" className="active text-theme-dark-blue" />
              </button>
            </div>
          </th>
          <th></th>
          {Array.from(new Array(this.state.questionCount), (x, i) => i).map(
            (a, i) => <th key={i}><div className="centered">{i + 1}</div></th>
          )}
          <th></th>
        </tr>
      </thead>
    );
  }

  render() {
    const { assignment, classroom, startIndex, pageSize } = this.props;
    let { students } = classroom;
    students = students.slice(startIndex, startIndex + pageSize);
    if (this.state.sortBy !== SortBy.None) {
    }
    return (
      <div className="expanded-assignment classroom-list">
        <div className="classroom-title first">{classroom.name}</div>
        <div>
          <AssignedBrickDescription
            isExpanded={true}
            subjects={this.props.subjects}
            minimize={this.props.minimize}
            classroom={classroom}
            assignment={assignment}
          />
        </div>
        <div className="users-table">
          <table cellSpacing="0" cellPadding="0">
            {this.renderTableHead()}
            <tbody>{students.map(this.renderStudent.bind(this))}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ExpandedAssignment;
