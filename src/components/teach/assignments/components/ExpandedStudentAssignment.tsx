import React, { Component } from "react";

import "./ExpandedAssignment.scss";
import { Subject } from "model/brick";
import { Assignment, TeachStudent } from "model/classroom";
import { getSubjectColor } from "components/services/subject";

import AssignedBrickDescription from "./AssignedBrickDescription";
import { ApiAssignemntStats, AttemptStats } from "model/stats";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import ReminderButton from "./ReminderButton";
import { sendAssignmentReminder } from "services/axios/brick";
import { isDeadlinePassed } from "../service/service";
import { BookData } from "./ExpandedAssignment";
import BookDialog from "./BookDialog";
import HolisticCommentPanel from "./HolisticCommentPanel";

enum SortBy {
  None,
  AvgIncreasing,
  AvgDecreasing,
}

interface AssignemntExpandedState {
  sortBy: SortBy;
  bookData: BookData;
  questionCount: number;
  student: TeachStudent;
  currentCommentButton?: Element;
}

interface AssignmentBrickProps {
  history: any;
  isStudentAssignment: boolean;
  stats: ApiAssignemntStats;
  subjects: Subject[];
  student: TeachStudent;
  assignment: Assignment;
  onRemind?(count: number, passed: boolean): void;
  minimize(): void;
}

class ExpandedStudentAssignment extends Component<
  AssignmentBrickProps,
  AssignemntExpandedState
> {
  constructor(props: AssignmentBrickProps) {
    super(props);

    let questionCount = 0;
    const {byStudent} = props.stats;
    if (byStudent[0] && byStudent[0].attempts && byStudent[0].attempts[0] && byStudent[0].attempts[0].answers) {
      questionCount = props.stats.byStudent[0].attempts[0].answers.length;
    }

    this.state = {
      sortBy: SortBy.None,
      bookData: { open: false, student: null, assignment: null},
      questionCount: questionCount,
      student: this.prepareStudent(this.props.student)
    };
  }

  prepareStudent(st: TeachStudent) {
    st.studentResult = this.props.stats.byStudent
      .find(s => s.studentId === st.id);
    return st;
  }

  renderCommentIcon() {
    return <div className="comment-icon" onClick={(evt) => this.setState({ currentCommentButton: evt.currentTarget })}>
      <SpriteIcon name="message-square" className="active" />
    </div>;
  }

  sendNotifications() {
    sendAssignmentReminder(this.props.assignment.id);
    const count = this.props.assignment.studentStatus.length - this.props.assignment.studentStatus.filter(({ status }) => status === 2).length;
    const passed = isDeadlinePassed(this.props.assignment);
    this.props.onRemind?.(count, passed);
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
              <button className={className} onClick={() => { }}>
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

  renderBookIcon(studentStatus: any, studentId: number) {
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
    const statuses = this.props.assignment.studentStatus;
    const completedCount = statuses.filter(({ status }) => status === 2).length;

    return (
      <div className="reminder-brick-actions-container">
        <ReminderButton className="" studentCount={statuses.length - completedCount} sendNotifications={this.sendNotifications.bind(this)} />
      </div>
    );
  }

  renderStudent(student: TeachStudent) {
    const { studentResult } = student;

    return (
      <tr className="user-row">
        <td className="padding-left-column"></td>
        <td className="student-status">
          <div>{this.renderStatus(studentResult)}</div>
        </td>
        <td className="student-book">
          {studentResult && studentResult.numberOfAttempts > 0 && <div className="centered">{this.renderBookIcon(studentResult, student.id)}</div>}
        </td>
        <td className={`assigned-student-name`}>
          {student.firstName} {student.lastName}
        </td>
        <td>
          {studentResult && <SpriteIcon name="eye-on" className="eye-icon" onClick={() => this.setState({bookData: {open: true, student, assignment: this.props.assignment }})} />}
        </td>
        {Array.from(new Array(this.state.questionCount), (x, i) => i).map(
          (a, i) =>
            <td key={i} className="icon-container">
              <div className="centered">
                {this.renderQuestionAttemptIcon(studentResult, i)}
              </div>
            </td>
        )}
        <td style={{ width: '9vw' }}>
          <div className="centered">{this.renderCommentIcon()}</div>
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
            activeStudent={this.props.student}
            isStudentAssignment={this.props.isStudentAssignment}
            subjects={this.props.subjects}
            minimize={this.props.minimize}
            assignment={this.props.assignment}
            archive={() => { }}
            unarchive={() => { }}
            onRemind={this.props.onRemind}
          />
        </div>
        <div className="assignments-table">
          <table cellSpacing="0" cellPadding="0">
            {this.renderTableHead()}
            <tbody>{this.renderStudent(this.props.student)}</tbody>
          </table>
        </div>
        {this.state.bookData.open && <BookDialog bookData={this.state.bookData} onClose={() => this.setState({bookData: {open: false, student: null, assignment: null}})} />}
        <HolisticCommentPanel
          currentAttempt={this.state.student.studentResult?.attempts.slice(-1)[0]}
          setCurrentAttempt={(attempt: AttemptStats) => {
            const newState = this.state;
            const attemptIdx = newState.student.studentResult!.attempts.length - 1;
            newState.student.studentResult!.attempts[attemptIdx] = attempt;
            this.setState(newState);
          }}
          onClose={() => this.setState({ currentCommentButton: undefined })}
          anchorEl={this.state.currentCommentButton}
        />
      </div>
    );
  }
}

export default ExpandedStudentAssignment;
