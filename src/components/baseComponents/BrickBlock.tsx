import React from "react";
import Grow from "@material-ui/core/Grow";
import { Box } from "@material-ui/core";

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";

import ShortBrickDescription from "components/baseComponents/ShortBrickDescription";

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

  const move = () => {
    if (props.isPlay) {
      props.history.push(`/play/brick/${brick.id}/intro`);
    } else if (props.isAssignment && props.assignmentId) {
      props.history.push(`/play/brick/${brick.id}/intro?assignmentId=${props.assignmentId}`);
    } else {
      props.history.push(`/build/brick/${brick.id}/investigation/question`);
    }
  }

  if (!brick.id) {
    return (
      <div className="main-brick-container"></div>
    );
  }

  return (
    <Grow
      in={props.shown}
      style={{ transformOrigin: "0 0 0" }}
      timeout={index * 150}
    >
      <div className="main-brick-container" onMouseLeave={props.handleMouseLeave}>
        <Box className={`brick-container ${color}`}>
          <div className={`absolute-container brick-row-${row} ${brick.expanded ? "brick-hover" : ""}`}>
            <ShortBrickDescription
              user={props.user}
              searchString={props.searchString}
              circleIcon={props.circleIcon}
              iconColor={props.iconColor}
              onMouseEnter={props.handleMouseHover}
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
