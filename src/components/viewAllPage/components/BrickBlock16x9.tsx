import React from "react";
import Grow from "@material-ui/core/Grow";
import queryString from 'query-string';

import './BrickBlock.scss';
import { AcademicLevelLabels, Brick } from "model/brick";
import { User } from "model/user";

import { playCover } from "components/play/routes";
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

  const moveToBuild = () => {
    props.history.push(buildRoutes.buildQuesitonType(brick.id));
  }

  const move = () => {
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
    const { deadline } = props;
    if (!deadline) {
      return '';
    }
    const date = new Date(deadline);
    let now = Date.now();
    let passesDeadline = false;
    if (date.getTime() < now) {
      passesDeadline = true;
    }
    return (<div className="fwe1-16x9-deadline">
      <div>
        <div className={passesDeadline ? 'orange' : 'yellow'}>{getDate(date)}.{getMonth(date)}.{getYear(date)}</div>
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
      <a href={window.location.origin + map.playCover(brick.id)} className="flex-brick-container" onClick={evt => { evt.preventDefault(); move(); }}>
        <div className="publish-brick-container">
          {renderDeadline()}
          <div className="level">
            <div style={{background: color}}>{AcademicLevelLabels[brick.academicLevel]}</div>
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
