import React from "react";

import { Brick } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import routes from "components/play/routes";
import { stripHtml } from "components/build/questionService/ConvertService";
import { User } from "model/user";
import map from "components/map";

interface BrickBlockProps {
  brick: Brick;
  user?: User;
  history: any;
  hide(): void;
}

const PhoneExpandedBrick: React.FC<BrickBlockProps> = ({ brick, history, user, hide }) => {
  const checkAssignment = (brick: Brick) => {
    if (brick.assignments && user) {
      for (let assignmen of brick.assignments) {
        let assignment = assignmen as any;
        for (let student of assignment.stats.byStudent) {
          if (student.studentId === user.id) {
            return true;
          }
        }
      }
    }
    return false;
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
      <div className="va-brief" dangerouslySetInnerHTML={{__html: stripHtml(brick.brief)}} />
      <div className="va-footer">
        <button className="btn va-right-play" onClick={() => {
          if (user && checkAssignment(brick)) {
            history.push(map.postAssignment(brick.id, user.id));
          } else {
            history.push(routes.playBrief(brick));
          }
        }}>Play Now</button>
      </div>
    </div>
  );
}

export default PhoneExpandedBrick;
