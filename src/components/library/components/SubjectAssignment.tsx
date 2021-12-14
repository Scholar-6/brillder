import React from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from 'redux/reducers';
import { AcademicLevel, BrickLengthEnum, Subject } from "model/brick";
import { LibraryAssignmentBrick } from "model/assignment";
import map from "components/map";
import { GENERAL_SUBJECT } from "components/services/subject";
import { AcademyDifficulty } from "../base/AcademyDifficulty";
import BrickTitle from "components/baseComponents/BrickTitle";
import routes from "components/play/routes";
import { stripHtml } from "components/build/questionService/ConvertService";
import { isTeacherPreference } from "components/services/preferenceService";
import { User } from "model/user";

interface LibrarySubjectsProps {
  subject: Subject;
  assignment: LibraryAssignmentBrick;
  history: any;
  user: User;
}

const SubjectAssignment: React.FC<LibrarySubjectsProps> = (props) => {
  const [hovered, setHover] = React.useState(false);
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
    let className = "rotated-container " + name;
    let width = "calc(((100vh - 5.834vw - 2vw - 5.2vw - 2.1vh - 9vh - 2vh) / 3) - 2vh)";
    if (height !== 100) {
      width = `calc((((100vh - 5.834vw - 2vw - 5.2vw - 2.1vh - 9vh - 2vh) / 3) - 2vh) / 100 * ${height})`;
    }
    return (
      <div className={className}>
        <div className="rotated">
          <div className="rotated-text" style={{ width }}>
            {stripHtml(brick.title)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="assignment-progressbar"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
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
        {hovered && (
          <div className="custom-tooltip subject-tooltip">
            <div className="bold">{subject.name}</div>
            <div>
              <BrickTitle title={brick.title} />
            </div>
          </div>
        )}
        <div
          className="progress-value default-value"
          onMouseEnter={() => setHover(true)}
        >
          {height === 0 && renderRotatedTitle("text-dark-gray", 100)}
          {height < 50 && height > 0 && renderRotatedTitle("white", 100)}
          {height < 50 && (
            <AcademyDifficulty
              a={assignment.brick.academicLevel}
              className="smaller"
            />
          )}
        </div>
        {height >= 50 &&
          <div
            className="progress-value"
            onMouseEnter={() => setHover(true)}
            style={{
              background: color,
              height: height + "%",
              maxHeight: "100%",
            }}
          >
            {height >= 50 && renderRotatedTitle("white", height)}
            {assignment.brick.academicLevel >= AcademicLevel.First && (
              <AcademyDifficulty
                a={assignment.brick.academicLevel}
                className="smaller"
              />
            )}
          </div>
        }
      </div>
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(SubjectAssignment);
