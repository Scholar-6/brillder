import React from "react";

import { BrickLengthEnum } from "model/brick";
import './LibrarySubjects.scss';
import { AssignmentBrick } from "model/assignment";

interface LibrarySubjectsProps {
  subjectName: string;
  assignment: AssignmentBrick;
  history: any;
  key: number;
}

export const SubjectAssignment: React.FC<LibrarySubjectsProps> = (props) => {
  const [hovered, setHover] = React.useState(false);
  let className = 'assignment'

  const { brick } = props.assignment;
  if (brick.brickLength) {
    className += ' length-' + brick.brickLength;
  } else {
    className += ' length-' + BrickLengthEnum.S40min;
  }
  return (
    <div key={props.key} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={className}>
      {hovered && <div className="custom-tooltip subject-tooltip">
        <div className="bold">{props.subjectName}</div>
        <div>{brick.title}</div>
      </div>}
    </div>
  );
}

export default SubjectAssignment;
