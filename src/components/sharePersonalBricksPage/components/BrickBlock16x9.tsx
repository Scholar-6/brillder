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

  const move = () => {
    // not moving
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
        <div className="flex-brick-container" onClick={evt => { evt.preventDefault(); move(); }}>
          <div className="publish-brick-container">
            <div className="level-and-length">
              {renderLevelCircles()}
              <div className="length-text-r3">{brick.brickLength} min</div>
            </div>
            {brick.coverImage ?
              <div className="p-cover-image">
                <div className="scroll-block">
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
              <BrickTitle className="bold brick-title" title={brick.title} searchString={props.searchString} />
            </div>
          </div>
        </div>
      </Grow>
    </div>
  );
}

export default BrickBlock16x9Component;
