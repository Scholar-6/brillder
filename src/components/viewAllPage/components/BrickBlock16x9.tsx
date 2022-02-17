import React from "react";
import Grow from "@material-ui/core/Grow";
import queryString from 'query-string';

import './BrickBlock16x9.scss';
import { AcademicLevelLabels, Brick } from "model/brick";
import { UserPreferenceType, User } from "model/user";
import { ReactComponent as CircleCheck } from 'assets/img/circle-check.svg';

import { playCover } from "components/play/routes";
import { setAssignmentId } from "localStorage/playAssignmentId";
import map from "components/map";
import buildRoutes from 'components/build/routes';
import { fileUrl } from "components/services/uploadFile";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getDate, getMonth, getYear } from "components/services/brickService";
import { AssignmentBrickStatus } from "model/assignment";
import BrickTitle from "components/baseComponents/BrickTitle";
import { CircularProgressbar } from "react-circular-progressbar";

interface BrickBlockProps {
  brick: Brick;
  user: User;
  index: number;
  row: number;
  shown: boolean;
  history: any;
  isPlay?: boolean;
  color?: string;
  circleIcon?: string;
  iconColor?: string;

  searchString: string;

  deadline?: string;

  isViewAll?: boolean;

  // student assignments page
  isAssignment?: boolean;
  isCompleted?: boolean;
  completedDate?: string;
  assignmentStatus?: AssignmentBrickStatus;
  assignmentId?: number;
  bestScore?: number;

  teacher?: User;

  handleDeleteOpen(brickId: number): void;
}

const BrickBlock16x9Component: React.FC<BrickBlockProps> = ({ brick, index, row = 0, ...props }) => {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  let color = "";
  if (!brick.subject) {
    color = "#B0B0AD";
    if (props.color) {
      color = props.color;
    }
  } else {
    color = brick.subject.color;
  }

  let isAssignment = false;
  let assignmentId = -1;

  if (brick.assignments) {
    for (let assignmen of brick.assignments) {
      const assignment = assignmen as any;
      for (let student of assignment.stats.byStudent) {
        if (student.studentId === props.user.id) {
          assignmentId = assignment.id;
          isAssignment = true;
        }
      }
    }
  }

  const moveToBuild = () => {
    props.history.push(buildRoutes.buildPlan(brick.id));
  }

  /**
   * In dashboard Teacher always go to play
   * @returns void
   */
  const move = () => {
    if (isAssignment && assignmentId && props.user.userPreference?.preferenceId !== UserPreferenceType.Teacher) {
      setAssignmentId(assignmentId);
      props.history.push(map.postAssignment(brick.id, props.user.id));
      return;
    }
    if (props.isAssignment && props.assignmentId && props.assignmentStatus != null && props.assignmentStatus !== AssignmentBrickStatus.ToBeCompleted) {
      setAssignmentId(props.assignmentId);
      props.history.push(map.postAssignment(brick.id, props.user.id));
      return;
    }

    if (props.isPlay) {
      const values = queryString.parse(props.history.location.search);
      if (brick.competitions && brick.competitions.length > 0) {
        brick.competitionId = brick.competitions[0].id;
      }
      let link = playCover(brick);
      if (values.newTeacher) {
        link += '?' + map.NewTeachQuery;
      }
      props.history.push(link);
    } else if (props.isAssignment && props.assignmentId) {
      setAssignmentId(props.assignmentId);
      props.history.push(playCover(brick));
    } else {
      moveToBuild();
    }
  }

  if (!brick.id) {
    return <div className="main-brick-container"></div>;
  }

  const renderDeadline = () => {
    if (!props.isAssignment) { return '' }
    let className = '';
    let res = 'NO DEADLINE';

    const { deadline } = props;
    if (deadline) {
      const date = new Date(deadline);
      let now = Date.now();
      if (date.getTime() < now) {
        className = 'orange';
      } else {
        className = 'yellow';
      }
      res = `${getDate(date)}.${getMonth(date)}.${getYear(date)}`;
    } else {
      className = "smaller-blue";
    }

    if (props.isCompleted) {
      className = 'green';
    }

    if (props.completedDate) {
      const date = new Date(props.completedDate);
      className += ' bigger';
      res = `${getDate(date)}.${getMonth(date)}.${getYear(date)}`;
    }

    return (
      <div className="fwe1-16x9-deadline">
        <div>
          <div className={className}>{res}</div>
        </div>
      </div>
    );
  }

  const renderScore = () => {
    if (props.isCompleted && props.bestScore && props.bestScore > 0) {
      return (
        <div className="level score">
          <div style={{ background: 'white' }}>
            {Math.round(props.bestScore)}
          </div>
          <CircularProgressbar
            className="circle-progress-first"
            strokeWidth={10}
            counterClockwise={false}
            value={props.bestScore}
          />
        </div>
      );
    }
    return '';
  }

  const renderCompetitionBanner = () => {
    if (brick.competitions && brick.competitions.length > 0) {
      const foundActive = brick.competitions.find(c => {
        const endDate = new Date(c.endDate);
        const startDate = new Date(c.startDate);
        if (endDate.getTime() > new Date().getTime()) {
          if (startDate.getTime() < new Date().getTime()) {
            return true;  
          }
        }
        return false;
      });
      if (foundActive) {
        return <div className="competition-baner"><SpriteIcon name="star" /> competition</div>
      }
    }
    return '';
  }

  return (
    <div className="animated-brick-container">
      <Grow
        in={props.shown}
        style={{ transformOrigin: "0 0 0" }}
        timeout={index * 150}
      >
        <div className="flex-brick-container" onClick={evt => { evt.preventDefault(); move(); }}>
          {props.isAssignment && props.teacher && <div className="absolute-assignment-title">Assigned by {props.teacher.firstName} {props.teacher.lastName}</div>}
          <div className="publish-brick-container">
            {renderDeadline()}
            <div className="level">
              <div style={{ background: color }}>
                {isAssignment ? <CircleCheck /> : AcademicLevelLabels[brick.academicLevel]}
              </div>
            </div>
            {renderScore()}
            {brick.coverImage ?
              <div className="p-cover-image">
                <div className="scroll-block">
                  {renderCompetitionBanner()}
                  <img alt="" className={imgLoaded ? 'visible' : 'hidden'} onLoad={() => setImgLoaded(true)} src={fileUrl(brick.coverImage)} />
                </div>
              </div>
              :
              <div className="p-cover-icon">
                <SpriteIcon name="image" />
              </div>
            }
            <div className="bottom-description-color"></div>
            <div className="bottom-description">
              {/* <div className="bold brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} /> */}
              <BrickTitle className="bold brick-title" title={brick.title} searchString={props.searchString} />
            </div>
          </div>
        </div>
      </Grow>
    </div>
  );
}

export default BrickBlock16x9Component;
