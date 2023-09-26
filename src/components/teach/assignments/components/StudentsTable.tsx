import React, { Component } from "react";

import './AssignedBrickDescription.scss';
import { Assignment, Classroom, TeachStudent } from "model/classroom";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BookDialog from "./BookDialog";

export interface BookData {
  open: boolean;
  student: any;
  assignment: Assignment | null;
}

interface StudentsProps {
  classroom: Classroom;
  assignment: any;
}

interface State {
  questionCount: number;
  bookData: BookData;
}

class StudentsTable extends Component<StudentsProps, State> {
  constructor(props: StudentsProps) {
    super(props);

    let questionCount = 0;
    if (props.assignment && props.assignment.byStudent[0]) {
      try {
        questionCount = props.assignment.byStudent[0].attempts[0].answers.length;
      } catch {
        console.log('can`t get number of questions');
      }
    }

    this.state = { questionCount, bookData: { open: false, student: null, assignment: null} };
  }

  nextStudent() {
    try {
      const {students} = this.props.classroom;
      const studentIndex = this.props.classroom.students.findIndex(s => s.id === this.state.bookData.student.id);
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
      const {students} = this.props.classroom;
      const studentIndex = this.props.classroom.students.findIndex(s => s.id === this.state.bookData.student.id);
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

  renderStudent(student: TeachStudent) {
    if (this.props.assignment.byStudent) {
      const studentResult = this.props.assignment.byStudent.find((s: any) => s.studentId == student.id);

      if (studentResult) {
        const attempt = studentResult.attempts[0];

        return (
          <tr className="user-row">
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
              <div className="centered">
                {this.renderInvestigationScore(attempt)}
              </div>
            </td>
            <td>
              <div className="centered">
                 {attempt.score && attempt.oldScore && Math.round(attempt.score / attempt.maxScore * 100)}
              </div>
            </td>
            <td><div className="centered">{Math.round(attempt.percentScore)}</div></td>
            <td className="center-icon-box-r434">
              <SpriteIcon name="eye-filled" onClick={() => this.setState({bookData: {open: true, student, assignment: this.props.assignment }})}/>
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
                  <th>{i + 1}</th>
              )}
              <th className="icon-header-r234"><SpriteIcon name="empty-hourglass" /></th>
              <th className="icon-header-r234"><SpriteIcon name="half-hourglass" /></th>
              <th className="icon-header-r234"><SpriteIcon name="full-hourglass" /></th>
              <th className="icon-header-r234"></th>
            </tr>
          </thead>
          {this.props.classroom.students.map(s => this.renderStudent(s as TeachStudent))}
        </table>
        {this.state.bookData.open && <BookDialog
          bookData={this.state.bookData}
          nextStudent={this.nextStudent.bind(this)}
          prevStudent={this.prevStudent.bind(this)}
          onClose={() => this.setState({bookData: {open: false, student: null, assignment: null}})} />
        }
      </div>
    );
  }
}

export default StudentsTable;
