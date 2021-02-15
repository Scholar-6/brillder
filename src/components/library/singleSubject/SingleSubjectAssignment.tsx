import React from "react";

import './SingleSubjectAssignment.scss';
import { AcademicLevel, BrickLengthEnum, Subject } from "model/brick";
import { LibraryAssignmentBrick } from "model/assignment";
import map from "components/map";
import { GENERAL_SUBJECT } from "components/services/subject";

interface LibrarySubjectsProps {
  userId: number;
  subject: Subject;
  assignment: LibraryAssignmentBrick;
  history: any;
}

export const SingleSubjectAssignment: React.FC<LibrarySubjectsProps> = (props) => {
  const [hovered, setHover] = React.useState(false);
  let className = 'assignment'

  const { assignment, subject } = props;
  const [height, setHeight] = React.useState(0);

  setTimeout(() => {
    const minHeight = 5;
    let height = 0;
    if (assignment.lastAttemptScore && assignment.maxScore) {
      const heightInt = (assignment.lastAttemptScore / assignment.maxScore * 100);
      if (heightInt < minHeight) {
        height = minHeight;
      } else {
        height = heightInt;
      }
    }
    if (assignment.lastAttemptScore === 0) {
      height = minHeight;
    }
    setHeight(height);
  }, 200);

  const { brick } = props.assignment;
  if (brick.brickLength) {
    className += ' length-' + brick.brickLength;
  } else {
    className += ' length-' + BrickLengthEnum.S40min;
  }

  let { color } = subject;
  if (subject.name === GENERAL_SUBJECT) {
    color = '#001c58';
  }

  className += ' default';

  const renderTeacher = (user: any) => {
    if (user) {
      return (
        <div className="teacher-initials">
          <div>{user.firstName[0]}{user.lastName[0]}</div>
        </div>
      );
    }
    return <div></div>
  }

  const renderLines = (a: AcademicLevel) => {
    let levels = [];

    for (let i = AcademicLevel.Fisrt; i <= a; i ++) {
      levels.push(<div key={i} className="level"></div>)
    }
    return levels;
  }

  const renderAcademicLines = (a: AcademicLevel) => {
    return (
      <div className="academic-lines">
        <div className="start-lines">
          <div>
            {renderLines(a)}
          </div>
        </div>
        <div className="end-lines">
          <div>
            {renderLines(a)}
          </div>
        </div>
      </div>
    );
  }

  const renderRotatedTitle = (name: string, height: number) => {
    let className = "rotated-container " + name;
    let width = 'calc(80.4vh - 13.034vw)';
    if (height !== 100) {
      width = `calc((80.4vh - 13.034vw) / 100 * ${height})`
    }
    return (
      <div className={className}>
        <div className="rotated">
          <div className="rotated-text" style={{width}}>
            <p>{brick.title}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-progressbar single-assignment-progressbar" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className={className} onClick={() => {
        if (assignment.maxScore) {
          props.history.push(map.postPlay(brick.id, props.userId));
        } else {
          props.history.push(map.playIntro(brick.id));
        }
      }} style={{ background: color }}>
        {renderTeacher(null)}
        {!height && renderRotatedTitle("left-align", 100)}
        {hovered && <div className="custom-tooltip subject-tooltip">
          <div>{brick.title}</div>
        </div>}
        <div className="progress-value default-value" onMouseEnter={() => setHover(true)}></div>
        <div className="progress-value" onMouseEnter={() => setHover(true)} style={{ background: color, height: height + '%' }}>
          {height > 40 && renderRotatedTitle("white", height)}
          {height > 40 && assignment.brick.academicLevel >= AcademicLevel.Fisrt && renderAcademicLines(assignment.brick.academicLevel)}
        </div>
      </div>
    </div>
  );
}

export default SingleSubjectAssignment;
