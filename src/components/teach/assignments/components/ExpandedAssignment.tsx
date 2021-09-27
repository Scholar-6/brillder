import React, { Component } from "react";
import { Grow } from "@material-ui/core";

import "./ExpandedAssignment.scss";
import { Subject } from "model/brick";
import { Assignment, StudentStatus, TeachClassroom, TeachStudent } from "model/classroom";
import { getSubjectColor } from "components/services/subject";

import AssignedBrickDescription from "./AssignedBrickDescription";
import { ApiAssignemntStats, AssignmentStudent, AttemptStats } from "model/stats";
import map from "components/map";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ReminderButton from "./ReminderButton";
import { sendAssignmentReminder } from "services/axios/brick";
import { getTotalStudentsCount, isDeadlinePassed } from "../service/service";
import BookDialog from "./BookDialog";
import HolisticCommentPanel from "./HolisticCommentPanel";
import { ReduxCombinedState } from "redux/reducers";
import { connect } from "react-redux";
import { User } from "model/user";
import BookButton from "./BookButton";
import CommentButton from "./CommentButton";

enum SortBy {
  None,
  AvgIncreasing,
  AvgDecreasing,
}

export interface BookData {
  open: boolean;
  student: any;
  assignment: Assignment | null;
}
interface AssignemntExpandedState {
  sortBy: SortBy;
  questionCount: number;
  studentsPrepared: boolean;
  bookData: BookData;
  students: TeachStudent[];
  shown: boolean;
  currentCommentButton?: Element;
  currentCommentStudentId?: number;
}

interface AssignmentBrickProps {
  stats: ApiAssignemntStats;
  subjects: Subject[];
  startIndex: number;
  pageSize: number;
  classroom: TeachClassroom;
  assignment: Assignment;
  history: any;
  currentUser: User;
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
      bookData: { open: false, student: null, assignment: null},
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
    });

    return students;
  }

  nextStudent() {
    try {
      const {students} = this.state;
      const studentIndex = this.state.students.findIndex(s => s.id === this.state.bookData.student.id);
      for (let i = studentIndex + 1; i < students.length; i++) {
        const student = students[i];
        if (student.studentResult) {
          this.setState({bookData: {open: true, student, assignment: this.props.assignment }});
          break;
        }
      }
    } catch {
      console.log('can`t find next student');
    }
  }

  prevStudent() {
    try {
      const {students} = this.state;
      const studentIndex = this.state.students.findIndex(s => s.id === this.state.bookData.student.id);
      for (let i = studentIndex - 1; i >= 0; i--) {
        const student = students[i];
        if (student.studentResult) {
          this.setState({bookData: {open: true, student, assignment: this.props.assignment }});
          break;
        }
      }
    } catch {
      console.log('can`t find next student');
    }
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

  sendNotifications() {
    sendAssignmentReminder(this.props.assignment.id);
    const count = getTotalStudentsCount(this.props.classroom);
    const passed = isDeadlinePassed(this.props.assignment);
    this.props.onRemind?.(count, passed);
  }

  sort(sortBy: SortBy) {
    let students = this.state.students;
    if (sortBy === SortBy.AvgDecreasing) {
      students = this.state.students.sort((a, b) => {
        if (!a.studentResult) { return 1; }
        if (!b.studentResult) { return -1; }
        return b.studentResult?.avgScore - a.studentResult?.avgScore;
      });
    } else {
      students = this.state.students.sort((a, b) => {
        if (!a.studentResult) { return -1; }
        if (!b.studentResult) { return 1; }
        return a.studentResult?.avgScore - b.studentResult?.avgScore;
      });
    }
    this.setState({ students, sortBy });
  }

  renderBestScore(studentResult: StudentStatus) {
    const subjectId = this.props.assignment.brick.subjectId;
    let color = getSubjectColor(this.props.subjects, subjectId);

    if (!color) {
      color = "#B0B0AD";
    }

    const score = studentResult.bestScore || studentResult.avgScore || 0;

    return (
      <div className="circle" style={{ background: color }}>
        {Math.round(score)}
      </div>
    );
  }

  renderStatus(studentResult: StudentStatus | undefined) {
    if (studentResult && studentResult.numberOfAttempts > 0) {
      return this.renderBestScore(studentResult);
    }
    const statuses = this.props.assignment.studentStatus;
    const completedCount = statuses.filter(({ status }) => status === 2).length;

    return (
      <div className="reminder-brick-actions-container smaller-remind-button">
        <ReminderButton className="" studentCount={statuses.length - completedCount} sendNotifications={this.sendNotifications.bind(this)} />
      </div>
    );
  }

  renderCommentIcon(studentId: number) {
    const { history, assignment } = this.props;
    return <CommentButton
      studentId={studentId} students={this.state.students}
      currentUser={this.props.currentUser}
      onClick={(evt: any) => this.setState({ currentCommentButton: evt.currentTarget, currentCommentStudentId: studentId })}
      onMove={() =>  history.push(map.postAssignment(assignment.brick.id, studentId) + '?fromTeach=true')}
    />;
  }

  renderBookIcon(studentResult: StudentStatus, studentId: number) {
    const { history, assignment } = this.props;
    const moveToPostPlay = () => {
      if (studentResult.bestScore !== undefined) {
        history.push(map.postAssignment(assignment.brick.id, studentId) + '?fromTeach=true');
      }
    }
    return <BookButton onClick={moveToPostPlay} />;
  }

  renderQuestionAttemptIcon(
    studentResult: AssignmentStudent | undefined,
    questionNumber: number
  ) {
    if (studentResult) {
      try {
        let bestAttempt = studentResult.attempts[0];
        for (let a of studentResult.attempts) {
          if (a.percentScore > bestAttempt.percentScore) {
            bestAttempt = a;
          }
        }
        const attempt = bestAttempt.answers[questionNumber];
        const liveAttempt = bestAttempt.liveAnswers[questionNumber];

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
        return <SpriteIcon name="cancel-custom" className="text-theme-orange smaller close" />;
      } catch {
        console.log('can`t parse attempt');
      }
    }
    return "";
  }

  renderStudent(student: TeachStudent, i: number) {
    const { studentResult } = student;
    const {bookData} = this.state;
    
    const disabled = bookData.student && bookData.student?.id !== student.id ? true : false;
    const active = bookData.student?.id === student.id ? true : false;
    
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
            <div>{this.renderStatus(studentResult)}</div>
          </td>
          <td className="student-book">
            {studentResult && studentResult.numberOfAttempts > 0 && <div className="centered">{this.renderBookIcon(studentResult, student.id)}</div>}
          </td>
          <td className={`assigned-student-name ${active ? 'bold' : disabled ? 'grey' : 'regular'}`}>
            {student.firstName} {student.lastName}
          </td>
          <td>
            {studentResult && studentResult.numberOfAttempts > 0 && <SpriteIcon
              name="eye-on" className={`eye-icon ${disabled ? 'grey' : 'blue'}`} onClick={() => this.setState({bookData: {open: true, student, assignment: this.props.assignment }})}
            />}
          </td>
          {Array.from(new Array(this.state.questionCount), (x, i) => i).map((a, i) =>
            <td key={i} className="icon-container">
              <div className="centered">
                {this.renderQuestionAttemptIcon(studentResult, i)}
              </div>
            </td>
          )}
          <td style={{ width: '9vw' }}>
            {studentResult && <div className="centered">{this.renderCommentIcon(student.id)}</div>}
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
            unarchive={() => { }}
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
        {this.state.bookData.open && <BookDialog
          bookData={this.state.bookData}
          nextStudent={this.nextStudent.bind(this)}
          prevStudent={this.prevStudent.bind(this)}
          onClose={() => this.setState({bookData: {open: false, student: null, assignment: null}})} />
        }
        <HolisticCommentPanel
          currentAttempt={students.find(s => s.id === this.state.currentCommentStudentId)?.studentResult?.attempts.slice(-1)[0]}
          setCurrentAttempt={(attempt: AttemptStats) => {
            const newState = this.state;
            /* eslint-disable-next-line */
            const studentIdx = newState.students.findIndex(s => s.id == newState.currentCommentStudentId);
            const attemptIdx = newState.students[studentIdx].studentResult!.attempts.length - 1;
            newState.students[studentIdx].studentResult!.attempts[attemptIdx] = attempt;
            this.setState(newState);
          }}
          onClose={() => this.setState({ currentCommentButton: undefined, currentCommentStudentId: undefined })}
          anchorEl={this.state.currentCommentButton}
        />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
    currentUser: state.user.user,
});

export default connect(mapState)(ExpandedAssignment);
