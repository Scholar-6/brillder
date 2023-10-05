import React from "react";
import Grow from "@material-ui/core/Grow";

import './BrickBlock16x9.scss';
import { AcademicLevelLabels, Brick } from "model/brick";
import { User } from "model/user";

import { fileUrl } from "components/services/uploadFile";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BrickTitle from "components/baseComponents/BrickTitle";

interface BrickBlockProps {
  brick: Brick;
  user: User;
  index: number;
  row: number;
  shown: boolean;
  history: any;
  color?: string;

  searchString: string;

  toggle(b: Brick): void;
}

const BrickBlock16x9Component: React.FC<BrickBlockProps> = ({ brick, index, row = 0, ...props }) => {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  var alternateColor = "";
  let color = "";
  if (!brick.subject) {
    color = "#B0B0AD";
    if (props.color) {
      color = props.color;
    }
  } else {
    color = brick.subject.color;
  }

  if (brick.alternateSubject) {
    alternateColor = brick.alternateSubject.color;
  }

  if (!brick.id) {
    return <div className="main-brick-container"></div>;
  }
  const renderLevelCircles = () => {
    if (alternateColor) {
      return (
        <div className="level before-alternative">
          <div style={{ background: alternateColor }}>
            <div className="level">
              <div style={{ background: color }}>
                {AcademicLevelLabels[brick.academicLevel]}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="level only-one-circle">
        <div style={{ background: color }}>
          {AcademicLevelLabels[brick.academicLevel]}
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
        <div className="flex-brick-container" onClick={() => props.toggle(brick)}>
          <div className="publish-brick-container">
            <div className="checkbox-container-r1">
              {brick.selected
                ?
                <div className="checkbox-container-r2 checked">
                  <SpriteIcon name="checkbox-filled" />
                </div>
                :
                <div className="checkbox-container-r2">
                  <SpriteIcon name="checkbox-empty" />
                </div>
              }
            </div>
            <div className="level-and-length">
              {renderLevelCircles()}
              <div className="length-text-r3">{brick.brickLength} min</div>
            </div>
            {brick.coverImage ?
              <div className="p-cover-image">
                <div className="scroll-block test4" style={{backgroundImage: fileUrl(brick.coverImage)}} />
              </div>
              :
              <div className="p-cover-icon">
                <SpriteIcon name="image" />
              </div>
            }
            <div className="bottom-description-color"></div>
            <div className="bottom-description">
              <BrickTitle className="bold brick-title" title={brick.title} searchString={props.searchString} />
            </div>
          </div>
        </div>
      </Grow>
    </div>
  );
}

export default BrickBlock16x9Component;
