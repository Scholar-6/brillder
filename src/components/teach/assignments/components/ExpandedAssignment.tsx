import React, { Component } from "react";
import { Grow } from "@material-ui/core";

import "./ExpandedAssignment.scss";
import { Subject } from "model/brick";
import { Assignment, StudentStatus, TeachClassroom, TeachStudent } from "model/classroom";
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
  studentsPrepared: boolean;
  students: TeachStudent[];
  shown: boolean;
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
  onRemind?(count: number, isDeadlinePassed: boolean): void;
}

class ExpandedAssignment extends Component<
  AssignmentBrickProps,
  AssignemntExpandedState
> {
  constructor(props: AssignmentBrickProps) {
    super(props);

    let questionCount = 0;
    if (props.stats.byStudent[0]) {
      try {
        questionCount = props.stats.byStudent[0].attempts[0].answers.length;
      } catch {
        console.log('can`t get number of questions');
      }
    }

    this.state = {
      sortBy: SortBy.None,
      questionCount: questionCount,
      studentsPrepared: false,
      students: this.prepareStudents(),
      shown: false
    };
  }

  componentDidMount() {
    this.setState({ shown: true });
  }

  prepareStudents() {
    const { students } = this.props.classroom;

    students.forEach(student => {
      student.studentResult = this.props.stats.byStudent
        .find(s => s.studentId === student.id);

      student.studentStatus = this.props.assignment.studentStatus
        .find(s => s.studentId === student.id);
    });

    return students;
  }

  toggleSort() {
    if (this.state.sortBy === SortBy.None) {
      this.sort(SortBy.AvgDecreasing);
    } else if (this.state.sortBy === SortBy.AvgDecreasing) {
      this.sort(SortBy.AvgIncreasing);
    } else {
      this.sort(SortBy.AvgDecreasing);
    }
  }

  sort(sortBy: SortBy) {
    let students = this.state.students;
    if (sortBy === SortBy.AvgDecreasing) {
      students = this.state.students.sort((a, b) => {
        if (!a.studentStatus) { return 1; }
        if (!b.studentStatus) { return -1; }
        return b.studentStatus?.avgScore - a.studentStatus?.avgScore;
      });
    } else {
      students = this.state.students.sort((a, b) => {
        if (!a.studentStatus) { return -1; }
        if (!b.studentStatus) { return 1; }
        return a.studentStatus?.avgScore - b.studentStatus?.avgScore;
      });
    }
    this.setState({ students, sortBy });
  }

  renderBestScore(studentStatus: StudentStatus) {
    const subjectId = this.props.assignment.brick.subjectId;
    let color = getSubjectColor(this.props.subjects, subjectId);

    if (!color) {
      color = "#B0B0AD";
    }

    const score = studentStatus.bestScore || studentStatus.avgScore || 0;

    return (
      <div className="circle" style={{ background: color }}>
        {Math.round(score)}
      </div>
    );
  }

  renderStatus(studentStatus: StudentStatus | undefined) {
    if (studentStatus) {
      return this.renderBestScore(studentStatus);
    }
    return <SpriteIcon name="reminder" className="active reminder-icon" />;
  }

  renderCommentIcon() {
    return <SpriteIcon name="message-square" className="active comment-icon" />;
  }

  renderBookIcon(studentStatus: StudentStatus, studentId: number) {
    const { history, assignment } = this.props;
    const moveToPostPlay = () => {
      if (studentStatus.bestScore !== undefined) {
        history.push(map.postPlay(assignment.brick.id, studentId) + '?fromTeach=true');
      }
    }
    return (
      <div className="round b-green centered">
        <SpriteIcon name="book-open" className="active book-open-icon" onClick={moveToPostPlay} />
      </div>
    );
  }

  renderQuestionAttemptIcon(
    studentResult: AssignmentStudent | undefined,
    questionNumber: number
  ) {
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

        if (attempt.marks > 0 && attempt.maxMarks > 0) {
          return <span className="bold text-theme-dark-blue">{attempt.marks}/{attempt.maxMarks}</span>;
        }
        return <SpriteIcon name="cancel" className="text-theme-orange smaller stroke-2" />;
      } catch {
        console.log('can`t parse attempt');
      }
    }
    return "";
  }

  renderStudent(student: TeachStudent, i: number) {
    const { studentStatus, studentResult } = student;
    return (
      <Grow
        in={true}
        key={i}
        style={{ transformOrigin: "left 0 0" }}
        timeout={i * 200}
      >
        <tr className="user-row">
          <td className="padding-left-column"></td>
          <td className="student-status">
            <div>{this.renderStatus(studentStatus)}</div>
          </td>
          <td className="student-book">
            {studentStatus && <div className="centered">{this.renderBookIcon(studentStatus, student.id)}</div>}
          </td>
          <td className={`assigned-student-name`}>
            {student.firstName} {student.lastName}
          </td>
          {Array.from(new Array(this.state.questionCount), (x, i) => i).map((a, i) =>
            <td key={i} className="icon-container">
              <div className="centered">
                {this.renderQuestionAttemptIcon(studentResult, i)}
              </div>
            </td>
          )}
          <td>
            {studentStatus && <div className="centered">{this.renderCommentIcon()}</div>}
          </td>
        </tr>
      </Grow>
    );
  }

  renderTableHead() {
    const { sortBy } = this.state;
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
              <button className={className} onClick={() => this.toggleSort()}>
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

  render() {
    const { assignment, classroom, startIndex, pageSize } = this.props;
    let { students } = this.state;

    students = students.slice(startIndex, startIndex + pageSize);

    return (
      <div className="expanded-assignment classroom-list">
        <div className="classroom-title">{classroom.name}</div>
        <div>
          <AssignedBrickDescription
            isExpanded={true}
            subjects={this.props.subjects}
            minimize={this.props.minimize}
            classroom={classroom}
            assignment={assignment}
            archive={() => { }}
            onRemind={this.props.onRemind}
          />
        </div>
        <div className="assignments-table">
          {students.length > 0 ? (
            <table cellSpacing="0" cellPadding="0">
              {this.renderTableHead()}
              <tbody>{students.map(this.renderStudent.bind(this))}</tbody>
            </table>
          ) : (
            <div className="assignment-tab-content-text">
              <p>Once students start joining your class, they will be shown here.</p>
              <p>When they have completed the assignment, you will be able to see how they have done on the brick as a whole and on each individual question.</p>
              <p>You will also be able to send them reminders to complete the assignment at any time.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ExpandedAssignment;
