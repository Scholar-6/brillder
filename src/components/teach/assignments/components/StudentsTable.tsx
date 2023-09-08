import React, { Component } from "react";

import './AssignedBrickDescriptionV2.scss';
import { Classroom, TeachStudent } from "model/classroom";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Student } from "model/user";

interface StudentsProps {
  classroom: Classroom;
  assignment: any;
}

interface State {
  questionCount: number;
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

    this.state = { questionCount };
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

  renderStudent(student: TeachStudent) {
    const studentResult = this.props.assignment.byStudent.find((s: any) => s.studentId == student.id);

    console.log(studentResult)

    if (studentResult) {
      const attempt = studentResult.attempts[0];
      console.log(attempt)

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
              {attempt.oldScore && Math.round(attempt.oldScore / attempt.maxScore * 10000) / 100 + '%'}
            </div>
          </td>
          <td>
            <div className="centered">
              {attempt.score && Math.round(attempt.score / attempt.maxScore * 10000) / 100 + '%'}
            </div>
          </td>
          <td><div className="centered">{Math.round(attempt.percentScore * 100) / 100}%</div></td>
        </tr>
      );
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
              <th>Investigation</th>
              <th>Review</th>
              <th>Final</th>
            </tr>
          </thead>
          {this.props.classroom.students.map(s => this.renderStudent(s as TeachStudent))}
        </table>
      </div>
    );
  }
}

export default StudentsTable;
