import React, { useEffect } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from 'redux/reducers';
import { AcademicLevel, BrickLengthEnum, Subject } from "model/brick";
import { LibraryAssignmentBrick } from "model/assignment";
import map from "components/map";
import { GENERAL_SUBJECT } from "components/services/subject";
import { AcademyDifficulty } from "../base/AcademyDifficulty";
import BrickTitle from "components/baseComponents/BrickTitle";
import { stripHtml } from "components/build/questionService/ConvertService";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import routes, { playCover } from "components/play/routes";
import { User } from "model/user";
import { isTeacherPreference } from "components/services/preferenceService";
import { CircularProgressbar } from "react-circular-progressbar";
import { checkCompetitionActive } from "services/competition";
import CompetitionLibraryDialog from "components/baseComponents/dialogs/CompetitionLibraryDialog";

interface LibrarySubjectsProps {
  subject: Subject;
  assignment: LibraryAssignmentBrick;
  history: any;
  student: User | null;

  user: User;
}

const SingleSubjectAssignment: React.FC<LibrarySubjectsProps> = (
  props
) => {
  const [activeCompetitionId, setActiveCompetitionId] = React.useState(-1);
  const [hovered, setHover] = React.useState(false);
  const [competitionClicked, setCompetitionClicked] = React.useState(false);

  let className = "assignment";

  const { assignment, subject, history } = props;
  const [height, setHeight] = React.useState(0);

  useEffect(() => {
    if (brick.competitions && brick.competitions.length > 0) {
      const competition = brick.competitions.find(checkCompetitionActive);
      if (competition) {
        setActiveCompetitionId(competition.id);
      }
    }
    /*eslint-disable-next-line*/
  }, []);

  // animate height
  setTimeout(() => {
    const minHeight = 5;
    const height = assignment.bestAttemptPercentScore ? assignment.bestAttemptPercentScore : minHeight;
    setHeight(height);
  }, 200);

  const { brick } = props.assignment;
  if (brick.brickLength) {
    className += " length-" + brick.brickLength;
  } else {
    className += " length-" + BrickLengthEnum.S40min;
  }

  let { color } = subject;
  if (subject.name === GENERAL_SUBJECT) {
    color = "white";
  }

  className += " default";

  const renderRotatedTitle = (name: string, height: number) => {
    let className = "rotated-container " + name;
    let width = "calc(80.4vh - 13.034vw)";
    if (height !== 100) {
      width = `calc((80.4vh - 13.034vw) / 100 * ${height})`;
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

  let isAssignment = false;
  if (brick.assignments) {
    for (let assignment of brick.assignments) {
      for (let student of assignment.studentStatus) {
        if (student.studentId === props.user.id) {
          isAssignment = true;
        }
      }
    }
  }

  const renderTooltip = () => {
    if (hovered) {
      if (height >= 50) {
        return (
          <div className="custom-tooltip subject-tooltip">
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
        );
      }

      if (isAssignment) {
        return (
          <div className="custom-tooltip subject-tooltip b-yellow text-theme-dark-blue">
            <BrickTitle title="This Brick has been assigned to you by a teacher and needs to be played" />
          </div>
        );
      }

      if (height < 50) {
        return (
          <div className="custom-tooltip subject-tooltip b-yellow text-theme-dark-blue">
            <BrickTitle title="To add a book to your shelf, score more than 50% on this brick" />
          </div>
        );
      }
    }
    return '';
  }

  return (
    <div
      className={`assignment-progressbar single-assignment-progressbar ${subject.name === GENERAL_SUBJECT ? 'general' : ''}`}
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
              history.push(map.postAssignment(brick.id, userId));
            }
          } else {
            history.push(routes.playNewPrep(brick));
          }
        }}
        style={{ background: color }}
      >
        {renderTooltip()}
        <div
          className="progress-value default-value"
          onMouseEnter={() => setHover(true)}
        >
          <div className="background" style={{ background: height < 50 ? color : '', opacity: height < 50 ? 0.3 : 0.5 }}>
            {height < 50 && (
              <AcademyDifficulty
                a={assignment.brick.academicLevel}
                brick={brick}
              />
            )}
            {activeCompetitionId > 0 && height < 50 &&
            <div className="competition-star bigger">
              <SpriteIcon name={subject.name === GENERAL_SUBJECT ? "book-star-general" : "book-star"} style={{ color: color, stroke: color, fill: color }} />
            </div>}
          </div>
          {height === 0 && renderRotatedTitle("text-dark-gray", 100)}
          {height < 50 && height > 0 && renderRotatedTitle("white", 100)}
          {height < 50 && height > 0 &&
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
            </div>}
        </div>
        {height >= 50 &&
          <div
            className="progress-value"
            onMouseEnter={() => setHover(true)}
            style={{ background: color, height: height + "%" }}
          >
            {activeCompetitionId > 0 &&
              <div className="competition-star bigger">
                <SpriteIcon name={subject.name === GENERAL_SUBJECT ? "book-star-general" : "book-star"} style={{ color: color, stroke: color, fill: color }} />
              </div>}
            {renderRotatedTitle("white", height)}
            {assignment.brick.academicLevel >= AcademicLevel.First && (
              <AcademyDifficulty
                a={assignment.brick.academicLevel}
                brick={brick}
              />
            )}
          </div>
        }
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

export default connect(mapState)(SingleSubjectAssignment);
