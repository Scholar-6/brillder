import React from "react";

import { Brick } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import routes from "components/play/routes";
import { stripHtml } from "components/build/questionService/ConvertService";

interface BrickBlockProps {
  brick: Brick;
  history: any;
  hide(): void;
}

const PhoneExpandedBrick: React.FC<BrickBlockProps> = ({ brick, history, hide }) => {
  return (
    <div className="va-phone-expanded-brick">
      <div className="va-title-container">
        <div className='va-title' dangerouslySetInnerHTML={{__html: brick.title}} />
        <div className="va-clock-container">
          <SpriteIcon name="clock" />
          {brick.brickLength}
        </div>
      </div>
      <div className="va-brief" dangerouslySetInnerHTML={{__html: stripHtml(brick.brief)}} />
      <div className="va-footer">
        <button className="btn va-right-play" onClick={() => {
          history.push(routes.playBrief(brick.id));
        }}>Play Now</button>
      </div>
    </div>
  );
}

export default PhoneExpandedBrick;
