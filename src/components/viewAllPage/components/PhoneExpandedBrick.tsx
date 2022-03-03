import React, { useEffect } from "react";
import LinearProgress from '@material-ui/core/LinearProgress';

import { Brick } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import routes from "components/play/routes";
import { stripHtml } from "components/build/questionService/ConvertService";
import { User } from "model/user";
import map from "components/map";
import { getAttempts } from "services/axios/attempt";

interface BrickBlockProps {
  brick: Brick;
  user?: User;
  history: any;
  hide(): void;
}

const PhoneExpandedBrick: React.FC<BrickBlockProps> = ({ brick, history, user }) => {
  const [bestScore, setBestScore] = React.useState(-1);

  const getBestScore = async () => {
    if (user) {
      const attempts = await getAttempts(brick.id, user.id);
      if (attempts) {
        let maxScore = 0;
        let bestScore = -1;
        for (let i = 0; i < attempts.length; i++) {
          const loopScore = attempts[i].score;
          if (bestScore < loopScore) {
            maxScore = attempts[i].maxScore;
            bestScore = loopScore;
          }
        }

        if (bestScore && maxScore) {
          setBestScore(Math.round((bestScore / maxScore) * 100));
        }
      } else {
        setBestScore(-1);
      }
    }
  }

  // load best score
  useEffect(() => {
    getBestScore();
    /*eslint-disable-next-line*/
  }, [brick]);

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
        <div className='va-title' dangerouslySetInnerHTML={{ __html: brick.title }} />
        <div className="va-clock-container">
          <SpriteIcon name="clock" />
          {brick.brickLength}
        </div>
      </div>
      <div className="va-brief" dangerouslySetInnerHTML={{ __html: stripHtml(brick.brief) }} />
      {
        bestScore > 0 &&
        <div className="va-score">
          <div className="label-container">
            <div>High</div>
            <div>Score</div>
          </div>
          <LinearProgress variant="determinate" value={bestScore} />
          <div className="score-label">
            {bestScore}
          </div>
        </div>
      }
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
