import React from "react";

import './SingleSubjectAssignment.scss';
import { BrickLengthEnum, Subject } from "model/brick";
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

  const { brick } = props.assignment;
  if (brick.brickLength) {
    className += ' length-' + brick.brickLength;
  } else {
    className += ' length-' + BrickLengthEnum.S40min;
  }
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

  let { color } = subject;
  if (subject.name === GENERAL_SUBJECT) {
    color = '#001c58';
  }

  className += ' default';

  const renderRotatedTitle = (name: string) => {
    let className = "rotated-container " + name;
    return (
      <div className={className}>
        <div className="rotated">
          <div className="rotated-text">
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
        {!height && renderRotatedTitle("")}
        {hovered && <div className="custom-tooltip subject-tooltip">
          <div className="bold">{subject.name}</div>
          <div>{brick.title}</div>
        </div>}
        <div className="progress-value default-value" onMouseEnter={() => setHover(true)}></div>
        <div className="progress-value" onMouseEnter={() => setHover(true)} style={{ background: color, height: height + '%' }} />
      </div>
    </div>
  );
}

export default SingleSubjectAssignment;
