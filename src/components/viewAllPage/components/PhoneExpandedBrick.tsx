import React from "react";

import { Brick, BrickLengthEnum } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface BrickBlockProps {
  brick: Brick;
}

const PhoneExpandedBrick: React.FC<BrickBlockProps> = ({ brick }) => {
  const move = () => {
  }

  return (
    <div className="va-phone-expanded-brick">
      <div className="va-title-container">
        <div className='va-title' dangerouslySetInnerHTML={{__html: brick.title}} />
        <div className="va-clock-container">
          <SpriteIcon name="clock" />
          {brick.brickLength}
        </div>
      </div>
      <div className="va-brief" dangerouslySetInnerHTML={{__html: brick.brief}} />
      <div className="va-footer">
        <button className="btn va-right-play">Play Now</button>
      </div>
    </div>
  );
}

export default PhoneExpandedBrick;
