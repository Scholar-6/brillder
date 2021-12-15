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
import { CircularProgressbar } from "react-circular-progressbar";

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

  const renderRotatedPercentage = (name: string, value: number, height: number) => {
    let className = "rotated-container " + name;
    let width = "calc(((100vh - 5.834vw - 2vw - 5.2vw - 2.1vh - 9vh - 2vh) / 3) - 2vh)";
    if (height !== 100) {
      width = `calc((((100vh - 5.834vw - 2vw - 5.2vw - 2.1vh - 9vh - 2vh) / 3) - 2vh) / 100 * ${height})`;
    }
    return (
      <div className={className}>
        <div className="rotated">
          <div className="rotated-text no-padding" style={{ width }}>
            {value}%
          </div>
        </div>
      </div>
    );
  };

  console.log(subject.name);

  return (
    <div
      className={`assignment-progressbar ${subject.name == GENERAL_SUBJECT ? 'general' : ''}`}
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
        style={{ background: ((subject.name == GENERAL_SUBJECT) ? 'white' : color) }}
      >
        {hovered && (
          <div className={`custom-tooltip subject-tooltip ${height < 50 ? 'yellow-background' : ''}`}>
            <div>
              <BrickTitle title={brick.title} />
            </div>
            <div className="relative">
              <div className="circle-score bold">{Math.round(height)}</div>
              <CircularProgressbar
                className="circle-progress-second"
                counterClockwise={true}
                strokeWidth={8}
                value={height}
              />
            </div>
          </div>
        )}
        <div
          className="progress-value default-value"
          onMouseEnter={() => setHover(true)}
        />
        {height > 0 &&
          <div
            className="progress-value"
            onMouseEnter={() => setHover(true)}
            style={{
              background: ((subject.name == GENERAL_SUBJECT) ? 'white' : color),
              height: ((height > 30) ? height : 30) + "%",
              maxHeight: "100%",
            }}
          >
            {height < 50 && renderRotatedPercentage("white", Math.round(height), ((height > 30) ? height : 30))}
            {height > 0 && assignment.brick.academicLevel >= AcademicLevel.First && (
              <AcademyDifficulty
                a={assignment.brick.academicLevel}
                className="smaller"
                noTopLines={height < 50}
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
