import React from "react";

import { AcademicLevel, BrickLengthEnum, Subject } from "model/brick";
import { LibraryAssignmentBrick } from "model/assignment";
import map from "components/map";
import { GENERAL_SUBJECT } from "components/services/subject";
import { AcademyDifficulty } from "../base/AcademyDifficulty";
import BrickTitle from "components/baseComponents/BrickTitle";

interface LibrarySubjectsProps {
  userId: number;
  subject: Subject;
  assignment: LibraryAssignmentBrick;
  history: any;
}

export const SubjectAssignment: React.FC<LibrarySubjectsProps> = (props) => {
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
  if (assignment.bestAttemptScore && assignment.maxScore) {
    const heightInt = (assignment.bestAttemptScore / assignment.maxScore * 100);
    if (heightInt < minHeight) {
      height = minHeight;
    } else {
      height = heightInt;
    }
  }
  if (assignment.bestAttemptScore === 0) {
    height = minHeight;
  }

  let { color } = subject;
  if (subject.name === GENERAL_SUBJECT) {
    color = '#001c58';
  }

  className += ' default';

  return (
    <div className="assignment-progressbar" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className={className} onClick={() => {
        if (assignment.maxScore) {
          props.history.push(map.postPlay(brick.id, props.userId));
        } else {
          props.history.push(map.playIntro(brick.id));
        }
      }} style={{ background: color }}>
        {hovered && <div className="custom-tooltip subject-tooltip">
          <div className="bold">{subject.name}</div>
          <div><BrickTitle title={brick.title} /></div>
        </div>}
        <div className="progress-value default-value" onMouseEnter={() => setHover(true)} />
        <div className="progress-value" onMouseEnter={() => setHover(true)} style={{ background: color, height: height + '%' }}>
          {height > 40 && assignment.brick.academicLevel >= AcademicLevel.First && <AcademyDifficulty a={assignment.brick.academicLevel} className="smaller" />}
        </div>
      </div>
    </div>
  );
}

export default SubjectAssignment;
