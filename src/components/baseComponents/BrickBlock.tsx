import React from "react";
import Grow from "@material-ui/core/Grow";
import { Box } from "@material-ui/core";
import queryString from 'query-string';

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";

import ShortBrickDescription from "components/baseComponents/ShortBrickDescription";
import { playCover } from "components/play/routes";
import { setAssignmentId } from "localStorage/playAssignmentId";
import map from "components/map";
import buildRoutes from 'components/build/routes';

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
  if (brick.status === BrickStatus.Draft) {
    color = "color1";
  } else if (brick.status === BrickStatus.Review) {
    color = "color2";
  } else if (brick.status === BrickStatus.Build) {
    color = "color3";
  } else if (brick.status === BrickStatus.Publish) {
    color = "color4";
  }

  if (props.color) {
    color = props.color;
  }

  if (props.isPlay) {
    if (!brick.subject) {
      color = "#B0B0AD";
    } else {
      color = brick.subject.color;
    }
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
    <Grow
      in={props.shown}
      style={{ transformOrigin: "0 0 0" }}
      timeout={index * 150}
    >
      <div className="main-brick-container" onMouseLeave={props.handleMouseLeave}>
        <Box className={`brick-container ${color}`}>
          <div className="absolute-container">
            <ShortBrickDescription
              user={props.user}
              searchString={props.searchString}
              circleIcon={props.circleIcon}
              iconColor={props.iconColor}
              handleDeleteOpen={props.handleDeleteOpen}
              move={move}
              color={color}
              brick={brick}
            />
          </div>
        </Box>
      </div>
    </Grow>
  );
}

export default BrickBlockComponent;
