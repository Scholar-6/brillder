import React, { useEffect } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from 'redux/reducers';
import { AcademicLevel, BrickLengthEnum, Subject } from "model/brick";
import { LibraryAssignmentBrick } from "model/assignment";
import map from "components/map";
import { GENERAL_SUBJECT } from "components/services/subject";
import { AcademyDifficulty } from "../base/AcademyDifficulty";
import { stripHtml } from "components/build/questionService/ConvertService";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import routes, { playCover } from "components/play/routes";
import { User } from "model/user";
import { isTeacherPreference } from "components/services/preferenceService";
import { checkCompetitionActive } from "services/competition";
import CompetitionLibraryDialog from "components/baseComponents/dialogs/CompetitionLibraryDialog";

interface LibrarySubjectsProps {
  subject: Subject;
  assignment: LibraryAssignmentBrick;
  history: any;

  user: User;
}

const SubjectPhoneAssignment: React.FC<LibrarySubjectsProps> = (props) => {
  const [activeCompetitionId, setActiveCompetitionId] = React.useState(-1);
  const [competitionClicked, setCompetitionClicked] = React.useState(false);

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

  const { assignment, subject, history } = props;

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
    let width = "calc(45vh - 3vw)";
    if (height !== 100) {
      width = `calc((45vh - 3vw) / 100 * ${height})`;
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
    <div className={`assignment-progressbar ${subject.name === GENERAL_SUBJECT ? 'general' : ''}`}>
      <div
        className={className}
        onClick={() => {
          if (activeCompetitionId > 0) {
            setCompetitionClicked(true);
            return;
          }
          if (assignment.maxScore) {
            if (isTeacherPreference(props.user)) {
              history.push(map.postAssignment(brick.id, props.user.id));
            } else {
              history.push(map.postPlay(brick.id, props.user.id));
            }
          } else {
            history.push(routes.playNewPrep(brick));
          }
        }}
        style={{ background: color }}
      >
        {height < 50 && activeCompetitionId > 0 && <div className="competition-star bigger">
          <SpriteIcon name={subject.name === GENERAL_SUBJECT ? "book-star-general" : "book-star"} style={{ color: color, stroke: color, fill: color }} />
        </div>}
        <div className="progress-value default-value">
          <div className="background" style={{ background: height < 50 ? color : '', opacity: height < 50 ? 0.3 : 0.5 }}>
            {height < 50 && (
              <AcademyDifficulty
                a={assignment.brick.academicLevel}
                brick={brick}
              />
            )}
          </div>
          {height === 0 && renderRotatedTitle("text-dark-gray", 100)}
          {height < 50 && height > 0 && renderRotatedTitle("white", 100)}
          {height < 50 && height > 0 && (
            <div className="pr-lock-container" style={{ background: color }}>
              <div>
                <SpriteIcon name="lock" />
              </div>
              <div>{Math.round(height)}%</div>
              <AcademyDifficulty
                a={assignment.brick.academicLevel}
                brick={brick}
                noTopLines={height < 50}
              />
            </div>
          )}
        </div>
        {height >= 50 && renderProgressValue()}
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

export default connect(mapState)(SubjectPhoneAssignment);
