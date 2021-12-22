import React from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from 'redux/reducers';
import { AcademicLevel, BrickLengthEnum, Subject } from "model/brick";
import { LibraryAssignmentBrick } from "model/assignment";
import map from "components/map";
import { GENERAL_SUBJECT } from "components/services/subject";
import { AcademyDifficulty } from "../base/AcademyDifficulty";
import { stripHtml } from "components/build/questionService/ConvertService";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import routes from "components/play/routes";
import { User } from "model/user";
import { isTeacherPreference } from "components/services/preferenceService";

interface LibrarySubjectsProps {
  subject: Subject;
  assignment: LibraryAssignmentBrick;
  history: any;

  user: User;
}

const SubjectPhoneAssignment: React.FC<LibrarySubjectsProps> = (props) => {
  let className = "assignment";

  const { assignment, subject } = props;

  const { brick } = props.assignment;
  if (brick.brickLength) {
    className += " length-" + brick.brickLength;
  } else {
    className += " length-" + BrickLengthEnum.S40min;
  }
  const minHeight = 5;
  const height = assignment.bestAttemptPercentScore ? assignment.bestAttemptPercentScore : minHeight;

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
            brick={brick}
            className="smaller"
          />
        )}
      </div>
    );
  };

  return (
    <div className={`assignment-progressbar ${subject.name == GENERAL_SUBJECT ? 'general' : ''}`}>
      <div
        className={className}
        onClick={() => {
          if (assignment.maxScore) {
            if (isTeacherPreference(props.user)) {
              props.history.push(map.postAssignment(brick.id, props.user.id));
            } else {
              props.history.push(map.postPlay(brick.id, props.user.id));
            }
          } else {
            props.history.push(routes.playNewPrep(brick));
          }
        }}
        style={{ background: color }}
      >
        <div className="progress-value default-value">
          {height === 0 && renderRotatedTitle("text-dark-gray", 100)}
          {height < 50 && height > 0 && renderRotatedTitle("white", 100)}
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

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(SubjectPhoneAssignment);
