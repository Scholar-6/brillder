import React from "react";
import Grow from "@material-ui/core/Grow";
import { Box } from "@material-ui/core";
import queryString from 'query-string';

import './BrickBlock.scss';
import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";

import { playCover } from "components/play/routes";
import { setAssignmentId } from "localStorage/playAssignmentId";
import map from "components/map";
import buildRoutes from 'components/build/routes';
import { fileUrl } from "components/services/uploadFile";
import SpriteIcon from "components/baseComponents/SpriteIcon";

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

  handleDeleteOpen(brickId: number): void;
  handleMouseHover(e: any): void;
  handleMouseLeave(e: any): void;
}

const BrickBlockComponent: React.FC<BrickBlockProps> = ({ brick, index, row = 0, ...props }) => {
  let color = "";
  if (!brick.subject) {
    color = "#B0B0AD";
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

  return (
    <div className="animated-brick-container">
    <Grow
      in={props.shown}
      style={{ transformOrigin: "0 0 0" }}
      timeout={index * 150}
    >
      <div className="flex-brick-container" onClick={move}>
        <div className="publish-brick-container" onMouseLeave={props.handleMouseLeave}>
          <div className="level">
            <div style={{background: color}}>III</div>
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
      </div>
    </Grow>
    </div>
  );
}

export default BrickBlockComponent;
