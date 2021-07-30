import React, { Component } from "react";

import "./ExpandedAssignment.scss";
import { Subject } from "model/brick";
import { Assignment, TeachStudent } from "model/classroom";
import { getSubjectColor } from "components/services/subject";

import AssignedBrickDescription from "./AssignedBrickDescription";
import { ApiAssignemntStats } from "model/stats";
import SpriteIcon from "components/baseComponents/SpriteIcon";

enum SortBy {
  None,
  AvgIncreasing,
  AvgDecreasing,
}

interface AssignemntExpandedState {
  sortBy: SortBy;
  questionCount: number;
  student: TeachStudent;
}

interface AssignmentBrickProps {
  stats: ApiAssignemntStats;
  subjects: Subject[];
  student: TeachStudent;
  assignment: Assignment;
  minimize(): void;
}

class ExpandedStudentAssignment extends Component<
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
      student: this.prepareStudent(this.props.student)
    };
  }

  prepareStudent(st: TeachStudent) {
    st.studentResult = this.props.stats.byStudent
      .find(s => s.studentId === st.id);
    return st;
  }

  renderTableHead() {
    const {sortBy} = this.state;
    const name = sortBy === SortBy.AvgIncreasing ? "arrow-up" : "arrow-down";
    
    let className = "btn btn-transparent svgOnHover btn-grey-circle";
    if (sortBy === SortBy.AvgIncreasing || sortBy === SortBy.AvgDecreasing) {
      className += " active";
    }
    return (
      <thead>
        <tr>
          <th></th>
          <th>
            <div className="center">
              <button className={className} onClick={() => {}}>
                <SpriteIcon name={name} className="active text-theme-dark-blue" />
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

  renderAvgScore(studentStatus: any) {
    let subjectId = this.props.assignment.brick.subjectId;
    let color = getSubjectColor(this.props.subjects, subjectId);

    if (!color) {
      color = "#B0B0AD";
    }

    return (
      <div className="circle" style={{ background: color }}>
        {studentStatus.avgScore > 0 ? Math.round(studentStatus.avgScore) : 0}
      </div>
    );
  }

  renderQuestionAttemptIcon(studentResult: any, questionNumber: number) {
    if (studentResult) {
      try {
        const attempt = studentResult.attempts[0].answers[questionNumber];
        const liveAttempt = studentResult.attempts[0].liveAnswers[questionNumber];
  
        // yellow tick
        if (attempt.correct === true && liveAttempt.correct === false) {
          return <SpriteIcon name="check-icon" className="text-yellow" />;
        } else if (attempt.correct === false && liveAttempt.correct === true) {
          return <SpriteIcon name="check-icon" className="text-yellow" />;
        }
  
        if (attempt.correct === true && liveAttempt.correct === true) {
          return <SpriteIcon name="check-icon" className="text-theme-green" />;
        }
  
        return <SpriteIcon name="cancel" className="text-theme-orange smaller stroke-2" />;
      } catch {
        console.log('can`t parse attempt');
      }
    }
    return "";
  }

  renderStatus(studentStatus: any) {
    if (studentStatus) {
      return this.renderAvgScore(studentStatus);
    }
    return <SpriteIcon name="reminder" className="active reminder-icon" />;
  }

  renderStudent(student: TeachStudent) {
    const {studentResult} = student;

    return (
      <tr className="user-row">
        <td className="padding-left-column"></td>
        <td className="student-status">
          <div>{this.renderStatus(studentResult)}</div>
        </td>
        <td className="student-book">
        </td>
        <td className={`assigned-student-name`}>
          {student.firstName} {student.lastName}
        </td>
        {Array.from(new Array(this.state.questionCount), (x, i) => i).map(
          (a, i) =>
            <td key={i} className="icon-container">
              <div className="centered">
                {this.renderQuestionAttemptIcon(studentResult, i)}
              </div>
            </td>
        )}
        <td>
        </td>
      </tr>
    );
  }


  render() {
    return (
      <div className="expanded-assignment classroom-list">
        <div>
          <AssignedBrickDescription
            isStudent={true}
            isExpanded={true}
            subjects={this.props.subjects}
            minimize={this.props.minimize}
            assignment={this.props.assignment}
            archive={() => {}}
            unarchive={() => {}}
          />
        </div>
        <div className="assignments-table">
          <table cellSpacing="0" cellPadding="0">
            {this.renderTableHead()}
            <tbody>{this.renderStudent(this.props.student)}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ExpandedStudentAssignment;
