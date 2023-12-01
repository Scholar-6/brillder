import React, { Component } from "react";

import './AssignedBrickDescription.scss';
import { Assignment, TeachStudent } from "model/classroom";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BookDialog from "./BookDialog";
import { TeachListItem } from "./ClassroomList";
import moment from "moment";

export interface BookData {
  open: boolean;
  student: any;
  assignment: Assignment | null;
}

interface StudentsProps {
  classItem: TeachListItem;
}

interface State {
  questionCount: number;
  bookData: BookData;
}

class StudentsTable extends Component<StudentsProps, State> {
  constructor(props: StudentsProps) {
    super(props);

    let questionCount = 0;

    const { assignment } = props.classItem;

    if (assignment && assignment.byStudent && assignment.byStudent[0]) {
      try {
        questionCount = assignment.byStudent[0].attempts[0].answers.length;
      } catch {
        console.log('can`t get number of questions');
      }
    }

    this.state = { questionCount, bookData: { open: false, student: null, assignment: null } };
  }

  nextStudent() {
    try {
      const { students } = this.props.classItem.classroom;
      const studentIndex = students.findIndex(s => s.id === this.state.bookData.student.id);
      for (let i = studentIndex + 1; i < students.length; i++) {
        const student = students[i];
        if (student.studentResult) {
          this.setState({ bookData: { open: true, student, assignment: this.props.classItem.assignment } });
          break;
        }
      }
    } catch {
      console.log('can`t find next student');
    }
  }

  prevStudent() {
    try {
      const { students } = this.props.classItem.classroom;
      const studentIndex = students.findIndex(s => s.id === this.state.bookData.student.id);
      for (let i = studentIndex - 1; i >= 0; i--) {
        const student = students[i];
        if (student.studentResult) {
          this.setState({ bookData: { open: true, student, assignment: this.props.classItem.assignment } });
          break;
        }
      }
    } catch {
      console.log('can`t find next student');
    }
  }

  renderQuestionAttemptIcon(attempt: any, questionNumber: number) {
    if (attempt) {
      try {
        const answer = attempt.answers[questionNumber];
        const liveAnswer = attempt.liveAnswers[questionNumber];

        // yellow tick
        if (answer.correct === true && liveAnswer.correct === false) {
          return <SpriteIcon name="check-icon" className="text-yellow" />;
        } else if (answer.correct === false && liveAnswer.correct === true) {
          return <SpriteIcon name="check-icon" className="text-yellow" />;
        }

        if (answer.correct === true && liveAnswer.correct === true) {
          return <SpriteIcon name="check-icon" className="text-theme-green" />;
        }

        return <SpriteIcon name="cancel" className="text-theme-orange smaller stroke-2" />;
      } catch {
        console.log('can`t parse attempt');
      }
    }
    return "";
  }

  renderInvestigationScore(attempt: any) {
    if (attempt.oldScore) {
      return Math.round(attempt.oldScore / attempt.maxScore * 100);
    } else if (attempt.score) {
      return Math.round(attempt.score / attempt.maxScore * 100);
    }
    return '';
  }

  getTimeDuration(duration: number) {
    let seconds = 0;
    let minutes = 0;

    if (duration) {
      seconds = Math.round(duration / 1000) % 60;
    }
    if (duration >= 6000) {
      minutes = Math.floor(duration / 60000);
    }

    let time = seconds + 's';
    if (minutes > 0) {
      time = minutes + 'm' + time;
    }
    return time;
  }

  renderStudent(student: TeachStudent, index: number) {
    if (this.props.classItem.assignment.byStudent) {
      const studentResult = this.props.classItem.assignment.byStudent.find((s: any) => s.studentId == student.id);


      if (studentResult) {
        const attempt = studentResult.attempts[0];

        let duration = 0;
        if (attempt.liveDuration) {
          duration = attempt.liveDuration;
        }
        if (attempt.reviewDuration) {
          duration += attempt.reviewDuration;
        }

        let time = this.getTimeDuration(duration);
        let liveTime = this.getTimeDuration(attempt.liveDuration);
        let reviewTime = this.getTimeDuration(attempt.reviewDuration);

        return (
          <tr className="user-row" key={index}>
            <td className="assigned-student-name">
              {student.firstName} {student.lastName}
            </td>
            {Array.from(new Array(this.state.questionCount), (x, i) => i).map(
              (a, i) =>
                <td key={i} className="icon-container">
                  <div className="centered">
                    {this.renderQuestionAttemptIcon(attempt, i)}
                  </div>
                </td>
            )}
            <td>
              <div className="centered score-hover-container">
                {Math.round(attempt.percentScore)}
                <div className="css-custom-tooltip">
                  {attempt.oldScore ? <div className="bold">Review: {attempt.score / attempt.maxScore * 100}</div> : ""}
                  <div>Investigation: {attempt.oldScore ? (attempt.oldScore / attempt.maxScore * 100) : (attempt.score / attempt.maxScore * 100)}</div>
                  {attempt.oldScore ? <div>Average: {Math.round(attempt.percentScore)}</div> : ""}
                </div>
              </div>
            </td>
            <td>
              <div className="centered duration-time score-hover-container">
                {duration > 0 ? time : ''}
                {duration > 0 ?
                  <div className="css-custom-tooltip">
                    <div>Total Time: {time}</div>
                    <div>Investigation: {liveTime}</div>
                    <div>Review: {reviewTime}</div>
                  </div> : ""}
              </div>
            </td>
            <td>
              <div className="centered two-lines">
                {attempt.timestamp ? moment(attempt.timestamp).format('H:mm DD.MM.YY') : ''}
              </div>
            </td>
            <td className="center-icon-box-r434">
              <SpriteIcon name="eye-filled" onClick={() => this.setState({ bookData: { open: true, student, assignment: this.props.classItem.assignment } })} />
            </td>
          </tr>
        );
      }
    }

    return '';
  }

  render() {
    return (
      <div className="student-results-v2">
        <table cellSpacing="0" cellPadding="0">
          <thead>
            <tr className="bold">
              <th></th>
              {Array.from(new Array(this.state.questionCount), (x, i) => i).map(
                (a, i) =>
                  <th key={i}>{i + 1}</th>
              )}
              <th className="icon-header-r234">
                <SpriteIcon name="percentage" />
                <div className="css-custom-tooltip first">
                  Percentage score
                </div>
              </th>
              <th className="icon-header-r234">
                <SpriteIcon name="clock" />
                <div className="css-custom-tooltip second">
                  Time
                </div>
              </th>
              <th className="icon-header-r234">
                <SpriteIcon name="calendar-v2" />
                <div className="css-custom-tooltip third">
                  Time stamp
                </div>
              </th>
              <th className="icon-header-r234"></th>
            </tr>
          </thead>
          <tbody>
            {this.props.classItem.classroom.students.map(this.renderStudent.bind(this))}
          </tbody>
        </table>
        {this.state.bookData.open && <BookDialog
          bookData={this.state.bookData}
          nextStudent={this.nextStudent.bind(this)}
          prevStudent={this.prevStudent.bind(this)}
          onClose={() => this.setState({ bookData: { open: false, student: null, assignment: null } })} />
        }
      </div>
    );
  }
}

export default StudentsTable;
