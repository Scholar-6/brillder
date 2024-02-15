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

enum SortStudentOption {
  ByDuration = 1,
  ByTime,
  ByScore,
}

interface StudentsProps {
  classItem: TeachListItem;
}

interface State {
  questionCount: number;
  isAscending: boolean;
  sorting: SortStudentOption;
  bookData: BookData;
  students: TeachStudent[];
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

    console.log('students table students: ', props.classItem.classroom.students);

    this.state = { 
      isAscending: false, sorting: SortStudentOption.ByTime,
      questionCount,
      students: props.classItem.classroom.students, bookData: { open: false, student: null, assignment: null }
    };
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

  getDuration(attempt: any) {
    let duration = 0;
    if (attempt.liveDuration) {
      duration = attempt.liveDuration;
    }
    if (attempt.reviewDuration) {
      duration += attempt.reviewDuration;
    }

    if (attempt.preparationDuration) {
      duration += attempt.preparationDuration;
    }

    if (attempt.synthesisDuration) {
      duration += attempt.synthesisDuration;
    }
    return duration;
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
      const studentResult = this.getStudentResult(student.id);

      if (studentResult) {
        const attempt = studentResult.attempts[0];

        let duration = this.getDuration(attempt);

        let time = this.getTimeDuration(duration);
        let preparationTime = this.getTimeDuration(attempt.preparationDuration);
        let liveTime = this.getTimeDuration(attempt.liveDuration);
        let synthesisTime = this.getTimeDuration(attempt.synthesisDuration);
        let reviewTime = this.getTimeDuration(attempt.reviewDuration);

        return (
          <tr className="user-row" key={index} onMouseEnter={() => console.log(attempt)}>
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
                {Math.round(attempt.score / attempt.maxScore * 100)}
                <div className="css-custom-tooltip">
                  {attempt.oldScore ? <div className="bold">Review: {Math.round(attempt.score / attempt.maxScore * 100)}</div> : ""}
                  <div>Investigation: {attempt.oldScore ? Math.round(attempt.oldScore / attempt.maxScore * 100) : Math.round(attempt.score / attempt.maxScore * 100)}</div>
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
                    <div>Preparation: {preparationTime}</div>
                    <div>Investigation: {liveTime}</div>
                    {synthesisTime ? <div>Synthesis: {synthesisTime}</div> : ""}
                    {reviewTime ? <div>Review: {reviewTime}</div> : ""}
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

  getStudentResult(studentId: number) {
    return (this.props.classItem as any).assignment.byStudent.find((s: any) => s.studentId == studentId);
  }

  sortClassroomStudents(sortBy: SortStudentOption) {
    if (this.props.classItem.assignment.byStudent) {
      let classroom = this.props.classItem.classroom;
      if (classroom) {
        let isAscending = this.state.isAscending;
        if (this.state.sorting === sortBy) {
          if (sortBy === this.state.sorting) {
            isAscending = !isAscending;
          }
        }
        let sortedStudents = classroom.students.sort((st1, st2) => {
          const student1Result = this.getStudentResult(st1.id);
          const student2Result = this.getStudentResult(st2.id);

          if (student1Result && student2Result) {
            const attempt1 = student1Result.attempts[0];
            const attempt2 = student2Result.attempts[0];

            if (sortBy === SortStudentOption.ByTime) {
              if (isAscending) {
                return attempt1.timestamp < attempt2.timestamp ? -1 : 1;
              } else {
                return attempt1.timestamp > attempt2.timestamp ? -1 : 1;
              }
            } else if (sortBy == SortStudentOption.ByDuration) {
              const duration1 = this.getDuration(attempt1);
              const duration2 = this.getDuration(attempt2);
              if (isAscending) {
                return duration1 < duration2 ? -1 : 1;
              } else {
                return duration1 > duration2 ? -1 : 1;
              }
            } else if (sortBy == SortStudentOption.ByScore) {
              let score1 = Math.round(attempt1.score / attempt1.maxScore * 100);
              let score2 = Math.round(attempt2.score / attempt2.maxScore * 100);

              if (isAscending) {
                return score1 > score2 ? 1 : -1;
              } else {
                return score1 >= score2 ? -1 : 1;
              }
            }
          }
          return 1;
        });
        
        this.setState({ isAscending, students: sortedStudents, sorting: sortBy })
      }
    }
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
                <div className="sorting-column">
                  <SpriteIcon name="percentage" />
                  <div className="sort-arrows" onClick={() => this.sortClassroomStudents(SortStudentOption.ByScore)}>
                    <SpriteIcon name="sort-arrows" />
                  </div>
                  <div className="css-custom-tooltip first">
                    Score
                  </div>
                </div>
              </th>
              <th className="icon-header-r234">
                <div className="sorting-column">
                  <SpriteIcon name="clock" />
                  <div className="sort-arrows" onClick={() => this.sortClassroomStudents(SortStudentOption.ByDuration)}>
                    <SpriteIcon name="sort-arrows" />
                  </div>
                  <div className="css-custom-tooltip second">
                    Play Time
                  </div>
                </div>
              </th>
              <th className="icon-header-r234">
                <div className="sorting-column">
                  <SpriteIcon name="calendar-v2" />
                  <div className="sort-arrows" onClick={() => this.sortClassroomStudents(SortStudentOption.ByTime)}>
                    <SpriteIcon name="sort-arrows" />
                  </div>
                  <div className="css-custom-tooltip third">
                    Time and Date
                  </div>
                </div>
              </th>
              <th className="icon-header-r234"></th>
            </tr>
          </thead>
          <tbody>
            {this.state.students.map(this.renderStudent.bind(this))}
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
