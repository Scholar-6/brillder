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

    console.log(props.assignment)

    let questionCount = 0;

    if (props.assignment && props.assignment.byStudent[0]) {
      try {
        questionCount = props.assignment.byStudent[0].attempts[0].answers.length;
      } catch {
        console.log('can`t get number of questions');
      }
    }

    this.state = {
      questionCount
    }
  }

  renderQuestionAttemptIcon(studentResult: any, questionNumber: number) {
    if (studentResult) {
      console.log(studentResult);
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

  renderStudent(student: TeachStudent) {
    const { assignment } = this.props;

    const studentResult = assignment.byStudent.find((s: any) => s.studentId == student.id);

    return (
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
        <tr className="user-row">
          <td className="assigned-student-name">
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
          <td><div className="centered">1</div></td>
          <td><div className="centered">1</div></td>
          <td><div className="centered">1</div></td>
        </tr>
      </table>
    );
  }

  render() {
    console.log(this.props.classroom)
    return (
      <div className="student-results-v2">
        {this.props.classroom.students.map(s => this.renderStudent(s as TeachStudent))}
      </div>
    );
  }
}

export default StudentsTable;
