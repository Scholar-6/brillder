import React, { useEffect } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from 'redux/reducers';
import { AcademicLevel, BrickLengthEnum, Subject } from "model/brick";
import { LibraryAssignmentBrick } from "model/assignment";
import map from "components/map";
import { GENERAL_SUBJECT } from "components/services/subject";
import { AcademyDifficulty } from "../base/AcademyDifficulty";
import BrickTitle from "components/baseComponents/BrickTitle";
import routes, { playCover } from "components/play/routes";
import { isTeacherPreference } from "components/services/preferenceService";
import { User } from "model/user";
import { CircularProgressbar } from "react-circular-progressbar";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { checkCompetitionActive } from "services/competition";
import CompetitionLibraryDialog from "components/baseComponents/dialogs/CompetitionLibraryDialog";

interface LibrarySubjectsProps {
  subject: Subject;
  assignment: LibraryAssignmentBrick;
  history: any;
  user: User;
  student: User | null;
}

const SubjectAssignment: React.FC<LibrarySubjectsProps> = (props) => {
  const [activeCompetitionId, setActiveCompetitionId] = React.useState(-1);
  const [hovered, setHover] = React.useState(false);
  const [competitionClicked, setCompetitionClicked] = React.useState(false);

  const { assignment, subject, history } = props;
  const { brick } = assignment;

  useEffect(() => {
    if (brick.competitions && brick.competitions.length > 0) {
      const competition = brick.competitions.find(checkCompetitionActive);
      if (competition) {
        setActiveCompetitionId(competition.id);
      }
    }
    /*eslint-disable-next-line*/
  }, []);

  let className = "assignment";

  if (brick.brickLength) {
    className += " length-" + brick.brickLength;
  } else {
    className += " length-" + BrickLengthEnum.S40min;
  }
  const minHeight = 5;
  const score = assignment.bestAttemptPercentScore ? assignment.bestAttemptPercentScore : 0;
  const height = assignment.bestAttemptPercentScore ? assignment.bestAttemptPercentScore : minHeight;

  let { color } = subject;
  if (subject.name === GENERAL_SUBJECT) {
    color = "white";
  }

  className += " default";

  const renderValueBar = () => {
    return (
      <div
        className="progress-value"
        onMouseEnter={() => setHover(true)}
        style={{
          background: color,
          height: ((height > 30) ? height : 30) + "%",
          maxHeight: "100%",
        }}
      >
        {activeCompetitionId > 0 &&
          <div className="competition-star">
            <SpriteIcon name={subject.name === GENERAL_SUBJECT ? "book-star-general" : "book-star"} style={{ color: color, stroke: color, fill: color }} />
          </div>}
        {height > 0 && assignment.brick.academicLevel >= AcademicLevel.First && (
          <AcademyDifficulty
            a={assignment.brick.academicLevel}
            className="smaller"
            noTopLines={height < 50}
          />
        )}
      </div>
    )
  }

  const renderFullBar = () => {
    return (
      <div
        className="progress-value small-value"
        onMouseEnter={() => setHover(true)}
        style={{
          background: color,
          height: 100 + "%",
          opacity: 0.3,
          maxHeight: "100%",
        }}
      >
        {activeCompetitionId > 0 &&
          <div className="competition-star">
            <SpriteIcon name={subject.name === GENERAL_SUBJECT ? "book-star-general" : "book-star"} style={{ color: color, stroke: color, fill: color }} />
          </div>}
        {height > 0 && assignment.brick.academicLevel >= AcademicLevel.First && (
          <AcademyDifficulty
            a={assignment.brick.academicLevel}
            className="smaller"
            noTopLines={false}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`assignment-progressbar all-subjects ${subject.name === GENERAL_SUBJECT ? 'general' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={className}
        onClick={() => {
          if (activeCompetitionId > 0) {
            setCompetitionClicked(true);
            return;
          }
          if (assignment.maxScore) {
            let userId = props.user.id;
            if (props.student) {
              userId = props.student.id;
            }
            if (isTeacherPreference(props.user)) {
              history.push(map.postAssignment(brick.id, userId));
            } else {
              history.push(map.postPlay(brick.id, userId));
            }
          } else {
            history.push(routes.playNewPrep(brick));
          }
        }}
        style={{ background: color }}
      >
        {hovered && (
          <div className={`custom-tooltip subject-tooltip ${height < 50 ? 'yellow-background' : ''}`}>
            <div>
              <BrickTitle title={brick.title} />
            </div>
            <div className="relative">
              <div className="circle-score bold">{Math.round(score)}</div>
              <CircularProgressbar
                className="circle-progress-second"
                counterClockwise={true}
                strokeWidth={8}
                value={score}
              />
            </div>
          </div>
        )}
        <div
          className="progress-value default-value"
          onMouseEnter={() => setHover(true)}
        />
        {height >= 50 ? renderValueBar() : renderFullBar()}
      </div>
      {competitionClicked && <CompetitionLibraryDialog isOpen={competitionClicked} submit={() => {
        const brickCopy = Object.assign(brick);
        brickCopy.competitionId = activeCompetitionId;
        const link = playCover(brickCopy);
        history.push(link);
      }} close={() => setCompetitionClicked(false)} />}
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(SubjectAssignment);
