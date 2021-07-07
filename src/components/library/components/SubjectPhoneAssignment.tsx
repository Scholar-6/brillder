import React from "react";

import { AcademicLevel, BrickLengthEnum, Subject } from "model/brick";
import { LibraryAssignmentBrick } from "model/assignment";
import map from "components/map";
import { GENERAL_SUBJECT } from "components/services/subject";
import { AcademyDifficulty } from "../base/AcademyDifficulty";
import { stripHtml } from "components/build/questionService/ConvertService";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface LibrarySubjectsProps {
  userId: number;
  subject: Subject;
  assignment: LibraryAssignmentBrick;
  history: any;
}

export const SubjectAssignment: React.FC<LibrarySubjectsProps> = (props) => {
  let className = "assignment";

  const { assignment, subject } = props;

  const { brick } = props.assignment;
  if (brick.brickLength) {
    className += " length-" + brick.brickLength;
  } else {
    className += " length-" + BrickLengthEnum.S40min;
  }
  const minHeight = 5;
  let height = 0;
  if (assignment.bestAttemptScore && assignment.maxScore) {
    const heightInt = (assignment.bestAttemptScore / assignment.maxScore) * 100;
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
    color = "#001c58";
  }

  className += " default";

  const renderRotatedTitle = (name: string, height: number) => {
    let width = "calc(30vh - 3vw)";
    if (height !== 100) {
      width = `calc((30vh - 3vw) / 100 * ${height})`;
    }
    return (
      <div className={"rotated-container " + name}>
        <div className="rotated">
          <div className="rotated-text" style={{ width }}>
            {stripHtml(brick.title)}
          </div>
        </div>
      </div>
    );
  };

  const renderProgressValue = () => {
    return (
      <div
        className="progress-value"
        style={{ background: color, height: height + "%", maxHeight: "100%" }}
      >
        {renderRotatedTitle("white", height)}
        {assignment.brick.academicLevel >= AcademicLevel.First && (
          <AcademyDifficulty
            a={assignment.brick.academicLevel}
            className="smaller"
          />
        )}
      </div>
    );
  };

  return (
    <div className="assignment-progressbar">
      <div
        className={className}
        onClick={() => {
          if (assignment.maxScore) {
            props.history.push(map.postPlay(brick.id, props.userId));
          } else {
            props.history.push(map.playIntro(brick.id));
          }
        }}
        style={{ background: color }}
      >
        <div className="progress-value default-value">
          {height === 0 && renderRotatedTitle("text-dark-gray", 100)}
          {height < 50 && height > 0 && renderRotatedTitle("white", 100)}
          {height < 50 && (
            <AcademyDifficulty
              a={assignment.brick.academicLevel}
              className="smaller"
            />
          )}
          {height < 50 && height > 0 && (
            <div className="pr-lock-container" style={{ background: color }}>
              <div>
                <SpriteIcon name="lock" />
              </div>
              <div>{Math.round(height)}%</div>
            </div>
          )}
        </div>
        {height >= 50 && renderProgressValue()}
      </div>
    </div>
  );
};

export default SubjectAssignment;
