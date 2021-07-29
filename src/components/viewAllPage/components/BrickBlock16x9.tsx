import React from "react";
import Grow from "@material-ui/core/Grow";
import queryString from 'query-string';

import './BrickBlock16x9.scss';
import { AcademicLevelLabels, Brick } from "model/brick";
import { User } from "model/user";
import {ReactComponent as CircleCheck} from'assets/img/circle-check.svg';

import routes, { playCover } from "components/play/routes";
import { setAssignmentId } from "localStorage/playAssignmentId";
import map from "components/map";
import buildRoutes from 'components/build/routes';
import { fileUrl } from "components/services/uploadFile";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getDate, getMonth, getYear } from "components/services/brickService";

interface BrickBlockProps {
  brick: Brick;
  user: User;
  index: number;
  row: number;
  shown: boolean;
  history: any;
  isPlay?: boolean;
  isAssignment?: boolean;
  assignmentId?: number;
  color?: string;
  circleIcon?: string;
  iconColor?: string;

  searchString: string;

  deadline?: string;

  isViewAll?: boolean;

  handleDeleteOpen(brickId: number): void;
}

const BrickBlockComponent: React.FC<BrickBlockProps> = ({ brick, index, row = 0, ...props }) => {
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
      let assignment = assignmen as any;
      for (let student of assignment.stats.byStudent) {
        if (student.studentId === props.user.id) {
          assignmentId = assignment.id;
          isAssignment = true;
        }
      }
    }
  }

  const moveToBuild = () => {
    props.history.push(buildRoutes.buildQuesitonType(brick.id));
  }

  const move = () => {
    if (isAssignment && assignmentId) {
      setAssignmentId(assignmentId);
      props.history.push(map.postAssignment(brick.id, props.user.id));
      return;
    }
    if (props.isPlay) {
      const values = queryString.parse(props.history.location.search);
      let link = playCover(brick.id);
      if (values.newTeacher) {
        link += '?' + map.NewTeachQuery;
      }
      props.history.push(link);
    } else if (props.isAssignment && props.assignmentId) {
      setAssignmentId(props.assignmentId);
      props.history.push(playCover(brick.id));
    } else {
      moveToBuild();
    }
  }

  if (!brick.id) {
    return <div className="main-brick-container"></div>;
  }

  const renderDeadline = () => {
    if (!props.isAssignment) { return '' }
    let className= '';
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
      className="smaller-blue";
    }

    return (<div className="fwe1-16x9-deadline">
      <div>
        <div className={className}>{res}</div>
      </div>
    </div>
    );
  }

  return (
    <div className="animated-brick-container">
    <Grow
      in={props.shown}
      style={{ transformOrigin: "0 0 0" }}
      timeout={index * 150}
    >
      <a href={window.location.origin + routes.playCover(brick.id)} className="flex-brick-container" onClick={evt => { evt.preventDefault(); move(); }}>
        <div className="publish-brick-container">
          {renderDeadline()}
          <div className="level">
            <div style={{background: color}}>
              {isAssignment ?  <CircleCheck /> : AcademicLevelLabels[brick.academicLevel]}
            </div>
          </div>
          {brick.coverImage ?
            <div className="scroll-block">
              <img alt="" src={fileUrl(brick.coverImage)} />
            </div>
            :
            <div className="p-cover-icon">
              <SpriteIcon name="image" />
            </div>
          }
          <div className="bottom-description-color"></div>
          <div className="bottom-description">
            <div className="bold brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
          </div>
        </div>
      </a>
    </Grow>
    </div>
  );
}

export default BrickBlockComponent;
